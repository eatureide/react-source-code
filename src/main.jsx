/** @jsxRuntime classic */
import React from './_MyReact'
/** @jsx React.createElement */

// const element = {
//   type: 'h1',
//   props: {
//     title: 'foo',
//     children: 'Hello',
//   },
// }

// const element = (
//   <div id="foo">
//     <h2>h2</h2>
//     <b />
//   </div>
// )

// const element = (
//   <div>
//     <a />
//     <span />
//     <b />
//   </div>
// )

// const updateValue = e => {
//   rerender(e.target.value)
// }
const container = document.getElementById('root')
// const rerender = value => {
//   const element = (
//     <div>
//       <input onInput={updateValue} value={value} />
//       <h2>Hello {value}</h2>
//     </div>
//   )
//   React.render(element, container)
// }
// rerender("World")

// function App(props) {
//   return <h1>Hi {props.name}</h1>
// }
// const element = <App name="foo" />

function Counter() {
  const [state, setState] = React.useState(1)
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  )
}
const element = <Counter />


// const element = (
//   <div>
//     <h1>
//       <p />
//       <a />
//     </h1>
//     <h2 />
//   </div>
// )


// const container = document.getElementById('root')
React.render(element, container)
