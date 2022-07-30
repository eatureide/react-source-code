```javascript

function renderDOM(element, parent) {
    ...

    element.props.children.forEach((child) => {
        renderDOM(child, dom)
    })

    parent.appendChild(dom)

    return dom
}
```

我们思考一下renderDOM函数，会发现它是通过循环不断递归dom的生成的，并且整个过程不可中断，当用户在复杂的UI下频繁更新界面时，整个DOM需要不断进行更新，这将非常耗时  

<img src="https://raw.githubusercontent.com/eatureide/WebNote/master/image/React/22553049-d54fca7b2e0be144.webp"/>  

为了解决这个问题，React引入了Fiber的概念，简单来说就是一个原本复杂的同步任务，通过时间切片切割成一个个简单的异步任务，同步变成了异步，自然就不会对浏览器造成阻塞了

<img src="https://raw.githubusercontent.com/eatureide/WebNote/master/image/React/22553049-5380faa65e72a5a6.webp"/>

为了实现这个切片，浏览器提供了名为requestIdelCallback的函数，这个函数能告诉我们当前浏览器绘画这个“帧”的剩余时间，譬如说浏览器分配了这个当前“帧”的所需时间是16ms，这个帧只用了15ms就完成了绘画，剩下的1ms的空隙时间就能提供给我们做任务单元的执行，当了解了这个概念后，我们来逐步改造我们的React  

先从renderDOM开始，我们改成这样：
```javascript

function renderDOM(fiber) { // element改名为fiber，去除parent参数，插入逻辑交由后面的performUnitOfWork函数完成

    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextNode('')
        : document.createElement(fiber.type)

    const isProperty = (key) => key !== 'children'

    Reflect.ownKeys(fiber.props).filter(isProperty).forEach((key) => {
        const value = fiber.props[key]
        dom[key] = value
    })

    // 删除以下这部分，renderDOM无需理会children，只管返回这一次的dom就好了
    // element.props.children.forEach((child) => {
    //     renderDOM(child, dom)
    // })

    // parent.appendChild(dom)

    return dom
}
```

创建一个全局变量，名为nextUnitOfWork，用它接收抛出的任务单元
创建函数render，用于初始化nextUnitOfWork，要注意，nextUnitOfWork分为两种，一种是根元素的任务单元，一种是子元素的任务单元，根元素的任务单元成员只有两个元素dom和props，子元素的任务单元会在performUnitOfWork函数中再提到
```javascript
let nextUnitOfWork = null
function render(element, container) {
    nextUnitOfWork = {
        dom: container,
        props: {
            children: [element]
        }
    }
}
```

创建函数workLoop，这个函数是用来监听任务单元和当前帧所剩时间的
```javascript
function workLoop(deadline) {
    let shouldYiled = true
    // 还有未完成的任务单元并且还有剩余时间的话则走下面的逻辑
    while (nextUnitOfWork && shouldYiled) {
        // 这里便体现了上文所述的，使用剩余时间执行一个个任务单元
        shouldYiled = deadline.timeRemaining() >= 1
        // performUnitOfWork，用于具体的任务单元执行
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
    // 再次执行，监听剩余时间
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
```



创建函数performUnitOfWork，这个函数会遵循以下的规则对任务单元的dom进行遍历，假设现在的dom结构是这样的：

```javascript
<div>
    <h1>
        <p></p>
    </h1>
    <h2>
        <a></a>
    </h2>
</div>
```
它的遍历逻辑如下：  
首先div从下开寻找，找到元素h1，完成h1的渲染后会再寻找h1是否还有子元素，这时候找到子元素p，完成元素p的渲染后，返回到h1节点，寻找h1是否有兄弟元素，这时候找到h2，寻找是否有子元素，这时候找到子元素a，完成元素a的渲染后返回到h2节点，寻找h2是否有下一个兄弟元素，这时候已经没有下一个兄弟元素了，所以返回到div节点，完成这棵树的遍历
<img src="https://qcsite.gatsbyjs.io/static/a88a3ec01855349c14302f6da28e2b0c/ac667/fiber1.png" />  

接下来实现performUnitOfWork  
```javascript
function performUnitOfWork(fiber) {
    
    /**
     * （注释执行逻辑例子来自于全局变量vdom）
     * 留意第一次的执行，nextUnitOfWork的初始值是render传入的，它是有dom的，所以这次if会略过
     * 当第二次执行，也就是开始遍历vdom的根元素，id为jojo的div，此时这个dom还没有生成，所以这一次的if会命中，走renderDOM去生成dom
     */
    if (!fiber.dom) {
        fiber.dom = renderDOM(fiber)
    }

    /**
     * 下面while那部分的代码会生成parent，第二次执行时fiber的parent是root，并且id为jojo的div已经生成好了，把这个div放入到root内，
     * 之后的子元素也是以此规律生成插入，建议反复思考上面对于performUnitOfWork遍历逻辑的描述
     */
    if (fiber.parent) {
        fiber.parent.dom.appendChild(fiber.dom)
    }

    let index = 0
    let prevSibling = null
    let elements = fiber.props.children

    /**
     * 遍历fiber的children元素，请着重注意prevSibling这个变量
     * 跳过id为jojo的逻辑，接下来应该遍历id为jojo的子元素了
     */
    while (index < elements.length) {
        let element = elements[index]
        let newFiber = {
            child: null,
            type: element.type,
            props: element.props,
            parent: fiber
        }

        // 遍历第一个子元素时，把这个子元素挂载到fiber的child内
        if (index === 0) {
            fiber.child = newFiber
        } 
        // 遍历第一个子元素时，会忽略prevSibling，这个else不会执行
        else {
            prevSibling.sibling = newFiber
        }
        /**
         * fiber.child引用了newFiber，
         * prevSibling也引用了newFiber，此时newFiber是包含了fiber.child引用的
         * 这部分描述比较复杂难懂，可以看下最底部的demo帮助你理解
         */
        prevSibling = newFiber
        index++
    }

    // 此时得到fiber.child，在id为jojo的子元素遍历中，得到了元素P，并返回
    if (fiber.child) {
        return fiber.child
    }

    // 检查元素P的兄弟元素，在这里，它为span元素
    let nextFiber = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        // 遍历完后往上找，找它是否还有其他兄弟元素
        nextFiber = nextFiber.parent
    }
}
```

demo如下，其实就是互相引用哈
```javascript
let prevSibling = null
let fiber = {}
let newFiber = { val: 'newFiber' }
fiber.child = newFiber
setTimeout(() => {
    prevSibling.prevSibling = newFiber
})
prevSibling = newFiber
setTimeout(() => {
    console.log(prevSibling)
})
```

ok，简单的fiber已经完成了，完整代码如下
https://codesandbox.io/s/optimistic-bird-k565vj?file=/src/index.js