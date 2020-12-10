import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'

const mapStateToProps = ({home, loading}: RootState) => ({
    num: home.num,
    loading: loading.effects['home/asyncAdd']
})

// 状态映射
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

// 继承 model state
interface IProps extends ModelState {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

class Home extends React.Component<IProps> {
    pressHandler = () => {
        const {navigation} = this.props
        navigation.navigate("Detail", {id: 1})
    }
    pressAddHandler = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'home/add',
            payload: {
                num: 3
            }
        })
    }
    pressAsyncAddHandler = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'home/asyncAdd',
            payload: {
                num: 3
            }
        })
    }
    render() {
        const {num, loading} = this.props
        return (
            <View>
                <Text>Home{num}</Text>
                <Text>{loading? '正在努力计算中' : ''}</Text>
                <TouchableOpacity onPress={this.pressAddHandler}>
                    <Text>点击+3</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pressAsyncAddHandler}>
                    <Text>点击async+3</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pressHandler}>
                    <Text>点击跳转到详情</Text>
                </TouchableOpacity>
                {/* 安卓4.x的版本Button可能会报错 */}
                {/* <Button title="点击跳转到详情" onPress={this.pressHandler}></Button> */}
            </View>
        )
    }
}

export default connector(Home)