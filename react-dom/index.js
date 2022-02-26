import Component from '../react/component'

const ReactDOM = {
  render
}

function render(vnode, container) {
  return container.appendChild(_render(vnode, container))
}

function createComponent(comp, props) {

  let inst = null
  // 如果是类定义的组件，则创建实例
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props)
  } else {
    // 如果是函数组件，将函数组件转换为类组件，方便后面统一管理
    inst = new Component(props)
    inst.constructor = comp
    // 定义render函数
    inst.render = function() {
      return this.constructor(props)
    }
  }

  return inst
}

function setComponentProps(comp, props) {
  if (!comp.base) {
    if (comp.componentWillMount) comp.componentWillMount()
  } else if (comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps()
  }
  // 设置组件属性
  comp.props = props
  // 渲染组件
  renderComponent(comp)
}


export function renderComponent(comp) {
  let base = null
  const renderer = comp.render() // jsx对象
  base = _render(renderer) // js节点对象
  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate()
  }
  if (comp.base) {
    if (comp.componentDidUpdate) comp.componentDidUpdate()
  } else if (comp.componentDidMount) {
    comp.componentDidMount()
  }
  if (comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base)
  }
  comp.base = base

}

/**
 * 函数render接收两个参数
 * vnode，一个是jsx对象（也就是babel转换后的对象）
 * container，经过render内逻辑处理后被插入的节点
 */
function _render(vnode, container) {

  // 如果vnode是undefine、null、boolean类型，则把它置为空
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = ''
  }

  if (typeof vnode === 'number') {
    vnode = String(vnode)
  }


  // 如果传入的vnode是一个字符串的话，则创建text节点并插入到指定的节点后返回即可
  if (typeof vnode === 'string') {
    return document.createTextNode(vnode)
  }

  // 如果vnode是一个函数，则渲染组件
  if (typeof vnode.tag === 'function') {
    // 1、创建组件
    const comp = createComponent(vnode.tag, vnode.attrs)
    // // 2、设置组件属性
    setComponentProps(comp, vnode, attrs)
    // // 3、组件渲染的节点对象返回
    return comp.base
  }

  // 如果vnode是对象的话，则先获取tag和attrs属性
  const {
    tag,
    attrs
  } = vnode

  const dom = document.createElement(tag)

  // 如果有自定义属性attrs，则遍历该对象，将它逐步设置在指定的dom上，这里的dom注意可能是vode第一级tag，也有可能是child内的tag，因为会做递归
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key]
      setAttribute(dom, key, value)
    })
  }

  // 遍历子节点，逐步递归到vnode为空为止
  if (vnode.childrens) {
    vnode.childrens.forEach((child) => {
      render(child, dom)
    })

  }


  return dom
}

/** 
 * 函数setAttribute接受三个参数
 * dom，将要处理的节点
 * key，设置dom属性的名称
 * value，设置dom属性的值
*/
function setAttribute(dom, key, value) {

  // 将属性名className转换为class
  if (key === 'className') {
    key = 'class'
  }

  // 如果是个事件(因为react的检测规则，需要以on开头)，将属性直接设置进dom内
  if (/on\w+/.test(key)) {
    // 转成小写
    key = key.toLowerCase()
    dom[key] = value || ''
  }

  //  如果是style
  else if (key === 'style') {

    // style可能会是对象，或者是字符串，如果是字符串的话直接设置csstext
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    }
    // 如果style是对象，则遍历对象并设置进dom内
    else if (value && typeof value === 'object') {

      for (let k in value) {
        // number的话帮它加入单位，这里是简单处理
        if (typeof value[key] === 'number') {
          dom.style[key] = value[k] + 'px'
        } else {
          dom.style[k] = value[k]
        }
      }
    }
  }
  // 既不事件，也不是style样式
  else {

    // 如果这个属性dom已经有了，则直接更新
    if (key in dom) {
      dom[key] = value || ''
    }

    // 有value的话则设置属性和值
    if (value) {
      dom.setAttribute(key, value)
    }
    else {
      // 没有的话只设置属性
      dom.removeAttribute(key)
    }
  }

}

export default ReactDOM


