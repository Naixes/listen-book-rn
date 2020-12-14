import React from 'react'
import { FlatList, ListRenderItemInfo, ScrollView, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'
import Carousel from './Carousel'
import Guess from './Guess'
import ChannelItem from './ChannelItem'
import { IChannel } from '@/models/home'

const mapStateToProps = ({home, loading}: RootState) => ({
    carousels: home.carousels,
    channels: home.channels,
    loading: loading.effects['home/fetchCarousels']
})

// 状态映射
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

// 继承 model state
interface IProps extends ModelState {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

class Home extends React.Component<IProps> {
    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchCarousels'
        })
        dispatch({
            type: 'home/fetchChannel'
        })
    }
    onPress = (data: IChannel) => {
        console.log(data);
    }
    renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
        return (
            <ChannelItem onPress={this.onPress} item={item}></ChannelItem>
        )
    }
    get header() {
        const {carousels} = this.props
        return (
            <View>
                <Carousel data={carousels}/>
                <Guess />
            </View>
        )
    }
    keyExtractor = (item: IChannel) => {
        return item.id
    }
    render() {
        const {channels} = this.props
        return (
            // ScrollView 的子组件不能有 FlatList，使用ListHeaderComponent 属性即可
            <FlatList
                ListHeaderComponent={this.header}
                data={channels}
                renderItem={this.renderItem}
                // keyExtractor生成不重复的key，减少重新渲染，不指定时默认使用data的key或下标
                keyExtractor={this.keyExtractor}
            />
        )
    }
}

export default connector(Home)