import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import { ModelStackProps } from '../navigator'
import Touchable from '@/components/Touchable'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../models'
import Authorized from './Authorized'

const mapStateToProps = ({user}: RootState) => {
    return {
        user: user.user,
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    // navigation传过来的参数，可进行路由跳转
    navigation: ModelStackProps,
}

class Account extends React.Component<IProps> {
    pressHandler = () => {
        const {navigation} = this.props
        navigation.navigate("Login")
    }
    logout = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'user/logout',
        })
    }
    render() {
        const {user} = this.props
        return (
            <Authorized authority={!!user}>
                <View>
                    <View style={styles.loginView}>
                        <Image source={{uri: user?.avatar}} style={styles.avatar}></Image>
                        <View style={styles.right}>
                            <Text style={styles.tip}>{user?.name}</Text>
                        </View>
                    </View>
                    <Touchable style={[styles.loginBtn, {marginLeft: 15}]} onPress={this.logout}>
                        <Text style={styles.loginBtnText}>退出登录</Text>
                    </Touchable>
                </View>
            </Authorized>
        )
    }
}

const styles = StyleSheet.create({
    tip: {
        color: '#999',
    },
    loginBtnText: {
        color: '#f86442',
        fontWeight: 'bold',
    },
    loginBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 26,
        width: 76,
        borderRadius: 13,
        borderColor: '#f86442',
        borderWidth: 1,
        marginBottom: 12,
    },
    right: {
        flex: 1,
        marginLeft: 15,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    loginView: {
        flexDirection: 'row',
        margin: 15,
    },
})

export default connector(Account)