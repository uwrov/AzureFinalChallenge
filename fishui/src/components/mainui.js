import React from "react";
import "../index.css";

import DropDown from "./dropdown";
import VideoSection from "./videosection";
import Options from "./options"

const SERVER_PORT = "4040";
const LOCAL_HOST = "localhost";
const REMOTE_HOST = "does not exist";
const DEFAULT_URL = LOCAL_HOST;

export default class MainUI extends React.Component {
  state = {
    socket: generateSocket(DEFAULT_URL),
    isLocal: true,
    video: null,
    fishes: [],
    resultVideos: []
  }

  render() {
    return (
      <div className="main-body">
        <div className="navbar">
          <DropDown setVideo={this.setVideo} />
          <input className="url-input" type="button" onClick={this.toggleConnection}
              value={this.state.isLocal ? "Local Connection" : "Remote Connection"}/>
          <button className="analyze-button" onClick={this.uploadVideo}>Analyze</button>
        </div>
        <div className="content">
          <div className="options">
            <Options/>
          </div>
          <div className="videos">
            <VideoSection video={this.state.video} />
          </div>
          <div className="details">
          </div>
        </div>
      </div>
    );
  }

  setVideo = (video) => {
    this.setState({video: video});
  }

  toggleConnection = () => {
    if(this.state.isLocal) {
      this.state.socket.disconnect();
      this.setState({socket: generateSocket(REMOTE_HOST), isLocal: false});
    } else {
      this.state.socket.disconnect();
      this.setState({socket: generateSocket(LOCAL_HOST), isLocal: true});
    }
  }

  uploadVideo = () => {
    if(this.state.video) {
      this.state.socket.emit("Send Video", {"video": this.state.video, "fishes": this.state.fishes})
    } else {
      alert("Make sure to pick a Video!");
    }
  }
}

function generateSocket(domain) {
  return require("socket.io-client")("http://" + domain + ":" + SERVER_PORT);
}
