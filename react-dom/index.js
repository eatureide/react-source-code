
import setAttribute from './setAttribute'
import createComponent from './createComponent'

function render(vnode, container) {
  return container.appendChild(renderVnode(vnode))
}

// 根据vnode返回真实dom
function renderVnode(vnode) {

  const vnodeIsNothing = vnode === undefined || vnode === null || vnode === ''
  const vnodeIsNumber = typeof vnode === 'number'
  const vnodeIsString = typeof vnode === 'string'
  const vnodeIsFunction = typeof vnode.tag === 'function'

  const { tag, attrs, childrens } = vnode
  const childrensIsArray = Array.isArray(childrens)

  // 检查vnode的值，如果是空则什么都不做
  if (vnodeIsNothing) vnode = ''
  // 如果是数字则转为字符串
  if (vnodeIsNumber) vnode = String(vnode)
  // 如果vnode类型是string，则直接返回文本节点
  if (vnodeIsString) return document.createTextNode(vnode)

  // 如果vnode是函数组件 
  if (vnodeIsFunction) {
    // 创建组件
    const { tag, attrs } = vnode
    const comp = createComponent(tag, attrs)
    return comp.base
  }

  const dom = document.createElement(tag)

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
      dom.appendChild(renderVnode(item))
    })
  }

  return dom
}

export default {
  render,
  renderVnode
}
