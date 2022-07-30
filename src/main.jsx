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

let nextUnitOfWork = null
function workLoop(deadline) {
    let shouldYiled = true
    while (nextUnitOfWork && shouldYiled) {
        shouldYiled = deadline.timeRemaining() >= 1
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    
    /**
     * （注释执行逻辑例子来自于全局变量vdom）
     * 留意第一次的执行，nextUnitOfWork的初始值是render传入的，它是有dom的，所以这次if会略过
     * 当第二次执行，也就是开始遍历vdom的根元素，id为jojo的div，此时这个dom还没有生成，所以这一次的if会命中，走renderDOM去生成dom
     */
    if (!fiber.dom) {
        fiber.dom = renderDOM(fiber)
    }

    /**
     * 下面while那部分的代码会生成parent，第二次执行时fiber的parent是root，并且id为jojo的div已经生成好了，把这个div放入到root内，
     * 之后的子元素也是以此规律生成插入，建议反复思考上面对于performUnitOfWork遍历逻辑的描述
     */
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    let index = 0
    let prevSibling = null
    let elements = fiber.props.children

    /**
     * 遍历fiber的children元素，请着重注意prevSibling这个变量
     * 跳过id为jojo的逻辑，接下来应该遍历id为jojo的子元素了
     */
    while (index < elements.length) {
        let element = elements[index]
        let newFiber = {
            child: null,
            type: element.type,
            props: element.props,
            parent: fiber
        }

        // 遍历第一个子元素时，把这个子元素挂载到fiber的child内
        if (index === 0) {
            fiber.child = newFiber
        } 
        // 遍历第一个子元素时，会忽略prevSibling，这个else不会执行
        else {
            prevSibling.sibling = newFiber
        }
        /**
         * fiber.child引用了newFiber，
         * prevSibling也引用了newFiber，此时newFiber是包含了fiber.child引用的
         * 这部分描述比较复杂难懂，可以看下最底部的代码帮助你理解
         */

        prevSibling = newFiber
        index++
    }

    // 此时得到fiber.child，在id为jojo的子元素遍历中，得到了元素P，并返回
    if (fiber.child) {
        return fiber.child
    }

    // 检查元素P的兄弟元素，在这里，它为span元素
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        // 遍历完后往上找，找它是否还有其他兄弟元素
        nextFiber = nextFiber.parent
    }
}

function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

function renderDOM(fiber) {

    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    const isProperty = (key) => key !== 'children'

    Reflect.ownKeys(fiber.props).filter(isProperty).forEach((key) => {
        const value = fiber.props[key]
        dom[key] = value
    })

    return dom
}

const vdom = (
    <div id="jojo" title="jojo">
        <p title="made in heaven">jo1</p>
        <span>jo2</span>
    </div>
)

const root = document.getElementById('root')
render(vdom, root)



