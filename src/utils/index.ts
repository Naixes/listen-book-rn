import { NavigationState, NavigationContainerRef } from '@react-navigation/native'
import {Dimensions} from 'react-native'
import React from 'react';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window')

// 格式化时间
function formatTime(seconds: number) {
    const m = parseInt((seconds % (60 * 60)) / 60 + '', 10);
    const s = parseInt((seconds % 60) + '', 10);
  
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

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
        route = route.state.routes[route.state.index]
    }
    return route.name
}

const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string, params?: any) {
    if(navigationRef.current) {
        navigationRef.current.navigate(name, params)
    }
}

export {
    formatTime,
    viewportWidth,
    viewportHeight,
    widFromPer,
    heiFromPer,
    getActiveTabName,
    navigationRef,
    navigate,
}