import React from "react";
import "../index.css";

import DropDown from "./dropdown";
import VideoSection from "./videosection";
import Options from "./options"

const SERVER_PORT = "4040";
const LOCAL_HOST = "localhost";
const REMOTE_HOST = "does not exist";
const DEFAULT_URL = LOCAL_HOST;

const LOCAL_SOCKET = generateSocket(LOCAL_HOST);
const REMOTE_SOCKET = generateSocket(REMOTE_HOST);

function generateSocket(domain) {
  return require("socket.io-client")("http://" + domain + ":" + SERVER_PORT);
}

export default class MainUI extends React.Component {
  state = {
    socket: LOCAL_SOCKET,
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
           <button type="submit" className="analyze-button" onClick={this.uploadVideo} >Analyze</button>
        </div>
        <div className="content">
          <div className="options">
          <Options setFishes={this.setFishes}/>
          </div>
          <div className="videos">
            <VideoSection video={this.state.video} />
          </div>
          <div className="details">
          <button type="submit" onClick={this.returnFlaskPost}>hello</button>
          </div>
        </div>
      </div>
    );
  }

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
      console.log('switching to remote')
      this.setState({socket: REMOTE_SOCKET, isLocal: false});
    } else {
      console.log('switching to local')
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
