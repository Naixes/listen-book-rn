import {DvaLoadingState} from 'dva-loading-ts'

import home from '@/models/home'

const models = [home]

// 导出State类型
export type RootState = {
    home: typeof home.state,
    loading: DvaLoadingState
}

export default models