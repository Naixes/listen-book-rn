import { viewportWidth } from '@/utils/index'
import React from 'react'
import { Animated, Text, Easing } from 'react-native'
import { IBarrageInTrack } from '.'

interface IProps {
    data: IBarrageInTrack,
    outside: (data: IBarrageInTrack) => void
}

class BarrageItem extends React.PureComponent<IProps> {

    translateX = new Animated.Value(0)

    componentDidMount() {
        const {data, outside} = this.props
        Animated.timing(this.translateX, {
            toValue: 10,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({finished}) => {
            // 监听动画结束
            if(finished) {
                outside(data)
            }
        })
        // 监听动画
        // value 为 inputRange 0-10
        this.translateX.addListener(({value}) => {
            if(value > 3) {
                data.isFree = true
            }
        })
    }

    render() {
        const {data} = this.props
        // 获取弹幕大概长度
        const width = data.title.length * 15
        return (
            <Animated.View style={{
                transform: [
                    {
                        translateX: this.translateX.interpolate({
                            inputRange: [0, 10],
                            outputRange: [viewportWidth, -width]
                        })
                    }
                ],
                position: 'absolute',
                top: data.trackIndex * 30
            }}>
                <Text>{data.title}</Text>
            </Animated.View>
        )
    }
}

export default BarrageItem