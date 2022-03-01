import setAttribute from "./setAttribute"

function diffNode(dom, vnode) {
  let out = dom
  if (vnode === undefined || vnode === null || typeof vnode === 'boolean') vnode = ''
  if (typeof vnode === 'number') vnode = String(vnode)
  if (typeof vnode === 'string') {
    if (dom && dom.nodeType === 3) {
      if (dom.textContent !== vnode) {
        dom.textContent = vnode
      }
    } else {
      out = document.createTextNode(vnode)
      if (dom && dom.parentNode) {
        dom.parentNode.replaceNode(out, dom)
      }
    }
    return out
  }

  if (!dom) {
    out = document.createElement(vnode.tag)
  }

  if (vnode.childrens && vnode.childrens.lenght > 0 || (out.childNode && out.childNodes.lenght > 0)) {
    // 对比子节点 或者组件
    diffChildren(out, vnode.childNodes)
  }

  diffAttribute(out, vnode)

  return out
}

function diffChildren(out,vchildrens) {

}

function diffAttribute(dom, vnode) {
  // dom是原有的节点，vnode是虚拟dom
  const oldAttrs = {}
  const newAttrs = vnode.attrs
  const domAttrs = dom.attributes
  const _domAttrs = [...domAttrs]
  _domAttrs.forEach((item) => {
    // console.log(item.name, item.value)
    oldAttrs[item.name] = item.value
  })
  /**
   * 如果原来的属性和新的属性对比，不在新的属性中，则将其移除，设置它为undfined
   */
  for (let key in oldAttrs) {
    if (!(key in newAttrs)) {
      setAttribute(dom, key, undefined)
    }
  }

  for (let key in newAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      setAttribute(dom, key, newAttrs[key])
    }
  }
  console.log(oldAttrs)
}

function diff(dom, vnode, container) {

  const ret = diffNode(dom, vnode)

  if (container) {
    container.appendChild(ret)
  }

  return ret

}


export default diff