import React from 'react'
import { Provider } from 'react-redux'

import Navigator from '@/navigator/index'
import store from '@/config/dva'
import { StatusBar } from 'react-native'

export default class extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Navigator></Navigator>
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