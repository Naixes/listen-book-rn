import {DvaLoadingState} from 'dva-loading-ts'

import home from '@/models/home'
import category from '@/models/category'
import album from './album'
import player from './player'

const models = [home, category, album, player]

// 导出State类型
export type RootState = {
    home: typeof home.state,
    category: typeof category.state,
    album: typeof album.state,
    player: typeof player.state,
    loading: DvaLoadingState,
} & {
    [key: string]: typeof home.state,
}

export default models