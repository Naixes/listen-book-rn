import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { View, Text } from 'react-native'
import { RootStackParamList } from '../navigator'

interface IProps {
    // navigation传过来的参数，可获取路由信息
    route: RouteProp<RootStackParamList, 'Detail'>
}

class Detail extends React.Component<IProps> {
    render() {
        const {route} = this.props

        return (
            <View>
                <Text>Detail</Text>
                <Text>{route.params.id}</Text>
            </View>
        )
    }
}

export default Detail