import Component from "./component"

function createElement(tag, attrs, ...childrens) {
  return {
    tag, // 外层标签
    attrs, // attrs 属性 对象
    childrens, // 一个数组
  }
}

export default {
  createElement,
  Component
}