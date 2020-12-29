import { initPlay, pause, play, getCurrentTime, getDuration, stop } from "@/config/sound";
import axios from "axios";
import { Effect, EffectsCommandMap, EffectWithType, Model } from "dva-core-ts";
import { Reducer } from "redux";
import { RootState } from ".";
import { savePlayer } from "@/config/realm";

const PLAYER_URL = '/mock/11/player'

export interface PlayerState {
    id: string;
    title: string;
    soundUrl: string;
    playState: string;
    currentTime: number;
    duration: number;
    prevId: string;
    nextId: string;
    sounds: {id: string, title: string}[];
    thumbnailUrl: string;
}

export interface PlayerModel extends Model {
    namespace: 'player',
    state: PlayerState,
    effects: {
        fetchPlayer: Effect,
        play: Effect,
        pause: Effect,
        // 监听播放时间
        // EffectWithType 是一个数组
        currentTimeWatcher: EffectWithType,
        prev: Effect,
        next: Effect,
    },
    reducers: {
        setState: Reducer<PlayerState>
    }
}

const initialState: PlayerState = {
    id: '',
    title: '',
    soundUrl: '',
    playState: 'pause',
    currentTime: 0,
    duration: 0,
    prevId: '',
    nextId: '',
    sounds: [],
    thumbnailUrl: '',
}

// 延时函数
const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))

// 每隔一秒获取音频时间
function* currentTime({call, put}: EffectsCommandMap) {
    while(true) {
        yield call(delay, 1000)
        const currentTime = yield call(getCurrentTime)
        yield put({
            type: 'setState',
            payload: {
                currentTime
            }
        })
    }
}

const playerModel: PlayerModel = {
    namespace: 'player',
    state: initialState,
    reducers: {
        setState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        }
    },
    effects: {
        *fetchPlayer({payload}, {call, put, select}) {
            // 先停止播放
            yield call(stop)
            const {data} = yield call(axios.get, PLAYER_URL, {params: {id: payload.id}})
            
            // 初始化音频
            yield call(initPlay, data.soundUrl)
            // 播放音频
            yield put({
                type: 'play'
            })
            // 保存数据
            yield put({
                type: 'setState',
                payload: {
                    // 由于是mock数据这里使用参数的id
                    id: payload.id,
                    soundUrl: data.soundUrl,
                    duration: getDuration()
                }
            })
            // 保存播放记录
            const {id, title, thumbnailUrl, currentTime} = yield select(({player}: RootState) => player)
            savePlayer({id, title, thumbnailUrl, currentTime, duration: getDuration()})
        },
        // 播放上一首
        *prev({payload}, {call, put, select}) {
            const {id, sounds}: PlayerState = yield select(({player}: RootState) => player)
            const index = sounds.findIndex(item => item.id === id)
            const currentIndex = index - 1
            const currentItem = sounds[currentIndex]
            const prevItem = sounds[currentIndex - 1]
            // 更新数据
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                    id: currentItem.id,
                    title: currentItem.title,
                    prevId: prevItem ? prevItem.id : '',
                    nextId: index,
                }
            })
            // 播放
            yield put({
                type: 'fetchPlayer',
                payload: {
                    id: currentItem.id,
                }
            })
        },
        // 播放下一首
        *next({payload}, {call, put, select}) {
            const {id, sounds}: PlayerState = yield select(({player}: RootState) => player)
            const index = sounds.findIndex(item => item.id === id)
            const currentIndex = index + 1
            const currentItem = sounds[currentIndex]
            const nextItem = sounds[currentIndex + 1]
            // 更新数据
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                    id: currentItem.id,
                    title: currentItem.title,
                    nextId: nextItem ? nextItem.id : '',
                    prevId: index,
                }
            })
            // 播放
            yield put({
                type: 'fetchPlayer',
                payload: {
                    id: currentItem.id,
                }
            })
        },
        // 播放音频
        *play({payload}, {call, put}) {
            // 修改播放状态
            yield put({
                type: 'setState',
                payload: {
                    playState: 'playing',
                }
            })
            yield call(play)
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                }
            })
        },
        // 暂停音频
        *pause({payload}, {call, put, select}) {
            yield call(pause)
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                }
            })
            // 更新播放记录
            const {id, currentTime}: PlayerState = yield select(({player}: RootState) => player)
            savePlayer({id, currentTime})
        },
        // 监听播放时间
        // 参数是生成器函数
        currentTimeWatcher: [
            function*(sagaEffects) {
                const {call, race, take} = sagaEffects
                // 启动轮询
                while(true) {
                    // 监听play
                    yield take('play')
                    yield race([call(currentTime, sagaEffects), take('pause')])
                }
            },
            {
                // 监听，在dva加载时执行参数1的函数
                type: 'watcher'
            }
        ]
    }
}

export default playerModel