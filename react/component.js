import ReactDOM from '../react-dom'

class Component {
  constructor (props) {
    this.props = props
    this.state = {}
  }

  setState(stateChange) {
    Object.assign(this.state, stateChange)
    // 渲染对象
    ReactDOM.renderComponent(this)

  }
}

export default Component