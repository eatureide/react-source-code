import React from '../react'
import renderComponent from './renderComponent'

function createComponent(comp, props) {
  let inst = undefined

  // 如果是类组件，则直接创建实例
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props)
    inst = renderComponent(inst)
    return inst
  }

  // 要注意，函数的props不是指组件内的属性，指的是该函数的传参props
  inst = new React.Component(props)
  inst.constructor = comp
  // 当创建好实例后，添加render方法，返回函数体内的jsx对象
  inst.render = function() {
    return this.constructor(props)
  }

  inst = renderComponent(inst)
  return inst
}

export default createComponent