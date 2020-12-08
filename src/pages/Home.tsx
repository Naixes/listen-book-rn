import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { RootStackProps } from '../navigator'

interface IProps {
    navigation: RootStackProps
}

class Home extends React.Component<IProps> {
    pressHandler = () => {
        const {navigation} = this.props
        navigation.navigate("Detail")
    }
    render() {
        return (
            <View>
                <Text>Home</Text>
                <TouchableOpacity onPress={this.pressHandler}>
                    <Text>点击跳转到详情</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default Home