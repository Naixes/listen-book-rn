import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'

import defaultAvatar from '@/assets/default_avatar.png'
import Touchable from '@/components/Touchable'
import { navigate } from '../utils'

interface IProps {
    children: React.ReactNode,
    authority?: boolean,
    noMatch?: () => JSX.Element
}

class Authorized extends React.Component<IProps> {
    pressHandler = () => {
        navigate("Login")
    }
    renderNoMatch = () => {
        if(this.props.noMatch) {
            return this.props.noMatch
        }else {
            return (
                <View style={styles.loginView}>
                    <Image source={defaultAvatar} style={styles.avatar}></Image>
                    <View style={styles.right}>
                        <Touchable style={styles.loginBtn} onPress={this.pressHandler}>
                            <Text style={styles.loginBtnText}>立即登录</Text>
                        </Touchable>
                        <Text style={styles.tip}>登录后自动同步所有记录</Text>
                    </View>
                </View>
            )
        }
    }
    render() {
        const {children, authority} = this.props
        if(authority) {
            return children
        }else {
            return (this.renderNoMatch())
        }
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

export default Authorized