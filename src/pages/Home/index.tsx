import React from 'react'
import { FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'
import Carousel, { itemHeight } from './Carousel'
import Guess from './Guess'
import ChannelItem from './ChannelItem'
import { IChannel } from '@/models/home'

const mapStateToProps = ({home, loading}: RootState) => ({
    carousels: home.carousels,
    channels: home.channels,
    hasMore: home.pagination.hasMore,
    loading: loading.effects['home/fetchChannel'],
    gradientVisible: home.gradientVisible
})

// 状态映射
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

// 继承 model state
interface IProps extends ModelState {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

interface IState {
    refreshing: boolean
}

class Home extends React.Component<IProps, IState> {
    state = {
        refreshing: false
    }
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
    // 轮播图和猜你喜欢模块
    get header() {
        return (
            <View>
                <Carousel />
                <View style={styles.guessWrapper}>
                    <Guess />
                </View>
            </View>
        )
    }
    // 加载提示
    get footer() {
        const {loading, hasMore, channels} = this.props
        if(!hasMore) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>---我是有底线的---</Text>
                </View>
            )
        }
        if(loading && hasMore && channels.length > 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>正在加载中...</Text>
                </View>
            )
        }
    }
    // 暂无数据
    get empty() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>暂无数据</Text>
            </View>
        )
    }
    keyExtractor = (item: IChannel) => {
        return item.id
    }
    // 加载更多
    onEndReached = () => {
        // 正在加载以及无更多数据时中断
        const {loading, hasMore} = this.props
        if(loading || !hasMore) return

        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchChannel',
            payload: {
                loadMore: true
            }
        })
    }
    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        })
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchChannel',
            callback: () => {
                this.setState({
                    refreshing: false
                })
            }
        })
    }
    onScroll = ({nativeEvent}: NativeSyntheticEvent<NativeScrollEvent>) => {
        const {dispatch, gradientVisible} = this.props

        const offsetY = nativeEvent.contentOffset.y
        let newGradientVisible = itemHeight > offsetY

        if(gradientVisible !== newGradientVisible) {
            dispatch({
                type: 'home/setState',
                payload: {
                    gradientVisible: newGradientVisible
                }
            })
        }
    }
    render() {
        const {channels} = this.props
        const {refreshing} = this.state
        return (
            // ScrollView 的子组件不能有 FlatList，使用ListHeaderComponent 属性即可
            <FlatList
                ListHeaderComponent={this.header}
                ListFooterComponent={this.footer}
                ListEmptyComponent={this.empty}
                data={channels}
                renderItem={this.renderItem}
                // keyExtractor生成不重复的key，减少重新渲染，不指定时默认使用data的key或下标
                keyExtractor={this.keyExtractor}
                // 下拉
                onRefresh={this.onRefresh}
                refreshing={refreshing}
                // 上拉
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.2}
                // 监听滚动事件
                onScroll={this.onScroll}
            />
        )
    }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: 'center',
  },
  text: {
    color: '#333',
  },
  guessWrapper: {
      backgroundColor: '#fff',
  }
});

export default connector(Home)