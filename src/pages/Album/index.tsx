import React from 'react'
import { Image, StyleSheet, Text, View, Animated, findNodeHandle } from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'
import { connect, ConnectedProps } from 'react-redux'
import { RouteProp } from '@react-navigation/native'
import {BlurView} from '@react-native-community/blur'

import { RootState } from '@/models/index'
import { ModelStackProps, RootStackParamList } from '@/navigator/index'
import CoverRight from '@/assets/cover-right.png'
import DefaultAvatar from '@/assets/default_avatar.png'
import Tab from './Tab'
// 手势库
import { PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler'
import { viewportHeight } from '@/utils/index'
import { IProgram } from '@/models/album'
// 这个库旨在解决React Native在动画方面的性能问题，让我们能够创建运行在UI线程上的顺滑动画和流畅交互
// import Animated, { Easing } from 'react-native-reanimated'

const mapStateToProps = ({album}: RootState) => {
    return {
        list: album.list,
        album: album,
        summary: album.summary,
        author: album.author,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    // RouteProp：推导route类型
    route: RouteProp<RootStackParamList, 'Album'>;
    headerHeight: number;
    navigation: ModelStackProps
}

interface IState {
    viewRef: number | null;
}

const USE_NATIVE_DRIVER = true
const HEADER_HEIGHT = 260

// useHeaderHeight是hook函数在函数式组件中使用
class Album extends React.Component<IProps, IState> {
    state = {
      viewRef: null,
    }
    
    RANGE = [-(HEADER_HEIGHT - this.props.headerHeight), 0]
    backgroundImage = React.createRef<Image>();
    // 1. 声明动画值
    translationY = new Animated.Value(0)
    translationYOffset = new Animated.Value(0)
    translateY = Animated.add(this.translationY, this.translationYOffset)
    translationYValue = 0
    // // 2. 声明动画
    // Animated.timing(this.translateY, {
    //     toValue: -170,
    //     duration: 3000,
    //     // 启动原生动画驱动
    //     useNativeDriver: USE_NATIVE_DRIVER
    // }).start()

    componentDidMount() {
        const {dispatch, route} = this.props
        const {id} = route.params.item
        dispatch({
            type: 'album/fetchAlbum',
            payload: {
                id
            }
        })
    }

    onLoadEnd = () => {
        this.setState({viewRef: findNodeHandle(this.backgroundImage.current)});
        
    }

    renderHeader = () => {
        const {route, headerHeight, summary, author} = this.props
        const {title, image} = route.params.item
        return (
            <View style={[styles.header, {paddingTop: headerHeight}]}>
                {/* 背景 */}
                {/* BlurView包含的组件都会模糊 */}
                {/* blurAmount：模糊程度，默认10 */}
                <Image
                    ref={this.backgroundImage}
                    style={styles.background}
                    source={{uri: image}}
                    onLoadEnd={this.onLoadEnd}
                ></Image>
                {/* BlurView不能有子元素 */}
                {
                    this.state.viewRef ? 
                    <BlurView
                        blurType='light'
                        blurAmount={10}
                        style={StyleSheet.absoluteFillObject}
                        viewRef={this.state.viewRef}
                    >
                    </BlurView> : 
                    null
                }
                <View style={styles.leftView}>
                    <Image style={styles.thumbnail} source={{uri: image}}></Image>
                    <Image style={styles.coverRight} source={CoverRight}></Image>
                </View>
                <View style={styles.rightView}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.summary}>
                        <Text style={styles.summaryText} numberOfLines={1}>{summary}</Text>
                    </View>
                    <View style={styles.author}>
                        <Image style={styles.avatar} source={author.avatar ? {uri: author.avatar} : DefaultAvatar}></Image>
                        <Text style={styles.name}>{author.name}</Text>
                    </View>
                </View>
            </View>
        )
    }

    // 监听拖动
    // onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    //     console.log(event.nativeEvent.translationY);
    // }
    onGestureEvent = Animated.event([{
        // 绑定 translationY
        nativeEvent: {translationY: this.translationY}
    }], 
    // 配置
    { useNativeDriver: USE_NATIVE_DRIVER })

    // 监听手势状态
    onHandlerStateChange = ({nativeEvent}: PanGestureHandlerStateChangeEvent) => {
        // 防止每次拖动都回到初始高度
        // 上一次状态是活动的
        if(nativeEvent.oldState === State.ACTIVE) {
            let {translationY} = nativeEvent
            // 每个Animated.Value中都有两个值，一个value一个offset
            // 将 translationYOffset 的 value 值设置到 offset 上清空value值
            // offset = value
            this.translationYOffset.extractOffset()
            // 重新设置 value
            // value = translationY
            this.translationYOffset.setValue(translationY)
            // 将 offset 和 value 相加重新设置 value
            // value = value + offset
            this.translationYOffset.flattenOffset()
            this.translationY.setValue(0)
            this.translationYValue += translationY
            // 判断是否超出范围
            // spring：弹簧效果，inputRange、outputRange也要对应修改
            if(this.translationYValue < this.RANGE[0]) {
                this.translationYValue = this.RANGE[0]
                Animated.timing(this.translationYOffset, {
                    toValue: this.RANGE[0],
                    duration: 1000,
                    useNativeDriver: USE_NATIVE_DRIVER
                }).start()
            }else if(this.translationYValue > this.RANGE[1]) {
                this.translationYValue = this.RANGE[1]
                Animated.timing(this.translationYOffset, {
                    toValue: this.RANGE[1],
                    duration: 1000,
                    useNativeDriver: USE_NATIVE_DRIVER
                }).start()
            }
        }
    }

    onItemPress = (item: IProgram, index: number) => {
        // 跳转详情
        const {navigation, dispatch, list, route} = this.props
        navigation.navigate('Detail', {id: item.id})
        // 保存上一首和下一首和整个list
        const prevItem = list[index - 1]
        const nextItem = list[index + 1]
        dispatch({
            type: 'player/setState',
            payload: {
                prevId: prevItem ? prevItem.id : '',
                nextItem: nextItem ? nextItem.id : '',
                sounds: list.map(item => ({id: item.id, title: item.title})),
                title: item.title,
                thumbnailUrl: route.params.item.image,
            }
        })
    }

    render() {
        return (
            // onHandlerStateChange手势状态改变时调用
            <PanGestureHandler onHandlerStateChange={this.onHandlerStateChange} onGestureEvent={this.onGestureEvent}>
                {/* 4. 使用动画值 */}
                <Animated.View style={[styles.container,
                    {
                        // opacity: translateY.interpolate({
                        // inputRange: [-170, 0],
                        // outputRange: [1, 0],
                        // }),
                        transform: [{translateY: this.translateY.interpolate({
                            inputRange: this.RANGE,
                            outputRange: this.RANGE,
                            // 超出范围不做处理
                            extrapolate: 'clamp',
                        })}]
                    }
                ]}>
                    {this.renderHeader()}
                    {/* 设置列表高度 */}
                    <View style={{height: viewportHeight - this.props.headerHeight}}>
                        <Tab onItemPress={this.onItemPress} ></Tab>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        )
    }

}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#eee',
        // 模糊效果，yarn add @react-native-community/blur
    },
    header: {
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    leftView: {
        marginRight: 26,
    },
    thumbnail: {
        width: 98,
        height: 98,
        borderColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    coverRight: {
        height: 90,
        position: 'absolute',
        right: -23,
        resizeMode: 'contain',
    },
    rightView: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    summary: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        marginVertical: 10,
        borderRadius: 4,
    },
    summaryText: {
        color: '#fff',
    },
    author: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        marginRight: 8,
    },
    name: {
        color: '#fff',
    },
})

const Wrapper = function(props: IProps) {
    // 获取标题栏的高度
    const headerHeight = useHeaderHeight();
    return <Album {...props} headerHeight={headerHeight} />;
  };

export default connector(Wrapper)