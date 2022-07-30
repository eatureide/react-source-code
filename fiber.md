```javascript
function renderDOM(fiber) {
    ...
    
    Reflect.ownKeys(fiber.props).filter(isProperty).forEach((key) => {
        const value = fiber.props[key]
        dom[key] = value
    })

    return dom
}
```

我们思考一下renderDOM函数，会发现它是通过循环不断递归dom的生成的，并且整个过程不可中断，当用户在复杂的UI下频繁更新界面时，整个DOM需要不断进行更新，这将非常耗时  

<img src="https://raw.githubusercontent.com/eatureide/WebNote/master/image/React/22553049-d54fca7b2e0be144.webp"/>  

为了解决这个问题，React引入了Fiber的概念，简单来说就是可以将原本一个复杂并且不可中断的任务，通过时间切片分解成一个个小的任务单元并逐步完成它们的这么一个过程，换句话说，这些任务单元都是异步的，那么自然就不会对浏览器造成阻塞了  

<img src="https://raw.githubusercontent.com/eatureide/WebNote/master/image/React/22553049-5380faa65e72a5a6.webp"/>

```javascript
let nextUnitOfWork = null

function workLoop(deadLine) {
    let shouldYiled = true // 默认当作有空闲时间
    while (nextUnitOfWork && shouldYiled) {
        // timeRemaining返回的是毫秒，意思是下一帧更新所需时间，我们这里的规则是如果下一帧所需时间小于1ms，就执行下一个任务单元
        shouldYiled = deadLine.timeRemaining() < 1
        // 待会我们会实现performUnitOfWork，这个函数接收任务单元并执行
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
    // 内部需要再执行确认一次，不然的话只会执行一次performUnitOfWork
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
```

在全局创建一个变量，名为nextUnitOfWork，意思是下一个任务单元，通过requestIdleCallback来不断监听是否有下一个任务需要执行
