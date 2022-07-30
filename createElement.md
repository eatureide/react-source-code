## 本文环境基于Vite的React模板

VirtualDOM是一个JS对象，在浏览器环境中，它描述了一个DOM该如何渲染在HTML上，譬如我现在想渲染一个P标签，它有一些基本信息，那么它应该是这样的：
```javascript
{
    "type": "p",
    "props": {
        "title": "jojo",
        "children": [
            {
                "type": "TEXT_ELEMENT",
                "props": {
                    "nodeValue": "made in heaven",
                    "children": []
                }
            }
        ]
    }
}
```
type表示这个标签的类型，React会根据这个类型创建对应的DOM，props则表示这个DOM的一些传参，比如自定义属性title，children则表示P标签下的一些子元素和子元素的props，
了解DOM创建的逻辑后，我们来尝试创建一个属于自己的React

在你的JS文件中首先加入以下代码：
```javascript
/** @jsxRuntime classic */
/** @jsx createElement */
```
这个意思是Babel会使用我们提供的JS函数来对JSX做VDOM的转换

```javascript
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) =>
                typeof child === 'object'
                    ? child
                    : createTextElement(child)
            )
        }
    }
}
```
我们提供一个函数createElement，它负责返回一个JS对象，其中返回的成员的逻辑与上面所述的一致，但要注意的是，当children中的某些成员类型不是object时，那么肯定就是一个没有标签的普通文本，所以我们需要将这个文本转化成JS对象方便后续处理  

如果你在意children为什么会使用reset处理后续的传参的话，是因为createElement传参的方式是这样的
```javascript
const child1 = React.createElement('p', { title: 'made in heaven' }, 'jo1')
const child2 = React.createElement('span', null, 'jo2')
// child1前面那部分负责描述最大父元素的信息，child1，child2表示这个父元素的子元素，它包含一个p标签，一个span标签
const node = React.createElement('div', { title: 'jojo' }, child1, child2)
```
相对应的JSX结构则是这样
```javascript
const node = (
    <div title="jojo">
        <p title="made in heaven">jo1</p>
        <span>jo2</span>
    </div>
)
```


createTextElement这里同样也是返回JS对象，因为文本不是标签，它没有子元素，所以我们用空数组表示children
```javascript
function createTextElement(child) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: child,
            children: []
        }
    }
}
```


JSX转换好后，接下来就是渲染了
```javascript
function renderDOM(element, container) {
    // 根据type类型判断应该生成什么dom元素，类型为TEXT_ELEMENT的话则使用createTextNode生成文本对象
    const dom = element.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(element.type)

    const isProperty = (key) => key !== 'children'

    // 我们遍历props时，需要过滤掉children（这里只负责自定义属性），把自定义属性添加到dom内
    Reflect.ownKeys(element.props).filter(isProperty).forEach((key) => {
        const value = element.props[key]
        dom[key] = value
    })
    
    // children额外处理，循环递归props的children，利用renderDOM自身的逻辑一口气把dom生成好
    element.props.children.forEach((child) => {
        renderDOM(child, dom)
    })

    // 把dom插入到指定的container
    container.appendChild(dom)

    return dom
}
```
一切顺利的话，你已经可以正常的渲染dom了，试试：
https://codesandbox.io/s/recursing-poitras-obw4xk?file=/src/index.js