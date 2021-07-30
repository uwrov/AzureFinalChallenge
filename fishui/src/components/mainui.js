import React from "react";
import "../index.css";

export default class MainUI extends React.Component {
  render() {
    return (
      <div class="main-body">
        <div class="navbar">
          <input type="file" id="input" multiple/>
        </div>
        <div class="content">
          <div class="options">
          </div>
          <div class="videos">
          </div>
          <div class="details">
          </div>
        </div>
      </div>
    );
  }
}
