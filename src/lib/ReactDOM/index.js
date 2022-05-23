const createRoot = (container) => {
    const render = (reactElement, parentElement) => {
        const { tag, props } = reactElement

        // if (!reactElement) return

        if (typeof reactElement === 'string' || typeof reactElement === 'number') {
            let textNode = document.createTextNode(String(reactElement))
            parentElement.appendChild(textNode)
            return
        }

        let element = document.createElement(tag)

        if (props) {
            const isProperty = (key) => key !== 'children' && !key.includes('__')
            Object.keys(props).filter(isProperty).forEach((key) => {
                element[key] = props[key]
            })
        }

        if (props.children) {
            props.children.forEach((child) => {
                render(child, element)
            })
        }

        if (parentElement) {
            parentElement.appendChild(element)
        } else {
            container.appendChild(element)
        }
    }
    return {
        render
    }
}


export default {
    createRoot
}