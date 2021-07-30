import React from "react";
import Icon from '../assets/dropdown_icon.png';

export default class DropDown extends React.Component {
  state = {
    open: false,
    list: {"1":"a", "2":"b", "3":"c"}
  }

  render() {
    return (
      <div className="dropdown">
        <img src={this.state.image} />
        {this.state.open ? this.renderDropDown() : this.renderIcon()}
        <ul>
          {Object.entries(this.state.list).map((k, v) => {return <li>{k + " " + v}</li>})}
        </ul>
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
      <div>
        <input id="videoInput" type="file" onChange={this.handleFile} />

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

  }
}
