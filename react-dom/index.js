const ReactDOM = {
  render
}

function render(vnode, container) {
  console.log(vnode)

  // 如果vode是undefined，就什么都不做
  if (vnode === undefined) return

  // 如果是字符串则直接渲染到container
  if (typeof vnode === 'string') {
    const textNode = document.createTextNode(vnode)
    return container.appendChild(textNode)
  }

  // 否则就是虚拟dom对象
  const { tag, attrs } = vnode
  // 创建节点对象
  const dom = document.createElement(tag)

  if (attrs) {
    // 如果有属性
    Object.keys(attrs).forEach((key) => {
      const value = attrs[key]
      setAttribute(dom, key, value)
    })
  }

  // 递归渲染子节点
  vnode.childrens.forEach((child) => {
    render(child, dom)
  })

  return container.appendChild(dom)

}

function setAttribute(dom, key, value) {

  // 将属性名className转换为class
  if (key === 'className') {
    key = 'class'
  }

  // 如果是个事件
  if (/on\w+/.test(key)) {
    // 转成小写
    key = key.toLowerCase()
    dom[key] = value || ''

  } else if (key === 'style') {
    if (!value || typeof value === 'string') {
      dom.style.cssText = value || '';
    } else if (value && typeof value === 'object') {

      for (let k in value) {
        if (typeof value[key] === 'number') {
          dom.style[key] = value[k] + 'px'
        } else {
          dom.style[k] = value[k]
        }
      }
    }
  } else {

    // 其他属性
    if (key in dom) {
      dom[key] = value || ''
    }
    if (value) {
      dom.setAttribute(key, value)
    } else {
      dom.removeAttribute(key)
    }
  }
  
}

export default ReactDOM