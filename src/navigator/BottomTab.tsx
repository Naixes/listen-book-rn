import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { NavigationContainer } from '@react-navigation/native'
import Home from '@/pages/Home'
import Listen from '@/pages/Listen'
import Found from '@/pages/Found'
import Account from '@/pages/Account'
import { RootStackParamList, RootStackProps } from '.'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native'

import Icon from '@/assets/iconfont/index'

type Route = RouteProp<RootStackParamList, 'BottomTab'>;

export interface IProps {
    navigation: RootStackProps,
    route: Route
}

export type BottomTabParamList = {
    Home: undefined;
    Listen: undefined;
    Found: undefined;
    Account: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>()

function getHeaderTile(route: Route) {
    // 获取当前路由名称
    const name = getFocusedRouteNameFromRoute(route)
    const routeName = name ? name : route.params ? route.params.screen : 'Home'
    let Titles = new Map([
        ['Home', '首页'],
        ['Listen', '我听'],
        ['Found', '发现'],
        ['Account', '我的'],
    ]);
    return Titles.get(routeName as string)
}

class BottomTabs extends React.Component<IProps> {
    componentDidUpdate() {
        const {navigation, route} = this.props
        navigation.setOptions({
            headerTitle: getHeaderTile(route)
        })
    }

    render()  {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: "#f86442"
            }}>
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: "首页",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-shouye" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Listen"
                    component={Listen}
                    options={{
                        tabBarLabel: "我听",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-shoucang" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Found"
                    component={Found}
                    options={{
                        tabBarLabel: "发现",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-faxian" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Account"
                    component={Account}
                    options={{
                        tabBarLabel: "我的",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-user" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
            </Tab.Navigator>
        )
    }
}

export default BottomTabs