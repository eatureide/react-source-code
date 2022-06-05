/** @jsxRuntime classic */
/** @jsx createElement */

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

let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null

function createDOM(fiber) {
    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    updateDOM(dom, {}, fiber.props)

    return dom
}

function render(element, container) {
    wipRoot = {
        props: {
            children: [element]
        },
        alternate: currentRoot,
        dom: container
    }

    nextUnitOfWork = wipRoot
}

function reconcilChildren(wipFiber, elements) {

    let index = 0
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null

    while (index < elements.length) {
        const element = elements[index]

        let newFiber = null
        const samType =
            oldFiber && element &&
            element.type == oldFiber.type


        if (samType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        }
        else {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT',
            }
        }
        console.log(newFiber)

        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }
   

        if (index === 0) {
            wipFiber.child = newFiber
        } else {
            prevSibling.sibling = newFiber
        }
        prevSibling = newFiber
        index++
    }


}

function performUnitOfWork(fiber) {

    if (!fiber.dom) {
        fiber.dom = createDOM(fiber)
    }

    const elements = fiber.props.children
    reconcilChildren(fiber, elements)

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

function commitRoot() {
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

function updateDOM(dom, prevProps, nextProps) {
    const isProperty = (key) => key !== 'children'
    const isEvent = key => key.startsWith('on')

    Object.keys(nextProps)
        .filter(isEvent)
        .forEach(name => {
            const eventType = name
                .toLowerCase()
                .substring(2)
            dom.addEventListener(
                eventType,
                nextProps[name]
            )
        })

    Object.keys(nextProps)
        .filter(isProperty)
        .forEach((key) => {
            dom[key] = nextProps[key]
        })
}

function commitWork(fiber) {
    if (!fiber) return
    const domParent = fiber.parent.dom
    if (
        fiber.effectTag === 'PLACEMENT' &&
        fiber.dom != null
    ) {
        domParent.appendChild(fiber.dom)
    }
    else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
        updateDOM(fiber.dom, fiber.alternate, fiber.props)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function workLoop(deadLine) {
    let isYield = true
    while (isYield && nextUnitOfWork) {
        isYield = deadLine.timeRemaining() >= 1
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }
    requestIdleCallback(workLoop)
}
requestIdleCallback(workLoop)


const container = document.getElementById('root')
// render(element, root)

const updateValue = e => {
    rerender(e.target.value)
}

const rerender = value => {

    const element = (
        <div>
            <input onInput={updateValue} value={value} />
            <h2>Hello {value}</h2>
        </div>
    )

    render(element, container)
}
rerender('world')
