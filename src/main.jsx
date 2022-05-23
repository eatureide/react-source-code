/** @jsxRuntime classic */
import React, { useState } from './lib/react'
import ReactDOM from './lib/ReactDOM'
/** @jsx React.createElement */

const App = () => {
  const [name, setName] = useState('zhangsan')
  const [count, setCount] = useState(0)
  return (
    <div id={'react-from-scratch'} className={'shuffle'}>
      <h1 className={'hello'}>{name}</h1>
      <input type="text" value={name} onchange={(e) => setName(e.target.value)} />
      <h1>count:{count}</h1>
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
    </div>
  )
}

export const render = () => {
  const container = document.getElementById('root')
  document.getElementById('root').firstChild?.remove()
  const root = ReactDOM.createRoot(container)
  root.render(<App />)
}

render()