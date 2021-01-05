import React from 'react'
import { Provider } from 'react-redux'
import {RootSiblingParent} from 'react-native-root-siblings'
// 通过原生组件对应用性能和内存占用进行优化
import {enableScreens} from 'react-native-screens'

import Navigator from '@/navigator/index'
import store from '@/config/dva'
import { StatusBar } from 'react-native'
import '@/config/http'

enableScreens()

export default class extends React.Component {
    render() {
        return (
            <Provider store={store}>
                {/* RootSiblingParent：解决toast在安卓端不显示 */}
                <RootSiblingParent>
                    <Navigator></Navigator>
                </RootSiblingParent>
                {/* 修改顶部状态栏样式 */}
                <StatusBar
                    backgroundColor="transparent"
                    barStyle="dark-content"
                    // 半透明属性
                    translucent
                ></StatusBar>
            </Provider>
        )
    }
}