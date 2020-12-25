import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import Touchable from '@/components/Touchable'
import { RootState } from '@/models/index'
import { ModelStackParamList, ModelStackProps } from '@/navigator/index'
import Icon from '@/assets/iconfont/index'
import PlayerSlider from './PlayerSlider'
import { viewportWidth } from '@/utils/index'
import LinearGradient from 'react-native-linear-gradient'
import Barrage from '@/components/Barrage'

const mapStateToProps = ({player}: RootState) => {
    return {
        soundUrl: player.soundUrl,
        playState: player.playState,
        title: player.title,
        prevId: player.prevId,
        nextId: player.nextId,
        thumbnailUrl: player.thumbnailUrl,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    navigation: ModelStackProps
    route: RouteProp<ModelStackParamList, 'Detail'>
}

interface IState {
    barrageVisible: boolean,
}

const IMAGE_WIDTH = 180
const PADDING_TOP = (viewportWidth - IMAGE_WIDTH) / 2
const SCALE = viewportWidth / IMAGE_WIDTH

class Detail extends React.Component<IProps, IState> {
    state = {
        barrageVisible: false,
    }

    // 弹幕动画
    animate = new Animated.Value(1)

    componentDidMount() {
        const {dispatch, route, navigation, title} = this.props
        dispatch({
            type: 'player/fetchPlayer',
            payload: {
                id: route.params.id
            }
        })
        // 设置标题
        navigation.setOptions({
            headerTitle: title
        })
    }
    componentDidUpdate(prevProps: IProps) {
        const {navigation, title} = this.props
        if(title !== prevProps.title) {
            navigation.setOptions({
                headerTitle: title
            })
        }
    }

    toggle = () => {
        const {dispatch, playState} = this.props
        dispatch({
            type: playState === 'playing' ? 'player/pause'  : 'player/play'
        })
    }

    prev = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'player/prev'
        })
    }

    next = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'player/next'
        })
    }

    barrage = () => {
        this.setState({
            barrageVisible: !this.state.barrageVisible
        })
        // 启动动画
        Animated.timing(this.animate, {
            toValue: this.state.barrageVisible ? 1 : SCALE,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    render() {
        const {playState, prevId, nextId, thumbnailUrl} = this.props
        const {barrageVisible} = this.state
        return (
            <View style={styles.container}>
                {/* 图片 */}
                <View style={styles.imageContainer}>
                    <Animated.Image
                        style={[styles.image, {
                            transform: [{scale: this.animate}]
                        }]}
                        source={{uri: thumbnailUrl}}
                    ></Animated.Image>
                </View>
                {
                    barrageVisible && (
                        <>
                            {/* 渐变色 */}
                            <LinearGradient colors={['rgba(128,104,102,0.5)', '#807c66']} style={styles.linear}></LinearGradient>
                            {/* 弹幕 */}
                            <Barrage></Barrage>
                        </>
                    )
                }
                {/* 弹幕 */}
                <Touchable onPress={this.barrage} style={styles.barrageBtn}>
                    <Text style={styles.barrageText}>弹幕</Text>
                </Touchable>
                {/* 进度条 */}
                <PlayerSlider></PlayerSlider>
                {/* 控制器 */}
                <View style={styles.control}>
                    <Touchable disabled={!prevId} onPress={this.prev}>
                        <Icon
                            name='icon-shangyishou'
                            size={30}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                    <Touchable onPress={this.toggle}>
                        <Icon
                            name={playState === 'playing' ? 'icon-paste' : 'icon-bofang'}
                            size={40}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                    <Touchable disabled={!nextId} onPress={this.next}>
                        <Icon
                            name='icon-xiayishou'
                            size={30}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    linear: {
        position: 'absolute',
        top: 0,
        width: viewportWidth,
        height: viewportWidth,
    },
    barrageBtn: {
        height: 20,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1,
        marginLeft: 10,
    },
    barrageText: {
        color: '#fff',
    },
    imageContainer: {
        height: IMAGE_WIDTH,
        alignItems: 'center',
    },
    image: {
        width: IMAGE_WIDTH,
        height: IMAGE_WIDTH,
        borderRadius: 8,
    },
    button: {
        marginHorizontal: 10,
    },
    control: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        marginHorizontal: 90,
    },
    container: {
        paddingTop: PADDING_TOP,
    }
})

export default connector(Detail)