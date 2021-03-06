import React from "react";
import './options.css'

export default class Options2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fishes: {
        "Sergeant Major": true,
        "Bermuda Chub": true,
        "Yellow Stingray": true,
        "Striped Parrotfish": true,
        "Hogfish": true
      },
      checkedAll: true
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

  componentDidMount() {
    this.props.setFishes(this.findCheckedFishes());
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
