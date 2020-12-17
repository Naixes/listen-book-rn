import storage, {load} from "@/config/storage";
import axios from "axios";
import { Effect, Model, SubscriptionsMapObject } from "dva-core-ts";
import {Reducer} from 'redux'
import { RootState } from ".";

export interface ICategory {
    id: string;
    name: string;
    classify?: string;
}

interface CategoryModelState {
    isEdit: boolean;
    myCategorys: ICategory[];
    categorys: ICategory[];
}

interface CategoryModel extends Model {
    namespace: 'category';
    state: CategoryModelState;
    effects: {
        loadData: Effect;
        toggle: Effect;
    };
    reducers: {
        setState: Reducer<CategoryModelState>;
    };
    // 订阅数据源根据条件调用不同的 subscription
    subscriptions: SubscriptionsMapObject;
}

const initialState = {
    isEdit: false,
    // 默认推荐和vip
    myCategorys: [
        {
            id: 'home',
            name: '推荐',
        },
        {
            id: 'vip',
            name: 'Vip',
        }
    ],
    categorys: []
}

const CATEGROY_URL = '/mock/11/category'

const categoryModel: CategoryModel = {
    namespace: 'category',
    state: initialState,
    effects: {
        *loadData(_, {call, put}) {
            // 从 storage 中获取数据
            const myCategorys = yield call(load, {key: 'myCategorys'})
            const categorys = yield call(load, {key: 'categorys'})
            // 保存数据到 state
            if(myCategorys) {
                yield put({
                    type: 'setState',
                    payload: {
                        myCategorys,
                        categorys
                    }
                })
            }else {
                yield put({
                    type: 'setState',
                    payload: {
                        categorys
                    }
                })
            }
        },
        *toggle({payload}, {put, select}) {
            const category = yield select(({category}: RootState) => category)
            // 状态切换，保存数据到 dva
            yield put({
                type: 'setState',
                payload: {
                    isEdit: !category.isEdit,
                    myCategorys: payload.myCategorys,
                }
            })
            // 保存数据到本地 storage
            if(category.isEdit) {
                storage.save({
                    key: 'myCategorys',
                    data: payload.myCategorys,
                })
            }
        }
    },
    reducers: {
        setState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        }
    },
    // dva加载完说有数据之后就会执行 subscriptions 中的函数
    subscriptions: {
        setup({dispatch}) {
            dispatch({
                type: 'loadData'
            })
        },
        asyncStorage() {
            // 也可以放在 subscriptions 外面
            // 获取 categorys 数据
            storage.sync.categorys = async () => {
                const data = await axios.get(CATEGROY_URL)
                return data.data
            }
            // myCategorys 只保存在本地
            storage.sync.myCategorys = () => {
                return null
            }
        }
    }
}

export default categoryModel