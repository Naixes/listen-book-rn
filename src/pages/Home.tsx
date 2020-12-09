import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { RootStackProps } from '../navigator'

interface IProps {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

class Home extends React.Component<IProps> {
    pressHandler = () => {
        const {navigation} = this.props
        navigation.navigate("Detail", {id: 1})
    }
    render() {
        return (
            <View>
                <Text>Home</Text>
                <TouchableOpacity onPress={this.pressHandler}>
                    <Text>点击跳转到详情</Text>
                </TouchableOpacity>
                {/* 安卓4.x的版本Button可能会报错 */}
                {/* <Button title="点击跳转到详情" onPress={this.pressHandler}></Button> */}
            </View>
        )
    }
}

export default Home