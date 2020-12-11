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

export {
    viewportWidth,
    viewportHeight,
    widFromPer,
    heiFromPer
}