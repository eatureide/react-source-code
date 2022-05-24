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

function render(vDOM, container) {

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

    if (vDOM.props && vDOM.props.children && vDOM.props.children.length) {
        vDOM.props.children.forEach((child) => {
            render(child, dom)
        })
    }
    container.appendChild(dom)
}

export default { createElement, render }