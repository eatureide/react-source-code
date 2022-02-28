import React from "./react"
import ReactDOM from './react-dom'

const ele = (
  <h1
    title="react"
    className="title"
    style={ { color: 'blue', fontSize: 80 } }
    onClick={ () => alert(123) }>hi</h1>
)

const Home = (props) => {
  return (
    <h1
      { ...props }
      title="react"
      className="title"
      style={ { color: 'blue', fontSize: 80 } }
      onClick={ () => alert(123) }>hi</h1>
  )
}

class A extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      num: 0
    }
  }

  handleClick() {
    this.setState({ num: this.state.num + 1 })
  }

  render() {
    return (
      <h1
        title="react"
        className="title"
        style={ { color: 'blue', fontSize: 80 } }
        onClick={ () => {
          this.handleClick()
        } }>
        { this.state.num }
        <span>hi</span>
      </h1>
    )
  }
}

// console.log(<A />, '当前传参的组件')

ReactDOM.render(<A />, document.querySelector('#root'))
