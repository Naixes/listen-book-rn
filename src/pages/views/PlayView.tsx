import React from 'react'
import { StyleSheet, Text, View, Platform } from 'react-native';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '@/models/index';
import PlayButton from './PlayButton';
import { viewportWidth, navigate } from '@/utils/index';

const mapStateToProps = ({player}: RootState) => {
    return {
        playState: player.playState,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    routeName: string;
}

class PlayView extends React.Component<IProps> {
    onPress = () => {
        navigate('Detail')
    }
    render() {
        const {routeName, playState} = this.props
        if(['Root', 'Detail'].includes(routeName) || playState === 'pause') {
            return null
        }
        return (
            <View style={styles.container}>
                <PlayButton onPress={this.onPress}></PlayButton>
            </View>
        )
    }
}

const width = 50

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width,
        height: width + 20,
        bottom: 0,
        left: (viewportWidth - width) / 2,
        backgroundColor: 'rgba(255,255,255,0.42)',
        padding: 4,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // 阴影
        ...Platform.select({
            android: {
                elevation: 4
            },
            ios: {
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowOpacity: 0.85,
                shadowRadius: 5,
                shadowOffset: {
                    width: StyleSheet.hairlineWidth,
                    height: StyleSheet.hairlineWidth,
                }
            },
        })
    }
})

export default connector(PlayView)