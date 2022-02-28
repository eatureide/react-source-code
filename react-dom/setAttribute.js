
function setAttribute(dom, key, value = '') {

  // 如果key是className
  const isClassName = key === 'className'
  // 如果key是事件并且是函数
  const isEvent = /on\w+/.test(key) && typeof value === 'function'
  // 如果key是样式style对象
  const isStyleObject = key === 'style' && typeof value === 'object'
  // 如果key是样式style字符串
  const isStyleString = key === 'style' && typeof value === 'string'

  // 转换为class
  if (isClassName) {
    key = 'class'
  }

  // 设置事件
  if (isEvent) {
    key = key.toLowerCase()
    dom[key] = value
  }

  // 如果是样式字符串，则直接设置字符串样式
  if (isStyleString) {
    dom.style.cssText = value
  }

  // 如果是style对象，则遍历并设置样式
  if (isStyleObject) {
    Object.keys(value).forEach((key) => {
      let val = value[key]
      if (typeof val === 'number') val = val + 'px'
      dom.style[key] = val
    })
  }

  // 如果都不是，则直接设置属性
  if (!isClassName && !isEvent && !isStyleObject && !isStyleString) {

    if (value) {
      dom.setAttribute(key, value)
      return
    }

    dom.setAttribute(key)
  }

}

export default setAttribute