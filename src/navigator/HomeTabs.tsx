import React from 'react'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import Home from '@/pages/Home'

const Tab = createMaterialTopTabNavigator()

class HomeTabs extends React.Component {
    render() {
        return (
            <Tab.Navigator
                lazy
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

export default HomeTabs