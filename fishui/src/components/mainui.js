import React from "react";
import "../index.css";

import Options from "./options"
export default class MainUI extends React.Component {
   state = {
      fishToDetect: []
   }
  render() {
    return (
      <div class="main-body">
        <div class="navbar">
          <input type="file" id="input" multiple/>
        </div>
        <div class="content">
          <div class="options">
          <Options/>
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
