import React from 'react'
import { Text, View } from 'react-native'
import {TabView} from 'react-native-tab-view'
import Introduction from './Introduction'

interface IRoute {
    key: string;
    title: string;
}

class Tab extends React.Component {
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
            // case 'albums':
            //     return <List />
            default:
                break;
        }
    }
    render() {
        // const {routes, index} = this.state
        return (
            <TabView
                navigationState={this.state}
                onIndexChange={this.onIndexChange}
                // 渲染每一个标签
                renderScene={this.renderScene}
            >
            </TabView>
        )
    }
}

export default Tab