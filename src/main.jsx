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

const element = (
  <div id="foo">
    <h2>h2</h2>
    <b />
  </div>
)

// const element = (
//   <div>
//     <h1>
//       <p />
//       <a />
//     </h1>
//     <h2 />
//   </div>
// )

// console.log(element)

const container = document.getElementById('root')
React.render(element, container)
