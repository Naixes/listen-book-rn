import {DvaLoadingState} from 'dva-loading-ts'

import home from '@/models/home'
import category from '@/models/category'

const models = [home, category]

// 导出State类型
export type RootState = {
    home: typeof home.state,
    category: typeof category.state,
    loading: DvaLoadingState,
} & {
    [key: string]: typeof home.state,
}

export default models