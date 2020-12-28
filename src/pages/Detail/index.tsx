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
import Barrage, { IBarrage } from '@/components/Barrage'

const data: string[] = [
    '岁的妇女和进口奖励几乎都oh几乎要更',
    '已经不久阿努克不好看不你就是',
    '和身体个陛下不是，花椒壳',
    '教育和管理不好使了，户目标',
    '环境是不能通过因',
    '护肤六十年',
    '为你们王客',
    '尚未充分加敦郡',
    '和就这样办还是发给开始咯及欧文',
    '教育和管理不好使了，户目标',
    '维持境饰色能是v辅导班通过因',
    '护肤六十创下二年',
    '睡，加手势敦郡',
    '纷纷这样办还是发给开始咯及欧文',
    '教育和管理不好使了，户目标',
    '一天上午是不能是v辅导班通过因',
    '斯威夫特六十创下二年',
]
const randomIndex = (length: number) => {
    return Math.floor(Math.random() * length)
}
const getText = () => {
    return data[randomIndex(data.length)]
}

const mapStateToProps = ({player}: RootState) => {
    return {
        id: player.id,
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
    barrageData: IBarrage[],
}

const IMAGE_WIDTH = 180
const PADDING_TOP = (viewportWidth - IMAGE_WIDTH) / 2
const SCALE = viewportWidth / IMAGE_WIDTH

class Detail extends React.Component<IProps, IState> {
    state = {
        barrageVisible: false,
        barrageData: []
    }

    // 弹幕动画
    animate = new Animated.Value(1)

    componentDidMount() {
        const {dispatch, route, navigation, title, id} = this.props
        // 从播放按钮跳转时没有 params
        if(route.params && route.params.id !== id) {
            dispatch({
                type: 'player/fetchPlayer',
                payload: {
                    id: route.params.id
                }
            })
        }
        // 设置标题
        navigation.setOptions({
            headerTitle: title
        })
        this.addBarrage()
    }
    componentDidUpdate(prevProps: IProps) {
        const {navigation, title} = this.props
        if(title !== prevProps.title) {
            navigation.setOptions({
                headerTitle: title
            })
        }
    }

    addBarrage = () => {
        setInterval(() => {
            const {barrageVisible} = this.state
            if(barrageVisible) {
                const id = Date.now()
                const title = getText()
                this.setState({
                    barrageData: [{id, title}]
                })
            }
        }, 500)
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
        const {barrageVisible, barrageData} = this.state
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
                            <Barrage
                                source={barrageData}
                                maxTrack={5}
                                style={{top: PADDING_TOP}}
                            ></Barrage>
                        </>
                    )
                }
                {/* 弹幕按钮 */}
                <Touchable
                    onPress={this.barrage}
                    style={styles.barrageBtn}
                >
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