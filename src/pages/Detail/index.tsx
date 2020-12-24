import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import Touchable from '@/components/Touchable'
import { RootState } from '@/models/index'
import { ModelStackParamList } from '@/navigator/index'
import Icon from '@/assets/iconfont/index'
import PlayerSlider from './PlayerSlider'

const mapStateToProps = ({player}: RootState) => {
    return {
        soundUrl: player.soundUrl,
        playState: player.playState,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    route: RouteProp<ModelStackParamList, 'Detail'>
}

class Detail extends React.Component<IProps> {
    componentDidMount() {
        const {dispatch, route} = this.props
        dispatch({
            type: 'player/fetchPlayer',
            payload: {
                id: route.params.id
            }
        })
    }

    toggle = () => {
        const {dispatch, playState} = this.props
        dispatch({
            type: playState === 'playing' ? 'player/pause'  : 'player/play'
        })
    }

    render() {
        const {playState} = this.props
        return (
            <View style={styles.container}>
                <Text>Detail</Text>
                <PlayerSlider></PlayerSlider>
                <Touchable onPress={this.toggle}>
                    <Icon
                        name={playState === 'playing' ? 'icon-paste' : 'icon-bofang'}
                        size={40}
                        color='#fff'
                    ></Icon>
                </Touchable>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
    }
})

export default connector(Detail)