import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import Touchable from '@/components/Touchable'
import { RootState } from '@/models/index'
import { ModelStackParamList, ModelStackProps } from '@/navigator/index'
import Icon from '@/assets/iconfont/index'
import PlayerSlider from './PlayerSlider'

const mapStateToProps = ({player}: RootState) => {
    return {
        soundUrl: player.soundUrl,
        playState: player.playState,
        title: player.title,
        prevId: player.prevId,
        nextId: player.nextId,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    navigation: ModelStackProps
    route: RouteProp<ModelStackParamList, 'Detail'>
}

class Detail extends React.Component<IProps> {
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

    render() {
        const {playState, prevId, nextId} = this.props
        return (
            <View style={styles.container}>
                <Text>Detail</Text>
                <PlayerSlider></PlayerSlider>
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
        paddingTop: 100,
    }
})

export default connector(Detail)