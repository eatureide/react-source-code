/** @jsxRuntime classic */
/** @jsx createElement */
let nextUnitOfWork = null
let wipRoot = null

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => (
                typeof child === 'object'
                    ? child
                    : createTextElement(child)
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

function createDOM(fiber) {
    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    const isProperty = (key) => key !== 'children'
    Reflect.ownKeys(fiber.props)
        .filter(isProperty)
        .forEach((key) => {
            dom[key] = fiber.props[key]
        })

    return dom
}
function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        }
    }

    nextUnitOfWork = wipRoot
}


function commitRoot() {
    commitWork(wipRoot.child)
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) return
    const domParent = fiber.parent.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function wrokLoop(deadLine) {
    let isYiled = true
    if (isYiled && nextUnitOfWork) {
        nextUnitOfWork = performnNextUnitOfWork(nextUnitOfWork)
        isYiled = deadLine.timeRemaining() >= 1
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    requestIdleCallback(wrokLoop)
}
requestIdleCallback(wrokLoop)

function performnNextUnitOfWork(fiber) {

    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    // if (fiber.parent) {
    //     fiber.parent.dom.appendChild(fiber.dom)
    // }

    let prevSibling = null

    fiber.props.children.forEach((element, index) => {
        const newFiber = {
            type: element.type,
            parent: fiber,
            dom: null,
            props: element.props,
            children: element.props.children,
            child: null
        }
        if (index === 0) {
            fiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
    })

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



const element = (
    <div id="element">
        <p>element</p>
        <span>span</span>
    </div>
)
const node = document.getElementById('root')
render(element, node)
