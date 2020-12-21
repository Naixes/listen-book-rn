import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import {useHeaderHeight} from '@react-navigation/stack'
import { connect, ConnectedProps } from 'react-redux'
import { RouteProp } from '@react-navigation/native'
import {BlurView} from '@react-native-community/blur'

import { RootState } from '@/models/index'
import { RootStackParamList } from '@/navigator/index'
import CoverRight from '@/assets/cover-right.png'
import DefaultAvatar from '@/assets/default_avatar.png'
import Tab from './Tab'

const mapStateToProps = ({album}: RootState) => {
    return {
        summary: album.summary,
        author: album.author,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    // RouteProp：推导route类型
    route: RouteProp<RootStackParamList, 'Album'>
}

// useHeaderHeight是hook函数在函数式组件中使用
const Album: React.FC<IProps> = ({dispatch, route, summary, author}) => {
    const {id, title, image} = route.params.item

    // 获取标题栏的高度
    const headerHeight = useHeaderHeight()

    useEffect(() => {
        dispatch({
            type: 'album/fetchAlbum',
            payload: {
                id
            }
        })
    }, [dispatch, route.params.item.id]);

    const renderHeader = () => {
        return (
        <View style={[styles.header, {paddingTop: headerHeight}]}>
            {/* 背景 */}
            {/* BlurView包含的组件都会模糊 */}
            {/* blurAmount：模糊程度，默认10 */}
            <Image style={styles.background} source={{uri: image}}></Image>
            {/* BlurView不能有子元素 */}
            <BlurView blurType='light' blurAmount={10} style={StyleSheet.absoluteFillObject}>
            </BlurView>
            <View style={styles.leftView}>
                <Image style={styles.thumbnail} source={{uri: image}}></Image>
                <Image style={styles.coverRight} source={CoverRight}></Image>
            </View>
            <View style={styles.rightView}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.summary}>
                    <Text style={styles.summaryText} numberOfLines={1}>{summary}</Text>
                </View>
                <View style={styles.author}>
                    <Image style={styles.avatar} source={author.avatar ? {uri: author.avatar} : DefaultAvatar}></Image>
                    <Text style={styles.name}>{author.name}</Text>
                </View>
            </View>
        </View>
        )
    }
    return (
        <View style={styles.container}>
            {renderHeader()}
            <Tab></Tab>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#eee',
        // 模糊效果，yarn add @react-native-community/blur

    },
    header: {
        height: 260,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    leftView: {
        marginRight: 26,
    },
    thumbnail: {
        width: 98,
        height: 98,
        borderColor: '#fff',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    coverRight: {
        height: 90,
        position: 'absolute',
        right: -23,
        resizeMode: 'contain',
    },
    rightView: {
        flex: 1,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    summary: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 10,
        marginVertical: 10,
        borderRadius: 4,
    },
    summaryText: {
        color: '#fff',
    },
    author: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        marginRight: 8,
    },
    name: {
        color: '#fff',
    },
})

// class Album extends React.Component {
//     render() {
//         return (
//             <View>
//                 <Text>频道模块</Text>
//             </View>
//         )
//     }
// }

export default connector(Album)