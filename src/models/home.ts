import { Effect, Model } from "dva-core-ts"
import { Reducer } from "redux"
import axios from 'axios'
import { RootState } from "."

// 轮播图
const CAROUSEL_URL = '/mock/11/carousel'
// 猜你喜欢
const GUESS_URL = '/mock/11/guess'
// 首页列表
const CHANNEL_URL = '/mock/11/channel'

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
export interface IChannel {
    id: string;
    title: string;
    image: string;
    remark: string;
    played: number;
    playing: number;
}

export interface IPagination {
    current: number;
    total: number;
    hasMore: boolean;
}

interface HomeState {
    carousels: ICarousel[],
    guess: IGuess[],
    channels: IChannel[],
    pagination: IPagination,
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
        fetchChannel: Effect
    };
}

const initialState: HomeState = {
    carousels: [],
    guess: [],
    channels: [],
    pagination: {
        current: 1,
        total: 0,
        hasMore: true,
    }
}

const homeModel: HomeModel = {
    namespace: 'home',
    state: initialState,
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
        },
        *fetchChannel({callback, payload}, {call, put, select}) {
            const {channels, pagination} = yield select((state: RootState) => state.home)

            // 获取页码
            let page = 1
            if(payload && payload.loadMore) {
                page = pagination.current + 1
            }
            const {data} = yield call(axios.get, CHANNEL_URL, {
                params: {
                    page
                }
            })
            let newChannels = data.results

            // 加载更多时进行数据拼接
            if(payload && payload.loadMore) {
                newChannels = channels.concat(newChannels)
            }

            let newPagination = data.pagination
            
            // 和dispatch作用一样
            yield put({
                type: 'setState',
                payload: {
                    channels: newChannels,
                    pagination: {
                        current: newPagination.current,
                        total: newPagination.total,
                        hasMore: newChannels.length < newPagination.total
                    }
                }
            })
            if(typeof callback === 'function') {
                callback()
            }
        }
    }
}

export default homeModel