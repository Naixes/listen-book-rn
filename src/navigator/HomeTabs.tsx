import React from 'react'
import {createMaterialTopTabNavigator, MaterialTopTabBarProps} from '@react-navigation/material-top-tabs'
import { StyleSheet } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import Home from '@/pages/Home/index'
import TopTabBarWrapper from '@/pages/views/TopTabBarWrapper'
import { RootState } from '../models'
import { ICategory } from '@/models/category'
import { createHomeModel } from '@/config/dva'

export type HomeTabList = {
    [key: string]: {
        namespace: string;
    }
}

const Tab = createMaterialTopTabNavigator<HomeTabList>()

const mapStateToProps = ({category}: RootState) => {
    return {
        myCategorys: category.myCategorys
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>
interface IProps extends ModelState {}

class HomeTabs extends React.Component<IProps> {
    renderTabBar = (props: MaterialTopTabBarProps) => {
        // 在原有组件基础上进行修改
        return (
            <TopTabBarWrapper {...props}></TopTabBarWrapper>
        )
    }
    renderScreen = (item: ICategory) => {
        createHomeModel(item.id)
        return (
            <Tab.Screen
                key={item.id}
                name={item.id}
                component={Home}
                options={{
                    tabBarLabel: item.name
                }}
                initialParams={{
                    // 当前使用的model
                    namespace: item.id
                }}
            ></Tab.Screen>
        )
    }
    render() {
        const {myCategorys} = this.props
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
                {/* 动态生成 Tab.Screen */}
                { myCategorys.map(this.renderScreen) }
            </Tab.Navigator>
        )
    }
}

const styles = StyleSheet.create({
    sceneContainer: {
        backgroundColor: 'transparent'
    }
})

export default connector(HomeTabs)