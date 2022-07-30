/** @jsxRuntime classic */
/** @jsx createElement */

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

function createTextElement(child) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: child,
            children: []
        }
    }
}

function renderDOM(element, parent) {
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

    // 把dom插入到指定的parent
    parent.appendChild(dom)

    return dom
}

const dom = (
    <div title="jojo">
        <p title="made in heaven">jo1</p>
        <span>jo2</span>
    </div>
)

const root = document.getElementById('root')
renderDOM(dom, root)
