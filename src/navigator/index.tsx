import { NavigationContainer, RouteProp } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, StackNavigationProp, TransitionPresets } from '@react-navigation/stack'
import React from 'react'

// Home为标签选择器
import Home from '@/navigator/BottomTabs'
import { Platform, StatusBar, StyleSheet } from 'react-native'
import Category from '@/pages/Category'
import Album from '@/pages/Album'
import Animated from 'react-native-reanimated'
import Detail from '@/pages/Detail'
import Icon from '@/assets/iconfont/index'

// RootStackScreen

// 不能使用interface，缺少索引签名
export type RootStackParamList = {
    BottomTab: {
        // 跳转时指定某一tab
        screen?: string;
    };
    Category: undefined;
    Album: {
        item: {
            id: string;
            title: string;
            image: string;
        }
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

const getAlbumOptions = ({route}: {route: RouteProp<RootStackParamList, 'Album'>}) => {
    return {
        headerTitle: route.params.item.title,
        // 设置透明标题栏
        headerTransparent: true,
        headerTitleStyle: {
            opacity: 0
        },
        headerBackground: () => {
            return (
                <Animated.View style={styles.headerBackground}></Animated.View>
            )
        }
    }
}

const RootStackScreen = () => {
    return (
        <Stack.Navigator
            // 标题模式
            // float(ios默认，共用一个标题栏)/screen(android默认)
            headerMode="screen"
            screenOptions={{
                // 让ios返回样式与安卓统一
                headerBackTitleVisible: false,
                headerTintColor: '#333',

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
                // react-native0.6，1.5时StatusBar.currentHeight为undefined；0.62版本返回null，所以增加判断
                // ...Platform.select({
                //     android: {
                //         headerStatusBarHeight: StatusBar.currentHeight,
                //     }
                // }),
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
            <Stack.Screen
                options={{headerTitle: "首页"}}
                name="BottomTab"
                component={Home} 
            />
            <Stack.Screen
                options={{headerTitle: "分类"}}
                name="Category"
                component={Category} 
            />
            <Stack.Screen
                // 动态传递 options
                options={getAlbumOptions}
                name="Album"
                component={Album} 
            />
        </Stack.Navigator>
    )
}

// ModelStackScreen

export type ModelStackParamList = {
    Root: undefined;
    Detail: {
        id: string;
    };
}

export type ModelStackProps = StackNavigationProp<ModelStackParamList>

const ModelStack = createStackNavigator<ModelStackParamList>()

const ModelStackScreen = () => {
    return (
        // 设置全屏模式
        <ModelStack.Navigator
            mode='modal'
            headerMode='screen'
            screenOptions={{
                headerTitleAlign: 'center',
                // 开启手势
                gestureEnabled: true,
                // 动画效果
                ...TransitionPresets.SlideFromRightIOS,
                // 隐藏 ios 返回标题
                headerBackTitleVisible: false,
            }}
        >
            <ModelStack.Screen
                name='Root'
                component={RootStackScreen}
                options={{
                    // 隐藏标题栏
                    headerShown: false
                }}
            ></ModelStack.Screen>
            <ModelStack.Screen
                name='Detail'
                component={Detail}
                options={{
                    headerTintColor: '#fff',
                    headerTransparent: true,
                    headerTitle: '',
                    cardStyle: {backgroundColor: '#807c66'},
                    headerBackImage: ({tintColor}) => (
                        <Icon
                            name="icon-down"
                            size={25}
                            color={tintColor}
                            style={styles.headerBackImage}
                        ></Icon>
                    )
                }}
            ></ModelStack.Screen>
        </ModelStack.Navigator>
    )
}

class Navigator extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <ModelStackScreen></ModelStackScreen>
            </NavigationContainer>
        )
    }
}

const styles = StyleSheet.create({
    headerBackground: {
        flex: 1,
        backgroundColor: '#fff',
        opacity: 0
    },
    headerBackImage: {
        marginHorizontal: Platform.OS === 'android' ? 0 : 8
    }
})

export default Navigator