import React, {Component} from 'react';

//Expects the props int videoIdx and video[] videos
export default class TestComponent extends Component {
  state = {
    test: {
      "one": true,
      "two": false,
      "three": true
    }
  }

  constructor(props) {
    super(props);
  }

  render() {
    return(
      <ul>
        <li><input onClick={this.checkAll} type="checkbox" /> Check All </li>
        {Object.entries(this.state.test).map(([k, v]) => {
          return (<li>
            <input onChange={(event) => this.toggleCheck(k, event.target.checked)} type="checkbox" checked={v} /> {k}
          </li>);
        })}
      </ul>
    );
  }

  checkAll = () => {
    this.setState({test: {
      "one": true,
      "two": true,
      "three": true
    }})
  }

  toggleCheck = (key, value) => {
    let newTest = {...this.state.test};
    newTest[key] = value;
    this.setState({test: newTest});
  }
}
