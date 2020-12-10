import { Effect, Model } from "dva-core-ts"
import { Reducer } from "redux"

interface HomeState {
    num: number
}

interface HomeModel extends Model {
    namespace: 'home';
    state: HomeState;
    reducers: {
        add: Reducer<HomeState>
    };
    // 所有的函数都是生成器函数
    effects: {
        asyncAdd: Effect
    };
}

const initialState = {
    num: 0
}

const delay = (timeout: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

const homeModel: HomeModel = {
    namespace: 'home',
    state: {
        num: 0
    },
    reducers: {
        add(state = initialState, {payload}) {
            return {
                ...state,
                num: state.num + payload.num
            }
        }
    },
    effects: {
        *asyncAdd({payload}, {call, put}) {
            yield call(delay, 1000)
            // 和dispatch作用一样
            yield put({
                type: 'add',
                payload
            })
        }
    }
}

export default homeModel