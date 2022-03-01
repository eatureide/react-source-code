import ReactDOM from './index'

function renderComponent(comp) {
  const renderer = comp.render()
  const base = ReactDOM.renderVnode(renderer)

  // 组件的base还未生成，并且有componentWillMount
  if (!comp.base && comp.componentWillMount) {
    comp.componentWillMount()
  }

  // 组件原先有bas饿了，又有componentWillUpdate
  if (comp.base && comp.componentWillUpdate) {
    comp.componentWillUpdate()
  }

  // 组件原先有bas了，又有componentWillReceiveProps
  if (comp.base && comp.componentWillReceiveProps) {
    comp.componentWillReceiveProps()
  }

  // 节点替换,在数据更新的时候
  if (comp.base && comp.base.parentNode) {
    comp.base.parentNode.replaceChild(base, comp.base)
  }

  comp.base = base
  return comp
}

export default renderComponent