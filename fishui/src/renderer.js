/*
Webpack code
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import MainUI from "./components/mainui.js";

function render() {
  ReactDOM.render(<MainUI />, document.getElementById("root"));
}

render();
