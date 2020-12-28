import React from 'react'
import { StyleSheet, Image, Animated, Easing } from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress'
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '@/models/index';

const mapStateToProps = ({player}: RootState) => {
    return {
        currentTime: player.currentTime,
        duration: player.duration,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}

class Progress extends React.PureComponent<IProps> {
    render() {
        const {children, currentTime, duration} = this.props
        const fill = duration ? currentTime / duration * 100 : 0
        return (
            <AnimatedCircularProgress
                size={40}
                width={2}
                tintColor="#f86442"
                backgroundColor="#ededed"
                fill={fill}
            >
                {() => <>{children}</>}
            </AnimatedCircularProgress>
        )
    }
}

const styles = StyleSheet.create({
})

export default connector(Progress)