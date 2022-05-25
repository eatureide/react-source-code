function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children?.map((child) => (
                typeof child === 'object' ? child : createTextVDom(child)
            ))
        }
    }
}

function createTextVDom(text) {
    return {
        type: 'TEXT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}




function commitWork(fiber) {
    if (!fiber) return
    const domParent = fiber.parent.dom

    if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
        domParent.appendChild(fiber.dom)
    } else if (fiber.effectTag === 'DELETETION') {
        // domParent.removeChild(fiber.dom)
    } else if (fiber.effectTag === 'UPDATE') {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props)
    }


    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitRoot() {
    commitWork(wipRoot.child)
    currentRoot = wipRoot
    wipRoot = null
}

let currentRoot = null
let nextUnifOfWork = null
let wipRoot = null
function wrokLoop(deadline) {
    // 下一个任务是存在的，并且任务执行期限还没结束
    while (nextUnifOfWork && deadline.timeRemaining() > 1) {
        nextUnifOfWork = performUnitOfWork(nextUnifOfWork)
    }
    if (!nextUnifOfWork && wipRoot) {
        commitRoot()
    }
    // 任务还没有完成，但是时间到了，我们就需要注册，下一个空闲时间运行任务
    requestIdleCallback(wrokLoop)
}
requestIdleCallback(wrokLoop)


// 新老节点类型一样，复用老节点dom，更新props即可
// 如果类型不一样，而且新老节点存在，创建新的节点替换老节点
// 如果类型不一样，没有新节点，只有老节点，那么删除节点
const isEvent = (key) => key.startsWith("on")
const isProperty = (key) => key !== "children" && !isEvent(key)
const isNew = (prev, next) => (key) => prev[key] !== next[key]
const isGone = (prev, next) => (key) => !(key in next)

function updateDom(dom, prevProps, nextProps) {
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = nextProps[name];
        });
    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

function reconcileChildren(wipFiber, elements) {
    let index = 0
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child
    let prevSibling = null

    while (
        index < elements.length
        || oldFiber != null
    ) {
        const element = elements[index]
        let newFiber = null

        const sameType = oldFiber && element && element.type == oldFiber.type

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE'
            }
        }

        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT'
            }
        }

        if (oldFiber && !sameType) {

        }

        if(oldFiber){
            oldFiber = oldFiber.sibling
        }

        if (index === 0) {
            wipFiber.child = newFiber
        } else if (element) {
            prevSibling.sibling = newFiber
        }

        prevSibling = newFiber
        index++
    }
}

// 运行任务的桉树，参数是当前的fiber任务
function performUnitOfWork(fiber) {

    // 根节点是container，是有dom属性的，如果当前fiber没有这个属性，说明当前fiber不是根节点
    if (!fiber.dom) {
        fiber.dom = createDom(fiber) // 创建dom挂载上去
    }

    // 将vdom转为fiber结构
    let elements = fiber.props.children
    reconcileChildren(fiber, elements)

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

function createDom(vDOM) {
    let dom = undefined
    if (vDOM.type === 'TEXT') {
        dom = document.createTextNode(vDOM.props.nodeValue)
    } else {
        dom = document.createElement(vDOM.type)
    }
    if (vDOM?.props) {
        Object.keys(vDOM.props)
            .filter((key) => key !== 'children' && !key.includes('__'))
            .forEach((item) => {
                dom[item] = vDOM.props[item]
            })
    }
    // if (vDOM.props && vDOM.props.children && vDOM.props.children.length) {
    //     vDOM.props.children.forEach((child) => {
    //         render(child, dom)
    //     })
    // }
    // container.appendChild(dom)
    updateDom(dom, {}, vDOM.props)
    return dom
}

function render(vDOM, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [vDOM]
        },
        alternate: currentRoot
    }
    nextUnifOfWork = wipRoot
}

export default { createElement, render }