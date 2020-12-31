import React from 'react'
import {FlatList, ListRenderItemInfo, View, Text } from 'react-native'
import { connect, ConnectedProps } from 'react-redux';
import { IFound } from '@/models/found';
import Item from './Item';

const connector = connect()
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}

interface IState {
    list: IFound[];
    currentId: string;

}

class Found extends React.Component<IProps, IState> {
    state={
        list: [],
        currentId: ''
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: 'found/fetchList',
            callback: (data: IFound[]) => {
                this.setState({
                    list: data,
                })
            }
        })
    }
    setCurrentId = (id: string) => {
        const {dispatch} = this.props
        this.setState({
            currentId: id
        })
        // 暂停音频
        if(id) {
            dispatch({
                type: 'player/pause'
            })
        }
    }
    renderItem = ({item}: ListRenderItemInfo<IFound>) => {
        const {currentId} = this.state
        // 判断当前视频是否正在播放
        const pause = currentId !== item.id
        return (
            <Item pause={pause} setCurrentId={this.setCurrentId} data={item}></Item>
        )
    }
    keyExtractor = (item: IFound) => {
        return item.id
    }
    render() {
        const {list, currentId} = this.state
        return (
            // FlatList是一个PureComponent如果数据没有改变不会重新渲染
            <FlatList
                // extraData改变时可以让其重新渲染
                keyExtractor={this.keyExtractor}
                extraData={currentId}
                data={list}
                renderItem={this.renderItem}
            />
        )
    }
}

export default connector(Found)