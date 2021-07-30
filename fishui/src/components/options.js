import React from "react";
import './options.css'
import  CheckBox  from './checkbox';

export default class Options2 extends React.Component {
  constructor(props) {
    super(props)
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
    let fishes = this.state.fishes
    for (let key in fishes){
      fishes[key] = event.target.checked
    }
    this.state["checkedAll"] = !this.state["checkedAll"]
    this.setState({fishes: fishes})
  }

  handleCheckboxChange = (event) => {
    let fishes = this.state.fishes
    fishes[event.target.name] = !fishes[event.target.name]
    this.setState({fishes: fishes})
  }

  render() {
    return (
      <div>
      <input type="checkbox" onChange={this.handleAllChecked} checked = {this.state["checkedAll"]} /> Check / Uncheck All
        <ul>
          <li>
           <input onChange={this.handleCheckboxChange} type="checkbox" checked={this.state.fishes["fish_1"]} name={"fish_1"} /> {"fish_1"}
          </li>
          <li>
           <input onChange={this.handleCheckboxChange} type="checkbox" checked={this.state.fishes["fish_2"]} name={"fish_2"} /> {"fish_2"}
          </li>
          <li>
           <input onChange={this.handleCheckboxChange} type="checkbox" checked={this.state.fishes["fish_3"]} name={"fish_3"} /> {"fish_3"}
          </li>
        </ul>
      </div>
    );
  }
}
