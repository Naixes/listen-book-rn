import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ListRenderItemInfo, StyleSheet } from 'react-native'
import VideoControls from 'react-native-video-custom-controls'

import { IFound } from '@/models/found';

interface IProps {
    data: IFound,
    setCurrentId: (id: string) => void,
    pause: boolean,
}

interface IState {
}

class Item extends React.Component<IProps, IState> {
    onPlay = () => {
        const {data, setCurrentId} = this.props
        setCurrentId(data.id)
    }
    onPause = () => {
        const {setCurrentId} = this.props
        setCurrentId('')
    }
    render() {
        const {data, pause} = this.props
        return (
            <view>
                <Text>{data.title}</Text>
                <VideoControls
                    paused={pause}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    source={{uri: data.videoUrl}}
                    style={styles.video}
                ></VideoControls>
            </view>
        )
    }
}

const styles = StyleSheet.create({
    video: {
        height: 200,
    }
})

export default Item