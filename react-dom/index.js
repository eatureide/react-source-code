
import React from '../react'
import setAttribute from './setAttribute'


function render(vnode, container) {
  return container.appendChild(_render(vnode))
}

export function renderComponent(comp) {
  let base
  const renderer = comp.render()
  base = _render(renderer)

  // 节点替换,在数据更新的时候
  if (comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base)
  }
  comp.base = base
}

// 创建组件
function createComponent(comp, props) {
  let inst = undefined

  // 如果是类组件则直接new，如果是函数组件，则封装成类组件
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props)
    inst.props = props
    inst.base = _render(inst.render(props))
    return inst
  }

  // 要注意，函数的props不是指组件内的属性，指的是该函数的传参props
  inst = new React.Component(props)
  inst.constructor = comp
  // 当创建好实例后，添加render方法，返回函数体内的jsx对象
  inst.render = function () {
    return this.constructor(props)
  }

  inst.props = props
  renderComponent(comp)
  inst.base = _render(inst.render(props))


  return inst
}

function _render(vnode) {

  // 检查vnode的值，如果是空则什么都不做
  if (vnode === undefined || vnode === null || vnode === '') {
    vnode = ''
  }

  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }

  // 如果vnode类型是string，则直接返回文本节点
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  // 如果vnode是函数组件 
  if (typeof vnode.tag === 'function') {
    // 创建组件
    // return _render(vnode.tag(vnode.attrs)) // (其实这里不明白为什么不直接执行tag并渲染vnode)
    const { tag, attrs } = vnode
    const comp = createComponent(tag, attrs)
    return comp.base
  }

  const { tag, attrs, childrens } = vnode
  const childrensIsArray = Array.isArray(childrens)

  let dom = document.createElement(tag)

  // 检查attrs，遍历该对象，并使用setAttribute方法设置dom属性
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key]
      setAttribute(dom, key, value)
    })
  }

  // 如果该对象还有子元素，则递归调用生成
  if (childrensIsArray && childrens.length) {
    childrens.forEach((item) => {
      dom.appendChild(_render(item))
    })
  }

  return dom
}

export default {
  render,
  renderComponent
}
