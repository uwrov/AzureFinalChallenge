import React from "react";
import './options.css'

export default class Options2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fishes: {
        "fish_1": false,
        "fish_2": false,
        "fish_3": false,
      },
      "checkedAll": false
    }
  }

  handleAllChecked = (event) => {
    let fishes = {...this.state.fishes};
    for (let key in fishes){
      fishes[key] = event.target.checked;
    }
    this.state["checkedAll"] = !this.state["checkedAll"];
    this.setState({fishes: fishes});
  }

  handleCheckboxChange = (key, value) => {
    let fishes = {...this.state.fishes};
    fishes[key] = value;
    this.setState({fishes: fishes});
  }


  render() {
    return (
      <div>
      <input type="checkbox" onChange={this.handleAllChecked} checked = {this.state["checkedAll"]} /> Check / Uncheck All
        <ul>
          {Object.entries(this.state.fishes).map(([k, v]) => {
            return(<li>
              <input onChange={(event) => this.handleCheckboxChange(k, event.target.checked)} type="checkbox" checked={v} /> {k}
            </li>);
          })}
        </ul>
      </div>
    );
  }
}
