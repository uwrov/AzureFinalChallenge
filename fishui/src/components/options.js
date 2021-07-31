import React from "react";
import './options.css'

export default class Options2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fishes: {
        "Sergeant Major": false,
        "Bermuda Chub": false,
        "Yellow Stingray": false,
        "Striped Parrotfish": false,
        "Hogfish": false
      },
      checkedAll: false
    }
  }

  handleAllChecked = (event) => {
    let fishes = {...this.state.fishes};
    for (let key in fishes){
      fishes[key] = event.target.checked;
    }
    this.setState({checkedAll: !this.state.checkedAll});
    this.setState({fishes: fishes});
  }

  handleCheckboxChange = (key, value) => {
    let fishes = {...this.state.fishes};
    fishes[key] = value;
    this.setState({fishes: fishes});
  }

  findCheckedFishes = () => {
    let trueFishes = [];
    Object.entries(this.state.fishes).forEach(([k, v]) => {
      if (v) trueFishes.push(k);
    })
    return trueFishes;
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState && this.state.fishes != prevState.fishes){
      this.props.setFishes(this.findCheckedFishes());
    }
  }

  render() {
    return (
      <div>
      <input type="checkbox" onChange={this.handleAllChecked} checked = {this.state.checkedAll} /> Check / Uncheck All
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
