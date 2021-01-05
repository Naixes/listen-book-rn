import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import {Field, Formik} from 'formik'
import { TextInput } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import * as Yup from 'yup'

import Touchable from '@/components/Touchable'
import { RootState } from '../models'
import Input from '@/components/Input'

interface Values {
    account: string;
    password: string;
}

const initialValues = {
    account: '',
    password: '',
}

const mapStateToProps = ({loading}: RootState) => {
    return {
        loading: loading.effects['user/login']
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}

const validationSchema = Yup.object().shape({
    account: Yup.string().trim().required('请输入账号'),
    password: Yup.string().trim().required('请输入密码'),
})

class Login extends React.Component<IProps> {
    onSubmit = (values: Values) => {
        const {dispatch} = this.props
        
        dispatch({
            type: 'user/login',
            payload: values
        })
    }
    render() {
        const {loading} = this.props
        return (
            // keyboardShouldPersistTaps:"handled"切换多个input时，键盘一直唤醒
            <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.logo}>听书</Text>
                <Formik
                    initialValues={initialValues}
                    onSubmit={this.onSubmit}
                    // 定义校验规则
                    validationSchema={validationSchema}
                >
                    {({values, handleChange, handleBlur, handleSubmit, errors}) => {
                        return (
                            <View>
                                <Field
                                    name="account"
                                    component={Input}
                                    placeholder="请输入账号"
                                ></Field>
                                <Field
                                    name="password"
                                    component={Input}
                                    secureTextEntry
                                    placeholder="请输入密码"
                                ></Field>
                                <Touchable disabled={loading} style={styles.loginBtn} onPress={handleSubmit}>
                                    <Text style={styles.loginBtnText}>登录</Text>
                                </Touchable>
                            </View>
                        )
                    }}
                </Formik>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    loginBtn: {
        height: 40,
        borderRadius: 20,
        borderColor: "#ff4000",
        borderWidth: 1,
        margin: 10,
        marginTop: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtnText: {
        color: "#ff4000",
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        color: "#ff4000",
        fontWeight: 'bold',
        fontSize: 50,
        textAlign: 'center',
    }
})

export default connector(Login)