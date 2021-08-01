import React from "react";
import "../index.css";

import DropDown from "./dropdown";
import VideoSection from "./videosection";
import Options from "./options"
import DataDisplay from "./dataDisplay";

const SERVER_PORT = "4040";
const LOCAL_HOST = "localhost";
const REMOTE_HOST = "does not exist";
const DEFAULT_URL = LOCAL_HOST;

export default class MainUI extends React.Component {
  state = {
    socket: generateSocket(DEFAULT_URL),
    url: DEFAULT_URL,
    isLocal: true,
    video: null,
    fishes: [],
    resultVideos: [],
    resultDatas: [],
    resultIndex: -1
  }

  render() {
    return (
      <div className="main-body">
        <div className="navbar">
          <DropDown setVideo={this.setVideo} />
          <button className="url-input" onClick={this.toggleConnection}>
            {this.state.isLocal ? "Local Connection" : "Remote Connection"}</button>
          <button className="analyze-button" onClick={this.uploadVideo}>Analyze</button>
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
      return (<div className="data-display">No Data</div>);
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
      this.state.socket.disconnect();
      this.setState({socket: generateSocket(REMOTE_HOST), isLocal: false, url: REMOTE_HOST});
    } else {
      this.state.socket.disconnect();
      this.setState({socket: generateSocket(LOCAL_HOST), isLocal: true, url: LOCAL_HOST});
    }
  }

  uploadVideo = () => {
    if(this.state.video) {
      fetch('http://' + this.state.url + ':' + SERVER_PORT + '/send_video', {
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
      }).catch((error) => {
        console.log(error);
      })
    } else {
      alert("Make sure to pick a Video!");
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
}

function generateSocket(domain) {
  return require("socket.io-client")("http://" + domain + ":" + SERVER_PORT);
}
