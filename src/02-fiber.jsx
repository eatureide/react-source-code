/** @jsxRuntime classic */
/** @jsx createElement */

let nextUnitOfWork = null

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => (
                typeof child === 'object'
                    ? child :
                    createTextElement(child)
            ))
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

function workLoop(deadline) {
    let shouldYield = true
    while (nextUnitOfWork && shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function performUnitOfWork(fiber) {
    if (!fiber.dom) {
        fiber.dom = renderDom(fiber)
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    let index = 0
    let prevSibling = null
    let elements = fiber.props.children

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
        } else {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++

    }

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

function renderDom(fiber) {
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

function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}

const root = document.getElementById('root')
const node = (
    <div title="jojo">
        <p>made in heaven</p>
        <p>gold wind</p>
    </div>
)

render(node, root)