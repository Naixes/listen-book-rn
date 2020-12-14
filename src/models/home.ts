import { Effect, Model } from "dva-core-ts"
import { Reducer } from "redux"
import axios from 'axios'

// 轮播图
const CAROUSEL_URL = '/mock/11/carousel'
// 猜你喜欢
const GUESS_URL = '/mock/11/guess'

export interface ICarousel {
    id: string;
    image: string;
    corlor: [string, string];
}
export interface IGuess {
    id: string;
    title: string;
    image: string;
}

interface HomeState {
    carousels: ICarousel[],
    guess: IGuess[]
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
        fetchGuess: Effect
    };
}

const initialState: HomeState = {
    carousels: [],
    guess: []
}

const homeModel: HomeModel = {
    namespace: 'home',
    state: {
        carousels: [],
        guess: []
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
            
            // 和dispatch作用一样
            yield put({
                type: 'setState',
                payload: {
                    carousels: data
                }
            })
        },
        *fetchGuess({payload}, {call, put}) {
            const {data} = yield call(axios.get, GUESS_URL)
            
            // 和dispatch作用一样
            yield put({
                type: 'setState',
                payload: {
                    guess: data
                }
            })
        }
    }
}

export default homeModel