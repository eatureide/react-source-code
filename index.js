import React from "./react";
import ReactDOM from "./react-dom";

const ele = (
  <div className="active" title="123">
    hello,<span>react</span>
  </div>
)

// function Home() {
//   return (
//     <div className="active" title="123">
//       hello,<span>react</span>
//     </div>
//   )
// }

class Home extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      num: 0
    }
  }

  componentWillMount() {
    console.log('组件将要加载')
  }

  componentWillReceiveProps(props) {
    console.log('props')
  }

  componentWillUpdate() {
    console.log('组件将要更新')
  }

  componentDidUpdate() {
    console.log('组件更新完成')
  }

  componentDidMount() {
    console.log('组件加载完成')
  }

  handleClick() {
    this.setState({
      num: this.state.num + 1
    })
  }

  render() {
    return (
      <div className="active" title="123">
        hello,<span>react</span>
        <p>{ this.state.num }</p>
        <button onClick={ () => this.handleClick() }>click me</button>
      </div>
    )
  }
}

// console.log(<Test />)

ReactDOM.render(<Home />, document.querySelector('#root'))
