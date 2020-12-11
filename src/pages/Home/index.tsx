import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'
import Carousel from '@/pages/Home/Carousel'

const mapStateToProps = ({home, loading}: RootState) => ({
    carousels: home.carousels,
    loading: loading.effects['home/fetchCarousels']
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
    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchCarousels'
        })
    }
    render() {
        const {carousels} = this.props
        console.log(carousels);
        
        return (
            <View>
                <Carousel data={carousels}/>
            </View>
        )
    }
}

export default connector(Home)