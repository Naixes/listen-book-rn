import { NavigationState } from '@react-navigation/native'
import {Dimensions} from 'react-native'

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window')

// 根据百分比和屏幕尺寸获取宽度
function widFromPer(percentage: number) {
    const value = viewportWidth * percentage / 100
    return Math.round(value)
}

// 根据百分比和屏幕尺寸获取高度
function heiFromPer(percentage: number) {
    const value = viewportHeight * percentage / 100
    return Math.round(value)
}

// 需要获取现在处于焦点的 tab 的名字
function getActiveTabName(state: NavigationState) {
    let route
    route = state.routes[state.index]
    while(route.state && route.state.index) {
        route = state.routes[state.index]
    }
    return route.name
}

export {
    viewportWidth,
    viewportHeight,
    widFromPer,
    heiFromPer,
    getActiveTabName
}