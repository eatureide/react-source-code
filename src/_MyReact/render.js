
let nextUnitOfWork = null

function perforUnitOfWork(fiber) {

    /**
     * 此时的com就是被加入的container，那么一开始的dom应该是root
     */

    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    const elements = fiber?.props?.children
    let prevSibling = null

    elements.forEach((childrenElement, index) => {

        const newFiber = {
            parent: fiber,
            props: childrenElement.props,
            type: childrenElement.type,
            dom: null
        }

        if (index === 0) {
            fiber.child = newFiber
        } else {
            // prevSibling.sibling = newFiber
        }

        // prevSibling = newFiber
    })

    if (fiber.child) {
        return fiber.child
    }
}

function workLoop(deadLine) {
    let shouldYiled = true

    // 判断浏览器是否有剩余时间，并且存在下一个任务单元
    while (shouldYiled && nextUnitOfWork) {

        nextUnitOfWork = perforUnitOfWork(nextUnitOfWork)
        shouldYiled = deadLine.timeRemaining() > 1
    }
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

    // container.appendChild(dom)
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