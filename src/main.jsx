/** @jsxRuntime classic */
import MyReact from './MyReact'


/** @jsx MyReact.createElement */
const container = document.querySelector('#root')

const updateValue = (e) => {
  renderer(e.target.value)
}

const renderer = value => {

  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>看我输入文字{value}</h2>
    </div>
  )

  MyReact.render(element, container)
}

renderer('嘿嘿')