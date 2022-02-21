import React from "./react";
import ReactDOM from "./react-dom";

const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
  </div>
)

ReactDOM.render(ele, document.querySelector('#root'))

// createElement(tag,attr,child1,child2....)

// const ele = React.createElement("div", {
//   className: "active",
//   title: "123"
// }, "hello,", React.createElement("span", null, "react"));

// console.log(ele) 