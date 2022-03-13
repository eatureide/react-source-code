import { setAttribute, setComponentProps, createComponent } from "./index"

export function diff(dom, vnode, container) {

    const ret = diffNode(dom, vnode)
    if (container) {
        container.appendChild(ret)
    }
    return ret
}

export function diffNode(dom, vnode) {
    let out = dom
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
        vnode = ''
    }

    if (typeof vnode === 'number') {
        vnode = String(vnode)
    }

    // 如果只是字符串或者数字
    if (typeof vnode === 'string') {
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                dom.textContent = vnode
            }
        } else {
            // 创建文本节点
            out = document.createTextNode(vnode)
            if (dom && dom.parentNode) {
                dom.parentNode.replaceNode(out, dom)
            }
        }
        return out
    }

    if (typeof vnode.tag === 'function') {

        return diffComponent(out, vnode)
    }

    // 非文本dom节点
    if (!dom) {
        out = document.createElement(vnode.tag)
    }

    if (vnode.childrens && vnode.childrens.length > 0 || out.childNodes && out.childNodes.length > 0) {
        diffChildren(out, vnode.childrens)

    }

    diffAttriBute(out, vnode)
    return out
}

function diffComponent(dom, vnode) {
    // 如果组件没有变化，重新设置props
    let comp = dom
    if (comp && comp.constructor === vnode.tag) {
        // 重新设置props
        setComponentProps(comp, vnode.attrs)
        // 赋值
        dom = comp.base
    } else {
        // 组件发生变化
        if (comp) {
            unmountComponent(comp)
            comp = null
        }

        // 创建新组件
        // 设置组件属性
        // 挂载base
        comp = createComponent(vnode.tag, vnode.attrs)
        setComponentProps(comp, vnode.attrs)
        dom = comp.base
    }

    return dom
}

function unmountComponent(comp) {
    removeNode(comp)
}

function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeNode(dom)
    }
}

function diffChildren(dom, vChildren) {

    const domChildren = dom.childNodes
    const children = []
    const keyed = {}

    if (domChildren.length > 0) {
        Array.from(domChildren).forEach(item => {
            // 获取key
            const key = item.key;
            if (key) {
                // 如果key存在,保存到对象中
                keyed[key] = item;
            } else {
                // 如果key不存在,保存到数组中
                children.push(item)
            }

        })
    }
    if (vChildren && vChildren.length > 0) {
        let min = 0
        let childrenLen = children.length
        Array.from(vChildren).forEach((vchild, i) => {

            const key = vChildren.key
            let child
            if (key) {
                if (keyed[key]) {
                    child = keyed[key]
                    keyed[key] = undefined
                }
            } else if (childrenLen > min) {
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }

            child = diffNode(child, vchild)

            const f = domChildren[i];
            if (child && child !== dom && child !== f) {

                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child);
                    // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
                } else if (child === f.nextSibling) {
                    removeNode(f);
                    // 将更新后的节点移动到正确的位置
                } else {
                    // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    dom.insertBefore(child, f);
                }
            }
        })
    }
}

function diffAttriBute(dom, vnode) {
    // dom是原有的节点，vnode是虚拟dom
    const oldAttrs = {}
    const newAttrs = vnode.attrs
    const domAttrs = dom.attributes
    Array.from(domAttrs).forEach((item) => {
        oldAttrs[item.name] = item.value
    })

    // 如果原来的属性跟新的属性对比，不在新的属性中，则将其移除(设为undefined)
    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined)
        }
    }

    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key])
        }
    }
}