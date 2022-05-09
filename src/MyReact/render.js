let nextUnitOfWork = null
let wipRoot = null
let currentRoot = null
let deletions = []
let wipFiber = []
let hookIndex = 0

function reconcileChildren(wipFiber, elements) {
    let index = 0
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null

    while (
        index < elements.length || (oldFiber !== null && oldFiber !== undefined)
    ) {
        const childrenElement = elements[index]
        let newFiber = null
        const sameType =
            oldFiber &&
            childrenElement &&
            childrenElement.type === oldFiber.type

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: childrenElement.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        }

        if (!sameType && childrenElement) {
            newFiber = {
                type: childrenElement.type,
                props: childrenElement.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT'
            }
        }

        if (!sameType && oldFiber) {
            oldFiber.effectTag = 'DELETION'
            deletions.push(oldFiber)
        }

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

export function useState(initial) {
    const oldHook =
        wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex]
    const hook = {
        state: oldHook ? oldHook.state : initial,
        queue: [],
    }
    const setState = action => {
        hook.queue.push(action)
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        }
        nextUnitOfWork = wipRoot
        deletions = []
    }

    const actions = oldHook ? oldHook.queue : []

    actions.forEach((action) => {
        hook.state = action
    })

    wipFiber.hooks.push(hook)
    hookIndex++

    return [hook.state, setState]
}

function updateFunctionComponent(fiber) {
    wipFiber = fiber
    hookIndex = 0
    wipFiber.hooks = []
    const children = [fiber.type(fiber.props)]
    reconcileChildren(fiber, children)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    reconcileChildren(fiber, fiber.props.children)

}

function performUnitOfWork(fiber) {

    const isFunctionComponent = fiber.type instanceof Function
    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    // return next unit of work
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

const isEvent = (key) => key.startsWith('on')
const isProperty = (key) => key !== 'children' && !isEvent(key)
const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => (key) => !(key in next)

function updateDom(dom, prevProps, nextProps) {

    // 移除旧的监听事件
    Object.keys(prevProps)
        .filter(isEvent)
        .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2)
            dom.removeEventListener(eventType, prevProps[name])
        })


    // 移除掉不存在props里的属性
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = ''
        })

    // 新增
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(name => dom[name] = nextProps[name])

    // 新增事件
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2)
            dom.addEventListener(eventType, nextProps[name])
        })

}

function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom)
    } else {
        commitDeletion(fiber.child, domParent)
    }
}

function commitWork(fiber) {
    if (!fiber) {
        return
    }

    let domParentFiber = fiber.parent
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent
    }
    const domParent = domParentFiber.dom

    if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
        domParent.appendChild(fiber.dom)
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props)
    } else if (fiber.effectTag === 'DELETION') {
        commitDeletion(fiber, domParent)
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitRoot() {
    // add nodes to dom

    commitWork(wipRoot.child)

    deletions.forEach(commitWork)

    currentRoot = wipRoot

    wipRoot = null

}

function workLoop(deadline) {

    let shouldYield = false
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        )
        // 剩余时间不多了就打断任务
        shouldYield = deadline.timeRemaining() < 1
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot()
    }

    requestIdleCallback(workLoop)

}

requestIdleCallback(workLoop)

function createDom(fiber) {

    const dom =
        fiber.type === 'TEXT_ELEMENT'
            ? document.createTextNode('')
            : document.createElement(fiber.type)

    updateDom(dom, {}, fiber.props)

    return dom
}

export function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    }
    deletions = []
    nextUnitOfWork = wipRoot
}

export default render

