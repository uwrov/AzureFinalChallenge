import React from "react";
import "../index.css";

import DropDown from "./dropdown";
import VideoSection from "./videosection";
import Options from "./options"
import DataDisplay from "./dataDisplay";
import { saveAs } from 'file-saver';

const SERVER_PORT = "80";
const LOCAL_HOST = "localhost";
const REMOTE_HOST = "40.112.128.156";
const DEFAULT_URL = REMOTE_HOST;

export default class MainUI extends React.Component {
  state = {
    host: DEFAULT_URL,
    isLocal: false,
    video: null,
    fishes: [],
    resultVideos: [],
    resultDatas: [],
    resultIndex: -1,
    analyzing: false
  }

  render() {
    return (
      <div className="main-body">
        <div className="navbar">
          <DropDown setVideo={this.setVideo}
              handleVideoDownload={this.downloadVideo}
              handleDataDownload={this.downloadData}/>
          <button className="url-input" onClick={this.toggleConnection}>
            {this.state.isLocal ? "Local Connection" : "Remote Connection"}</button>
          <button className="analyze-button" disabled={this.state.analyzing}
              onClick={this.uploadVideo}>Analyze</button>
        </div>
        <div className="content">
          <div className="options">
          <Options setFishes={this.setFishes}/>
          </div>
          <div className="videos">
            <div className="tab-section">{this.renderTabs()}</div>
            {this.renderVideo()}
          </div>
          <div className="details">
            {
              this.renderData()
            }
          </div>
        </div>
      </div>
    );
  }

  renderTabs() {
      const tabs = [];
      if(this.state.video != null) {
        tabs.push((<div className="video-tab" onClick={() => this.setTab(-1)}>Original</div>))
      }
      tabs.push(this.state.resultVideos.map((k, i) => {
        return (
          <div className="video-tab" onClick={() => this.setTab(i)}>Analysis {i+1}</div>
        )
      }));
      return tabs;
  }

  renderVideo() {
      if(this.state.resultIndex === -1) {
        return <VideoSection video={this.state.video} />
      } else {
        return <VideoSection video={this.state.resultVideos[this.state.resultIndex]} />
      }
  }

  renderData() {
    if (this.state.resultIndex >= 0) {
      return (
        <DataDisplay data={this.state.resultDatas[this.state.resultIndex]} />
      );
    } else {
      return (<div className="data-display">No Analysis Selected</div>);
    }
  }

  setTab = (index) => {
    this.setState({resultIndex: index});
  }

  setVideo = (video) => {
    this.setState({video: video});
  }

  toggleConnection = () => {
    if(this.state.isLocal) {
      this.setState({host: REMOTE_HOST, isLocal: false});
    } else {
      this.setState({host: LOCAL_HOST, isLocal: true});
    }
  }

  uploadVideo = () => {
    if(this.state.analyzing) {
      alert("Analysis has already been sent");
      return;
    }
    if(this.state.video) {
      if(this.state.fishes.length === 0) {
        alert("Must check off fish to detect!");
        return;
      }
      this.setState({analyzing: true})
      fetch(this.getServerURL() + ':' + SERVER_PORT + '/send_video', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors', // no-cors, *cors, same-origin
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify({
          'video':this.state.video,
          'fishes': this.state.fishes
        })
      }).then(response => {
        return response.json();
      }).then(json => {
        console.log(json);
        this.addVideos(json);
      }).then(() => {
        this.setState({analyzing: false});
      }).catch((error) => {
        this.setState({analyzing: false});
        alert(error + " " + this.getServerURL());
      });
    } else {
      alert("Make sure to upload a Video!");
    }
  }

  setFishes = (fishes) => {
    this.setState({fishes: fishes})
  }

  addVideos = (json) => {
    const newVideos = [...this.state.resultVideos];
    const newDatas = [...this.state.resultDatas];
    newVideos.push(json.video);
    newDatas.push(json.detections);
    this.setState({resultVideos: newVideos, resultDatas: newDatas})
  }

  downloadVideo = () => {
    console.log("downloading!");
    let item = null;
    if(this.state.resultIndex == -1) {
      item = this.state.video
    } else {
      item = this.state.resultVideos[this.state.resultIndex];
    }
    if(item != null) {
      const fixedBase64 = item.slice(22, item.length);
      saveAs(generateBase64Blob(fixedBase64), "video.mp4");
    } else {
      alert("No video is focused!");
    }
  }

  downloadData = () => {
    let item = null;
    if(this.state.resultIndex >= 0) {
      item = this.state.resultDatas[this.state.resultIndex];
    }
    if(item != null) {
      const csv = generateCSV(item);
      const csvBlob = new Blob([csv], {type:'text/plain'});
      saveAs(csvBlob, "data.csv");
    } else {
      alert("No data is focused!");
    }
  }

  getServerURL() {
    return 'http://'+ this.state.host;
  }
}

function generateBase64Blob(b64Data, contentType='', sliceSize=512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function generateCSV(json) {
  const header = ["id", ...Object.keys(json)]
  const csv = [
    header.join(','), // header row first
    ...Object.entries(json["fish type"]).map(([k,v]) => {
      return (
            k+","+v+","+json["timestamp"][k]
      )})
  ].join('\r\n');

  return csv;
}
