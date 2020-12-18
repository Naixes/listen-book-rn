import { IProgram } from '@/models/album'
import { RootState } from '@/models/index'
import React from 'react'
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import Item from './Item'

const mapStateTpProps = ({album}: RootState) => {
    return {
        list: album.list
    }
}
const connector = connect(mapStateTpProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}

class List extends React.Component<IProps> {
    keyExtractor = (item: IProgram) => item.id
    onPress = (item: IProgram) => {
        
    }
    renderItem = ({item, index}: ListRenderItemInfo<IProgram>) => {
        return (
            <Item
                data={item}
                index={index}
                onPress={this.onPress}
            ></Item>
        )
    }
    render() {
        const {list} = this.props
        return (
            <FlatList
                style={styles.container}
                keyExtractor={this.keyExtractor}
                data={list}
                renderItem={this.renderItem}
            ></FlatList>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    }
})

export default connector(List)