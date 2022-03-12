import React from './react'
import ReactDOM from './react-dom'

const ele = (
  <div onClick={() => alert('122')} className={'hello'} title="react" style="color:red;font-size:32px">
    <span>123</span>ele1
  </div>
)


// function Home() {
//   return (
//     <div onClick={ () => alert('122') } className={ 'hello' } title="react" style="color:red;font-size:32px">
//       <span>123</span>ele1
//     </div>
//   )
// }

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      num: 0
    }
  }

  componentWillMount() {
    console.log('组件将要加载')
  }

  componentWillReceiveProps(props) {
    console.log('Props')
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
    console.log(this.state.num)
    return (
      <div className={'hello'} title="react" style="color:red;font-size:32px">
      
        {this.state.num}
        <button onClick={this.handleClick.bind(this)}>click</button>
      </div>
    )
  }
}


ReactDOM.render(<Home name="title" />, document.querySelector('#root'))