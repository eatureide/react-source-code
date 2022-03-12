import Component from '../react/component'

const ReactDOM = {
  render
}

function render(vnode, container) {
  return container.appendChild(_render(vnode))
}

function createComponent(comp, props) {
  let inst = null
  // 如果是类定义的组件，则创建实例返回
  if (comp.prototype && comp.prototype.render) {
    inst = new comp(props)
  } else {
    // 如果是函数组件，则转换为类组件。方面统一管理
    inst = new Component(props)
    inst.constructor = comp
    inst.render = function () {
      return inst.constructor(props)
    }
  }
  return inst
}

export function renderComponent(comp) {
  let base = null
  const renderer = comp.render()
  base = _render(renderer)
  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate()
  }

  if (comp.base) {
    // 如果已经有组件，则调用update
    if (comp.componentDidUpdate) {
      comp.componentDidUpdate()
    }
  } else if (comp.componentDidMount) {
    // 如果原先没有组件，则调用didMount
    comp.componentDidMount()
  }

  if (comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base)
  }

  comp.base = base
}

function setComponentProps(comp, props) {
  // 当组件未加载时，也就是未render时，可以执行下面的生命周期方法
  if (!comp.base) {
    if (comp.componentWillMount) {
      comp.componentWillMount()
    } else if (comp.componentWillReceiveProps) {
      comp.componentWillReceiveProps()
    }
  }
  // 设置组件属性
  comp.props = props
  // 渲染组件
  renderComponent(comp)
}

function _render(vnode) {

  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
    vnode = ''
  }

  // 如果只是字符串或者数字
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // 创建文本节点
    const textNode = document.createTextNode(vnode)
    return textNode
  }

  if (typeof vnode.tag === 'function') {
    // 创建组件
    const comp = createComponent(vnode.tag, vnode.attrs)
    // 设置组件属性
    setComponentProps(comp, vnode.attrs)
    // 渲染节点并返回
    return comp.base
  }

  // 否则就是虚拟dom对象
  const { tag, attrs } = vnode
  // 创建节点对象
  const dom = document.createElement(tag)

  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key]
      setAttribute(dom, key, value)
    })
  }

  if (vnode.childrens) {
    vnode.childrens.forEach((child) => {
      render(child, dom)
    })
  }

  return dom
}

function setAttribute(dom, key, value) {
  // 属性名className转换为class
  if (key === 'className') {
    key = 'class'
  }
  // 如果是事件
  if (/on\w/.test(key)) {
    key = key.toLowerCase()
    dom[key] = value || ''
  } else if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || ''
    } else if (value && typeof value === 'object') {
      for (let k in value) {

        if (typeof value[k] === 'number') {
          dom.style[k] = value[k] + 'px'
        } else {
          dom.style[k] = value
        }
      }
    }
  } else {
    // 其他属性
    if (key in dom) {
      dom[key] = value || ''
    }
    // 如果有值
    if (value) {
      dom.setAttribute(key, value)
    } else {
      dom.setAttribute(key, '')
    }
  }
}

export default ReactDOM