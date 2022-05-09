/** @jsxRuntime classic */
import MyReact from './MyReact'


/** @jsx MyReact.createElement */
const container = document.querySelector('#root')


function App() {
  const [number, setNumber] = MyReact.useState(0)
  const [visible, setVisible] = MyReact.useState(true)

  return (
    <div>
      <button onClick={() => {
        setNumber(number + 1)
        setVisible(!visible)
      }}>点我啊！</button>
      <h1>{number}</h1>
      {
        visible ? <h2>你看到我了</h2> : null
      }
    </div>
  )

}

MyReact.render(<App />, container)