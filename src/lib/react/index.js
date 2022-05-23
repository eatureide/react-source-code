import { render } from '../../main'

export const createElement = (tag, props, ...children) => {
    if (typeof tag === 'function') {
        return tag(props)
    }

    const element = {
        tag,
        props: {
            ...props,
            children
        }
    }

    return element
}

let states = []
let CURSOR = 0

export const useState = (initialState) => {
    // console.log(states)
    const CURR_CURSOR = CURSOR
    states[CURR_CURSOR] = states[CURR_CURSOR] ?? initialState

    const setState = (newState) => {
        states[CURR_CURSOR] = newState
        CURSOR = 0
        render()
    }
    
    CURSOR++
    return [states[CURR_CURSOR], setState]
}

export default {
    createElement,
    useState
}