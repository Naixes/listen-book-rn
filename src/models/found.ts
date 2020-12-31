import { Model, Effect } from "dva-core-ts";
import axios from 'axios';

const FOUND_URL = '/mock/11/found/list'

export interface IFound {
    id: string;
    title: string;
    videoUrl: string;
}

interface FoundModel extends Model {
    namespace: 'found',
    effects: {
        fetchList: Effect
    }
}

const foundModel: FoundModel = {
    namespace: 'found',
    effects: {
        *fetchList({callback}, {call}) {
            const {data} = yield call(axios.get, FOUND_URL)
            if(typeof callback === 'function') {
                callback(data)
            }
        }
    }
}

export default foundModel