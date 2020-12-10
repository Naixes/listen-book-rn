import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

// Home为标签选择器
import Home from '@/navigator/BottomTabs'
import Detail from '@/pages/Detail'
import { Platform, StatusBar, StyleSheet } from 'react-native'

// 不能使用interface，缺少索引签名
export type RootStackParamList = {
    BottomTab: {
        // 跳转时指定某一tab
        screen?: string;
    };
    Home: undefined;
    Detail: {
        id: number
    };
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
                        // 设置状态栏高度，防止渲染时有抖动
                        // headerStatusBarHeight: StatusBar.currentHeight,
                        // 统一标题样式
                        headerStyle: {
                            ...Platform.select({
                                android: {
                                    // 阴影
                                    elevation: 0,
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                },
                                ios: {}
                            })
                        }
                    }}
                >
                    {/* options和screenOptions内容一样，options优先级更高 */}
                    {/* 嵌套标签选择器，标题动态显示 */}
                    <Stack.Screen options={{headerTitle: "首页"}} name="Home" component={Home} />
                    <Stack.Screen options={{headerTitle: "详情"}} name="Detail" component={Detail} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default Navigator