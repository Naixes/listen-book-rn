import React from 'react'
import { View, Text, FlatList, ListRenderItemInfo, StyleSheet, Image } from 'react-native'

import realm, { IPlayer } from '@/config/realm';
import Icon from '@/assets/iconfont/index'
import { formatTime } from '../utils';
import Touchable from '@/components/Touchable';

class Listen extends React.Component {
    renderItem = ({item}: ListRenderItemInfo<IPlayer>) => {
        return (
            <View style={styles.item}>
                <Image style={styles.image} source={{uri: item.thumbnailUrl}}></Image>
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.bottom}>
                        <Icon name='icon-time' color="#999" size={14}></Icon>
                        <Text style={styles.text}>{formatTime(item.currentTime)}</Text>
                        <Text style={styles.rate}>已播放：{item.rate}%</Text>
                    </View>
                </View>
                <Touchable onPress={() => this.delete(item)} style={styles.deleteBtn}>
                    <Text style={styles.delete}>删除</Text>
                </Touchable>
            </View>
        )
    }

    delete = (item: IPlayer) => {
        realm.write(() => {
            // 先查询
            const player = realm.objects('Player').filtered(`id='${item.id}'`)
            realm.delete(player)
            // 刷新页面
            this.setState({})
        })
    }
    
    render() {
        const players = realm.objects<IPlayer>('Player')
        return (
            <FlatList
                data={players}
                renderItem={this.renderItem}
            ></FlatList>
        )
    }
}

const styles = StyleSheet.create({
    deleteBtn: {
        padding: 10,
        justifyContent: 'center',
    },
    delete: {
        color: '#f6a624',
    },
    item: {
        flexDirection: 'row',
        marginHorizontal: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    image: {
        width: 65,
        height: 65,
        borderRadius: 3,
        margin: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'space-around'
    },
    title: {
        color: '#999',
    },
    text: {
        color: '#999',
        marginLeft: 5,
    },
    bottom: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rate: {
        marginLeft: 20,
        color: '#f6a624',
    },
})

export default Listen