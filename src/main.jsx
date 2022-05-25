/** @jsxRuntime classic */
import React from './React'
const ReactDOM = React
/** @jsx React.createElement */

// const jsx = <div>123</div>

// const jsx = React.createElement('div', { id: 'bar' }, '123')
// const jsx = (
//   <div>
//     <p></p>
//     <span></span>
//     <b></b>
//   </div>
// )
// ReactDOM.render(jsx, document.getElementById('root'))
const container = document.getElementById('root')

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  );
  ReactDOM.render(element, container);
};

rerender("World");
