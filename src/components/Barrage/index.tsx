import React from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import BarrageItem from './Item'

export interface IBarrage {
    id: number;
    title: string;
}

export interface IBarrageInTrack extends IBarrage {
    trackIndex: number;
    isFree?: boolean;
}

interface IProps {
    source: IBarrage[],
    maxTrack: number,
    style?: StyleProp<ViewStyle>
}

interface IState {
    data: IBarrage[],
    list: IBarrageInTrack[][],
}

// 添加弹幕
function addBarrage(data: IBarrage[], maxTrack: number, list: IBarrageInTrack[][]) {
    for (let index = 0; index < data.length; index++) {
        const trackIndex = getTrackIndex(maxTrack, list)
        
        if(trackIndex < 0) {
            continue
        }
        // 初始化
        if(!list[trackIndex]) {
            list[trackIndex] = []
        }
        const barrage = {
            ...data[index],
            trackIndex,
            isFree: false,
        }
        list[trackIndex].push(barrage)
    }
    return list
}

// 获取需要增加弹幕的轨道下标
function getTrackIndex(maxTrack: number, list: IBarrageInTrack[][]) {
    for (let index = 0; index < maxTrack; index++) {
        const barrages = list[index]
        if(!barrages || barrages.length === 0) {
            return index
        }
        const lastBarrage = barrages[barrages.length - 1]
        
        if(lastBarrage.isFree) {
            return index
        }
    }
    return -1
}

class Barrage extends React.Component<IProps, IState> {
    state = {
        data: this.props.source,
        list: [this.props.source.map(item => ({...item, trackIndex: 0}))],
    }

    // 监听动画时修改空闲标记
    animateListener = (data: IBarrageInTrack) => {
        data.isFree = true;
    }

    // 生命周期函数，从props中获取数据更新state，会在每次重新渲染时调用
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const {source, maxTrack} = nextProps
        if(source !== prevState.data) {
            // 返回新的state
            return {
                source,
                // 合并list
                list: addBarrage(source, maxTrack, prevState.list)
            }
        }
        return null
    }

    outsideHandler = (data: IBarrageInTrack) => {
        const {list} = this.state
        const newList = list.slice()
        if(newList.length > 0) {
            const {trackIndex} = data
            newList[trackIndex] = newList[trackIndex].filter(item => item.id !== data.id)
            this.setState({
                list: newList
            })
        }
    }

    renderItem = (item: IBarrageInTrack[], index: number) => {
        return item.map(barrage => {
            return (
                <BarrageItem
                    key={barrage.id}
                    data={barrage}
                    outside={this.outsideHandler}
                    animateListener={this.animateListener}
                ></BarrageItem>
            )
        })
    }

    render() {
        const {list} = this.state
        const {style} = this.props
        return (
            <View style={[styles.container, style]}>
                { list.map(this.renderItem) }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    }
})

export default Barrage