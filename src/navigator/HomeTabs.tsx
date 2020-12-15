import React from 'react'
import {createMaterialTopTabNavigator, MaterialTopTabBarProps} from '@react-navigation/material-top-tabs'

import Home from '@/pages/Home/index'
import TopTabBarWrapper from '@/pages/views/TopTabBarWrapper'
import { StyleSheet } from 'react-native'

const Tab = createMaterialTopTabNavigator()

class HomeTabs extends React.Component {
    renderTabBar = (props: MaterialTopTabBarProps) => {
        // 在原有组件基础上进行修改
        return (
            <TopTabBarWrapper {...props}></TopTabBarWrapper>
        )
    }
    render() {
        return (
            <Tab.Navigator
                lazy
                // 设置tab内容透明背景色
                sceneContainerStyle={styles.sceneContainer}
                // 自定义tabBar
                tabBar={this.renderTabBar}
                tabBarOptions={{
                    scrollEnabled: true,
                    tabStyle: {
                        width: 80
                    },
                    indicatorStyle: {
                        height: 4,
                        width: 60,
                        marginLeft: 10,
                        borderRadius: 2,
                        backgroundColor: "#f86442"
                    },
                    activeTintColor: "#f86442",
                    inactiveTintColor: "#333"
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: "首页"
                    }}
                ></Tab.Screen>
            </Tab.Navigator>
        )
    }
}

const styles = StyleSheet.create({
    sceneContainer: {
        backgroundColor: 'transparent'
    }
})

export default HomeTabs