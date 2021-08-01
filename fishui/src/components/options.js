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
    Object.entries(fishes).forEach(([k, v]) => {
      fishes[k] = event.target.checked
    })
    this.setState({checkedAll: !this.state.checkedAll});
    this.setState({fishes: fishes});
  }

  handleCheckboxChange = (key, value) => {
    let fishes = {...this.state.fishes};
    fishes[key] = value;
    this.setState({fishes: fishes});
    console.log(key + value)
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
      <div className="options-content">
      <input className="checkall-input" type="checkbox" onChange={this.handleAllChecked}
          checked = {this.state.checkedAll} /> Check All
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
