let nextUnitOfWork = null

function perforUnitOfWork(fiber) {
    // reactElement转换成一个真实DOM

    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    // 为当前的fiber创建它子节点的fiber fiber.children? === new
    const elements = fiber?.props?.children
    let prevSibling = null

    elements?.forEach((childrenElement, index) => {
        const newFiber = {
            parent: fiber,
            props: childrenElement.props,
            type: childrenElement.type,
            dom: null
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
    })


    // return出下一个任务单元 
    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.parent
    }
}

function workLoop(deadLine) {
    
    let shouldYiled = true
    while (nextUnitOfWork && shouldYiled) {
        nextUnitOfWork = perforUnitOfWork(nextUnitOfWork)
        shouldYiled = deadLine.timeRemaining() > 1// 得到浏览器当前帧剩余时间
    }
    // deadLine.timeRemaining() // 得到当前帧剩余的时间
    // requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function createDOM(element) {

    const dom = element.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(element.type)

    const isProperty = (key) => key !== 'children'

    Object.keys(element?.props).filter(isProperty).forEach((name) => {
        dom[name] = element?.props[name]
    })

    element?.props?.children.forEach((child) => render(child, dom))

    return dom
}

function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

export default render

