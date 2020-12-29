import axios from "axios";
import { Effect, Model } from "dva-core-ts";
import { Reducer } from "redux";

const ALBUM_URL = '/mock/11/album/list'

export interface IProgram {
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
    },
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
    reducers: {
        setState(state = initialState, {payload}) {
            console.log('payload', payload);
            
            return {
                ...state,
                ...payload,
            }
        }
    },
    effects: {
        *fetchAlbum({payload}, {call, put}) {
            console.log('fetchAlbum');
            // const {data} = yield call(axios.get, ALBUM_URL)
            // console.log('fetchAlbum', data);

            yield put({
                type: 'setState',
                payload: {"id":"BeD8cD2d-85c8-cEe1-847C-f535bfcAec1f","title":"业易它近","summary":"委华三门角业委机半增入维她。进调火来各当查改听变才车。接区利气基龙象学期解合华价总三样采。精越事样他什天权国九压分使属。道第程则压由上到统听将你机为长务。","thumbnailUrl":"http://dummyimage.com/128x128","author":{"name":"萧军","avatar":"http://dummyimage.com/32x32/f2b579/9279f2.png&text=邵伟"},"introduction":"料取要主始半容阶至没张物律能。业叫作件始料千市新确离型向青为教构。","list":[{"id":"287A5cfF-4281-E98A-00Fa-E28DEFAEBc5A","title":"Fcani Iclsixszx Yjefgigsq Jxkytpybn Psgc Ndlzhxpygf","playCount":8560,"duration":"18:05","date":"2013-12-03"}]}
            })
            console.log('setState');
        }
    },
}

export default albumModel