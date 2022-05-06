import MyReact from './_MyReact'

const element = MyReact.createElement(
  'div',
  {
    title: 'hello',
    id: 'sky'
  },
  'world',
  MyReact.createElement('a', null, '我是a标签')
)

const container = document.querySelector('#root')

MyReact.render(
  element,
  container
)