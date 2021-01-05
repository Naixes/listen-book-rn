import storage, { load } from "@/config/storage";
import axios from "axios";
import { Effect, Model, SubscriptionsMapObject } from "dva-core-ts";
import {Reducer} from 'redux'
import { goback } from "../utils";
import Toast from 'react-native-root-toast'

const USER_URL = '/mock/11/login'

export interface IUser {
    avatar: string;
    name: string;
}

export interface UserModelState {
    user?: IUser,
}

interface UserModel extends Model {
    namespace: 'user',
    state: UserModelState,
    effects: {
        login: Effect,
        logout: Effect,
        loadStorage: Effect,
    },
    reducers: {
        setState: Reducer<UserModelState>
    },
    subscriptions: SubscriptionsMapObject,
}

const initialState: UserModelState = {
    user: undefined
}

const userModel: UserModel = {
    namespace: 'user',
    state: initialState,
    effects: {
        *login({payload}, {call, put}) {
            const {data, status, msg} = yield call(axios.post, USER_URL, payload)
            if(status === 100) {
                yield put({
                    type: 'setState',
                    payload: {
                        user: data
                    }
                })
                // 保存登录数据到本地
                storage.save({
                    key: 'user',
                    data
                })
                goback()
            }else {
                Toast.show(msg, {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true, 
                })
                console.log('msg', msg);
            }
        },
        *logout({payload}, {put}) {
            yield put({
                type: 'setState',
                payload: {
                    user: undefined,
                }
            })
            // 清空本地登录数据
            storage.save({
                key: 'user',
                data: null,
            })
        },
        *loadStorage({payload}, {put, call}) {
            try {
                // 获取登录数据
                const user = yield call(load, {key: 'user'})
                yield put({
                    type: 'setState',
                    payload: {
                        user,
                    }
                })
            } catch (error) {
                console.log('load storage error', error);
            }
        },
    },
    reducers: {
        setState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        }
    },
    subscriptions: {
        // 获取登录数据
        setup({dispatch}) {
            dispatch({
                type: 'loadStorage'
            })
        }
    },
}

export default userModel