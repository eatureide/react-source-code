import ReactDOM from './index'

function renderComponent(comp) {
  const renderer = comp.render()
  const base = ReactDOM.renderVnode(renderer)

  // 节点替换,在数据更新的时候
  if (comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base)
  }
  comp.base = base
  return comp
}

export default renderComponent