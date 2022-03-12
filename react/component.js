import { renderComponent } from '../react-dom'

class Component {
  constructor(props) {
    this.state = {}
    this.props = props
  }
  setState(changer) {
    this.state = Object.assign(this.state, changer)
    renderComponent(this)
  }
}

export default Component