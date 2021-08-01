import React from "react";
import "./dataDisplay.css";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="data-display">
        <h3>List of fishes</h3>
        <ul>
          {this.generateFishList()}
        </ul>
      </div>
    );
  }

  generateFishList() {
    if(this.props.data) {
      return Object.entries(this.props.data["fish type"]).map(([k,v]) => {
        return (
          <li>
            {
              "ID:" + k + " " + v +
              "\n" +
              this.props.data["timestamp"][k]
            }
          </li>
        )
      });
    }
  }
}
