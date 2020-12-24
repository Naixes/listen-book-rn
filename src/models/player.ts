import { initPlay, pause, play, getCurrentTime, getDuration } from "@/config/sound";
import axios from "axios";
import { Effect, EffectsCommandMap, EffectWithType, Model } from "dva-core-ts";
import { Reducer } from "redux";

const PLAYER_URL = '/mock/11/player'

export interface PlayerState {
    id: string;
    soundUrl: string;
    playState: string;
    currentTime: number;
    duration: number;
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
        currentTimeWatcher: EffectWithType
    },
    reducers: {
        setState: Reducer<PlayerState>
    }
}

const initialState: PlayerState = {
    id: '',
    soundUrl: '',
    playState: '',
    currentTime: 0,
    duration: 0,
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
        *fetchPlayer({payload}, {call, put}) {
            const {data} = yield call(axios.get, PLAYER_URL, {params: {id: payload.id}})
            console.log('getDuration', getDuration());
            
            yield put({
                type: 'setState',
                payload: {
                    id: data.id,
                    soundUrl: data.soundUrl,
                    duration: getDuration()
                }
            })
            // 初始化音频
            yield call(initPlay, data.soundUrl)
            // 播放音频
            yield put({
                type: 'play'
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
                    playState: 'played',
                }
            })
        },
        // 暂停音频
        *pause({payload}, {call, put}) {
            yield call(pause)
            yield put({
                type: 'setState',
                payload: {
                    playState: 'played',
                }
            })
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