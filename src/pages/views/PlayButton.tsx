import React from 'react'
import { StyleSheet, Image, Animated, Easing } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import Icon from '@/assets/iconfont/index'
import Touchable from '@/components/Touchable';
import { RootState } from '@/models/index';
import Progress from '@/pages/views/CircleProgress'

const mapStateToProps = ({player}: RootState) => {
    return {
        thumbnailUrl: player.thumbnailUrl,
        playState: player.playState,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    onPress: () => void
}

class PlayButton extends React.Component<IProps> {
    animate = new Animated.Value(0)
    rotate: Animated.AnimatedInterpolation
    timing: Animated.CompositeAnimation
    constructor(props: IProps) {
        super(props)
        this.timing = Animated.loop(Animated.timing(this.animate, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
            easing: Easing.linear,
        }), {iterations: -1})
        this.rotate = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        })
    }
    componentDidMount() {
        const {playState} = this.props
        if(playState === 'playing') {
            this.timing.start()
        }
    }
    componentDidUpdate() {
        const {playState} = this.props
        if(playState === 'playing') {
            this.timing.start()
        }else {
            this.timing.stop()
        }
    }
    onPress = () => {
        const {onPress, thumbnailUrl} = this.props
        if(thumbnailUrl && onPress) {
            onPress()
        }
    }
    render() {
        const {thumbnailUrl} = this.props
        return (
            <Touchable style={styles.play} onPress={this.onPress}>
                <Progress>
                    <Animated.View style={{transform: [{rotate: this.rotate}]}}>
                        {
                            thumbnailUrl ?
                            <Image source={{uri: thumbnailUrl}} style={styles.image}></Image> :
                            <Icon name="icon-bofang3" color="#ededed" size={40}></Icon>
                        }
                    </Animated.View>
                </Progress>
            </Touchable>
        )
    }
}

const styles = StyleSheet.create({
    play: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderRadius: 21,
        width: 42,
        height: 42,
    }
})

export default connector(PlayButton)