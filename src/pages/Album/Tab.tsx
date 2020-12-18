import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import {SceneRendererProps, TabBar, TabView} from 'react-native-tab-view'
import Introduction from './Introduction'
import List from './List'

interface IRoute {
    key: string;
    title: string;
}

interface IState {
    routes: IRoute[];
    index: number;
}

interface IProps {}

class Tab extends React.Component<IProps, IState> {
    state = {
        // 默认下标 1
        index: 1,
        routes: [
            { key: 'introduction', title: '简介' },
            { key: 'albums', title: '节目' },
        ],
    }
    onIndexChange = (index: number) => {
        this.setState({
            index,
        })
    }
    renderScene = ({route}: {route: IRoute}) => {
        switch (route.key) {
            case 'introduction':
                return <Introduction />
            case 'albums':
                return <List />
            default:
                break;
        }
    }
    renderTabBar = (props: SceneRendererProps & {navigationState: IState}) => {
        return (
            <TabBar
                {...props}
                // 启动滚动，自定义宽度，默认平分
                scrollEnabled
                tabStyle={styles.tabStyle}
                labelStyle={styles.label}
                style={styles.tabbar}
                // 指示器样式
                indicatorStyle={styles.indicator}
            ></TabBar>
        )
    }
    render() {
        // const {routes, index} = this.state
        return (
            <TabView
                navigationState={this.state}
                onIndexChange={this.onIndexChange}
                // 渲染每一个标签
                renderScene={this.renderScene}
                // 自定义tabBar
                renderTabBar={this.renderTabBar}
            >
            </TabView>
        )
    }
}

const styles = {
    tabStyle: {
        width: 80,
    },
    label: {
        color: '#333',
    },
    tabbar: {
        backgroundColor: '#fff',
        ...Platform.select({
            android: {
                elevation: 0,
                borderBottomColor: '#e3e3e3',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }
        })
    },
    indicator: {
        backgroundColor: '#eb6d48',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderColor: '#fff',
    },
}

export default Tab