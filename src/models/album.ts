import axios from "axios";
import { Effect, Model } from "dva-core-ts";
import { Reducer } from "redux";

const ALBUM_URL = '/mock/11/album/list'

interface IProgram {
    id: string;
    title: string;
    playCount: number;
    duration: string;
    date: string;
}

export interface IAuthor {
    name: string;
    avatar: string;
}

export interface AlbumModelState {
    id: string;
    title: string;
    summary: string;
    thumbnailUrl: string;
    introduction: string;
    author: IAuthor;
    list: IProgram[];
}

export interface AlbumModel extends Model {
    namespace: 'album',
    state: AlbumModelState,
    effects: {
        fetchAlbum: Effect
    },
    reducers: {
        setState: Reducer<AlbumModelState>
    }
}

const initialState: AlbumModelState = {
    id: '',
    title: '',
    summary: '',
    thumbnailUrl: '',
    introduction: '',
    author: {
        name: '',
        avatar: '',
    },
    list: [],
}

const albumModel: AlbumModel = {
    namespace: 'album',
    state: initialState,
    effects: {
        *fetchAlbum({payload}, {call, put}) {
            const {data} = yield call(axios.get, ALBUM_URL)
            yield put({
                type: 'setState',
                payload: data
            })
        }
    },
    reducers: {
        setState(state = initialState, {payload}) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}

export default albumModel