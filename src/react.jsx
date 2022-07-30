import React from 'react'
import ReactDOM from 'react-dom'

const child1 = React.createElement('p', { title: 'made in heaven' }, 'jo1')
const child2 = React.createElement('span', null, 'jo2')
const node = React.createElement('div', { title: 'jojo' }, child1, child2)



const root = document.getElementById('root')
ReactDOM.render(node, root)
console.log(node)



const dom = (
    <div title="jojo">
        <p title="made in heaven">jo1</p>
        <span>jo2</span>
    </div>
)