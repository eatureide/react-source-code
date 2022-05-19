let nextUnitOfWork = null

function workLoop(deadLine) {
    let shoudYiled = true
    while (nextUnitOfWork && shoudYiled) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shoudYiled = deadLine.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }
    let index = 0
    let prevSibling = {}
    const elements = fiber.props.children

    while (index < elements.length) {
        const element = elements[index]
        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }
        if (index === 0) {
            fiber.child = newFiber
        }
        // else {
        //     prevSibling.sibling = newFiber
        // }
        prevSibling = newFiber
        index++
    }
    console.log(fiber)
    if (fiber.child) {
        return fiber.child
    }

    // let nextFiber = fiber
    // while (nextFiber) {
    //     if (nextFiber.sibling) {
    //         return nextFiber.sibling
    //     }
    //     nextFiber = nextFiber.parent
    // }

}



function createDom(fiber) {

    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    const isProperty = (key) => key !== 'children'
    Reflect.ownKeys(fiber.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = fiber.props[name]
        })

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