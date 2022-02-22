import React from "./react";
import ReactDOM from "./react-dom";

const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
  </div>
)

function Home() {
  return (
    <div className="active" title="123">
      hello,<span>react</span>
    </div>
  )
}

// console.log(<Test />)

ReactDOM.render(<Home />, document.querySelector('#root'))
