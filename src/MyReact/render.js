let nextUnitiOfWork = null

function perforUnitOfwork(fiber) {
    //  reactElement转换成真实DOM
    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }
    // 为当前的fiber创造它子节点的fiber
    // parent child sibling
    const elements = fiber?.props?.children
    let prevSibling = null
    console.log(fiber)
    elements?.forEach((childrenElement, index) => {
        const newFiber = {
            parent: fiber,
            props: childrenElement,
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

function workLoop(deadline) {
    let shouldYiled = true
    while (nextUnitiOfWork && shouldYiled) {
        nextUnitiOfWork = perforUnitOfwork(nextUnitiOfWork)
        shouldYiled = deadline.timeRemaining() > 1
    }
    deadline.timeRemaining()// 得到浏览器当前帧剩余时间
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function createDOM(element) {
    const dom =
        element.type === 'TEXT_ELEMENT'
            ? document.createTextNode('')
            : document.createElement(element.type)

    const isProperty = key => key !== 'children'
    Object.keys(element?.props)
        .filter(isProperty).forEach((name) => dom[name] = element.props[name])

    element?.props?.children?.forEach((child) => {
        render(child, dom)
    })

    return dom
}

function render(element, container) {
    nextUnitiOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

export default render