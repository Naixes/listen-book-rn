import { Effect, Model } from "dva-core-ts"
import { Reducer } from "redux"
import axios from 'axios'

const CAROUSEL_URL = '/mock/11/carousel'

export interface ICarousel {
    id: string;
    image: string;
    corlor: [string, string]
}

interface HomeState {
    carousels: ICarousel[]
}

interface HomeModel extends Model {
    namespace: 'home';
    state: HomeState;
    reducers: {
        setState: Reducer<HomeState>
    };
    // 所有的函数都是生成器函数
    effects: {
        fetchCarousels: Effect
    };
}

const initialState: HomeState = {
    carousels: []
}

const homeModel: HomeModel = {
    namespace: 'home',
    state: {
        carousels: []
    },
    reducers: {
        setState(state = initialState, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    },
    effects: {
        *fetchCarousels({payload}, {call, put}) {
            // 解构出data
            const {data} = yield call(axios.get, CAROUSEL_URL)
            console.log('data', data);
            
            // 和dispatch作用一样
            yield put({
                type: 'setState',
                payload: {
                    carousels: data
                }
            })
        }
    }
}

export default homeModel