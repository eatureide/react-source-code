function diffNode(dom, vnode) {

}


function diff(dom, vnode, container) {
  let out = dom
  const vnodeIsString = vnode === 'string' && dom.nodeType === 3

  if (vnodeIsString && dom.textContent !== vnode) {
    dom.textContent = vnode
  } else {
    // 如果dom不是文本节点，则新建一个文本节点dom，并移除原来的dom
    console.log(vnode)
    out = document.createTextNode(vnode)
    if (dom && dom.parentNode) {
      dom.parentNode.replaceChild(out, dom)
    }

    return out
  }

  return out
}


export default diff