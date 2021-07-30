import React from "react";
import "../index.css";

import DropDown from "./dropdown";
import VideoSection from "./videosection";

//const socket = require("socket.io-client")("http://localhost:4040");

export default class MainUI extends React.Component {
  state = {
    video: null,
    fishes: []
  }

  render() {
    return (
      <div className="main-body">
        <div className="navbar">
          <DropDown setVideo={this.setVideo} />
          <button onClick={this.sendVideo}>Analyze</button>
        </div>
        <div class="content">
          <div class="options">
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
    console.log(video);
    this.setState({video: video});
  }
}
