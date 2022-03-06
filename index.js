import React from './react'
import ReactDOM from './react-dom'

const ele = (
  <div onClick={ () => alert('122') } className={ 'hello' } title="react" style="color:red;font-size:32px">
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
  render() {
    return (
      <div onClick={ () => alert('122') } className={ 'hello' } title="react" style="color:red;font-size:32px">
        <span>123</span>ele1
      </div>
    )
  }
}


ReactDOM.render(<Home name="title" />, document.querySelector('#root'))