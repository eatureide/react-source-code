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
    const domParent = fiber.return.dom
    domParent.appendChild(fiber.dom)
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitRoot() {
    commitWork(wipRoot.child)
    wipRoot = null
}

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

// 运行任务的桉树，参数是当前的fiber任务
function performUnitOfWork(fiber) {

    // 根节点是container，是有dom属性的，如果当前fiber没有这个属性，说明当前fiber不是根节点
    if (!fiber.dom) {
        fiber.dom = creatDom(fiber) // 创建dom挂载上去
    }

    // 将vdom转为fiber结构
    const elements = fiber.props.children
    let prevSibling = null

    if (elements && elements.length) {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            const newFiber = {
                type: element.type,
                props: element.props,
                return: fiber,
                dom: null
            }

            if (i === 0) {
                fiber.child = newFiber
            }
            else {
                prevSibling.sibling = newFiber
            }
            // 第一回合循环，fiber.child指的是第一个元素
            // prevSibling的指针与fiber.child一致
            // 第二回合循环,因为prevSibling就是fiber.child的关系，
            // 所以else这句话的意思是，fiber.child.sibling 等于第二个child
            prevSibling = newFiber
        }

    }

    // 这个函数的返回值是下一个任务，这是一个深度优先遍历
    // 先找子元素，没有子元素就找兄弟元素
    // 如果兄弟元素也没有了就返回父元素
    // 然后再找这个父元素的兄弟元素
    // 最后会回到根节点结束
    // 这个遍历书顺序其实是从上到下，从左往右

    if (fiber.child) {
        return fiber.child
    }

    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        nextFiber = nextFiber.return
    }

}

function creatDom(vDOM) {
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
    return dom
}

function render(vDOM, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [vDOM]
        }
    }
    nextUnifOfWork = wipRoot
}

export default { createElement, render }