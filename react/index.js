import Component from './component'

/**
 * tag，标签名称
 * attrs，该标签的属性
 * childrens，该标签的子元素
 */

function createElement(tag, attrs, ...childrens) {
  /**
   * babel会解析你传入的jsx，比如你传入 <div title="react">hi</div>，则会转换为["div",{"title":"react"},"hi"]
   * 根据arguments，转换为react生成dom的对象描述
   */
  return {
    tag,
    attrs,
    childrens
  }
}

export default {
  createElement,
  Component
}