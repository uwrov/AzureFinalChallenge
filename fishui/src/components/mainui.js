import React from "react";
import "../index.css";

import DropDown from "./dropdown";
import VideoSection from "./videosection";
import Options from "./options";
import DataDisplay from "./dataDisplay";

const SERVER_PORT = "4040";
const LOCAL_HOST = "localhost";
const REMOTE_HOST = "does not exist";
const DEFAULT_URL = LOCAL_HOST;

const LOCAL_SOCKET = generateSocket(LOCAL_HOST);
const REMOTE_SOCKET = generateSocket(REMOTE_HOST);

const TEST = {
    "fish type": {
        "0": "s-major",
        "1": "s-major",
        "2": "s-major",
        "18": "s-major",
        "19": "s-major",
        "20": "s-major",
        "22": "s-major",
        "29": "s-major",
        "31": "s-major",
        "32": "s-major",
        "33": "s-major",
        "35": "s-major"
    },
    "timestamp": {
        "0": "0:00",
        "1": "0:00",
        "2": "0:01",
        "18": "0:06",
        "19": "0:06",
        "20": "0:06",
        "22": "0:07",
        "29": "0:07",
        "31": "0:08",
        "32": "0:08",
        "33": "0:08",
        "35": "0:09"
    }
}

function generateSocket(domain) {
  return require("socket.io-client")("http://" + domain + ":" + SERVER_PORT);
}

export default class MainUI extends React.Component {
  state = {
    socket: LOCAL_SOCKET,
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
            {this.state.isLocal ? "Local Connection" : "Remote Connection"}
          </button>
          <button className="analyze-button" onClick={this.uploadVideo}>Analyze</button>
          <button type="submit" onClick={this.returnFlaskPost}>hello</button>
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
            {this.renderData()}
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
          <div className="video-tab" onClick={() => this.setTab(i)}>Analysis {i}</div>
        )
      }));
  }

  renderVideo() {
      if(this.state.resultIndex === -1) {
        return <VideoSection video={this.state.video} />
      } else {
        return <VideoSection video={this.state.resultVideos[this.state.resultIndex]} />
      }
  }

  renderData() {
    if (true) { //this.state.resultIndex >= 0) {
      return (
        <DataDisplay data={TEST//this.state.resultDatas[this.state.resultIndex]
        } />
      );
    } else {
      return (<div className="data-display">No Data</div>);
    }
  }

  setTab = (index) => {
    this.setState({resultIndex: index});

  returnFlaskPost = () => {
    return fetch( 'http://localhost:4040/hello', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        hello:'world'
      })
    });
  }

  setVideo = (video) => {
    this.setState({video: video});
  }

  toggleConnection = () => {
    if(this.state.isLocal) {
      this.setState({socket: REMOTE_SOCKET, isLocal: false});
    } else {
      this.setState({socket: LOCAL_SOCKET, isLocal: true});
    }
  }

  uploadVideo = () => {
    if(this.state.video) {
      fetch( 'http://localhost:4040/send_video', {
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
      }).then(console.log("here")) ;
    } else {
      alert("Make sure to pick a Video!");
    }
  }

  setFishes = (fishes) => {
    this.setState({fishes: fishes})
    this.state.socket.emit("Send Video", {"fishes": this.state.fishes});
  }
}
