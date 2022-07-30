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

    if (!fiber.dom) {
        fiber.dom = renderDOM(fiber)
    }

    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    let index = 0
    let prevSibling = null
    let elements = fiber.props.children

    while (index < elements.length) {
        let element = elements[index]
        let newFiber = {
            child: null,
            type: element.type,
            props: element.props,
            parent: fiber
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

const dom = (
    <div title="jojo">
        <p title="made in heaven">jo1</p>
        <span>jo2</span>
    </div>
)

const root = document.getElementById('root')
render(dom, root)
