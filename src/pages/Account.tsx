import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { RootStackProps } from '../navigator'

interface IProps {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

class Account extends React.Component<IProps> {
    pressHandler = () => {
        const {navigation} = this.props
        navigation.navigate("Detail", {id: 1})
    }
    render() {
        return (
            <View>
                <Text>Account</Text>
                <TouchableOpacity onPress={this.pressHandler}>
                    <Text>点击跳转到详情</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Account