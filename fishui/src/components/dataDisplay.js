import React from "react";
import "./dataDisplay.css";

export default class DataDisplay extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="data-display">
        <h3>Analysis Summary</h3>
        <ul>
          {this.generateFishList()}
        </ul>
        <h4>Totals</h4>
        <ul>
          {this.getFishSummary()}
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

  getFishSummary() {
    if(this.props.data) {
      let fishes = {}
      Object.entries(this.props.data["fish type"]).forEach(([k, v]) => {
        if(fishes[v]) fishes[v]++;
        else fishes[v] = 1;
      });
      return Object.entries(fishes).map(([k,v]) => {
        return (<li>{k + ": " + v}</li>)
      })
    }
  }
}
