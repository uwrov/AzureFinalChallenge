import React from "react";
import Icon from '../assets/dropdown_icon.png';

import "./dropdown.css";

export default class DropDown extends React.Component {
  state = {
    open: false,
  }

  render() {
    return (
      <div className="dropdown">
        {this.renderIcon()}
        {this.state.open ? this.renderDropDown() : null}
      </div>
    );
  }

  renderIcon() {
    return (
      <img className="dropdown-icon" onClick={this.toggleOpen} src={Icon}/>
    )
  }

  renderDropDown() {
    return (
      <div className="dropdown-inputs">
          <input id="videoInput" type="file" onChange={this.handleFile} />
          <input type="button" className="download"
              value="Download Video" onClick={() => {
                this.props.handleVideoDownload();
                this.toggleOpen();
              }} />
          <input type="button" className="download"
              value="Download Data" onClick={() => {
                this.props.handleDataDownload();
                this.toggleOpen();
              }} />
      </div>
    )
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open })
  }

  handleFile = (event) => {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.props.setVideo(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    this.toggleOpen();
  }
}
