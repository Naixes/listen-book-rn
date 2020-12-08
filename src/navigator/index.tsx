import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import Home from '@/pages/Home'
import Detail from '@/pages/Detail'
import { Platform, StyleSheet } from 'react-native'

// 不能使用interface，缺少索引签名
type RootStackParamList = {
    Home: undefined;
    Detail: undefined;
}

// 定义props类型
export type RootStackProps = StackNavigationProp<RootStackParamList>

// Record是一个很好用的工具类型。他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
// 堆栈式导航器
let Stack = createStackNavigator<RootStackParamList>()
// {
//     Navigator,
//     Screen
// }

class Navigator extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    // 标题模式
                    // float(ios默认，共用一个标题栏)/screen(android默认)
                    headerMode="screen"
                    screenOptions={{
                        headerTitleAlign: "center",
                        // 标题动画
                        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
                        // 内容动画
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                        // 打开手势系统，安卓默认关闭
                        gestureEnabled: true,
                        // 设置手势方向
                        gestureDirection: "horizontal",
                        // 统一标题样式
                        headerStyle: {
                            ...Platform.select({
                                android: {
                                    elevation: 0,
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                },
                                ios: {}
                            })
                        }
                    }}
                >
                    {/* options和screenOptions内容一样，options优先级更高 */}
                    <Stack.Screen options={{headerTitle: "首页"}} name="Home" component={Home} />
                    <Stack.Screen options={{headerTitle: "详情"}} name="Detail" component={Detail} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default Navigator