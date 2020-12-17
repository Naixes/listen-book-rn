import { create, Model } from "dva-core-ts";
import createLoading from 'dva-loading-ts'

import models from '@/models/index'
import modelExtend from "dva-model-extend";
import homeModel from "@/models/home";

// 创建实例
const app = create()
// 加载model对象
models.forEach(model => {
    app.model(model)
})
app.use(createLoading())
// 启动dva
app.start()
// 导出dva数据
export default app._store

// 每循环一次都会创建，所以使用缓存保证每个model只有一个
interface Cached {
    [key: string]: boolean
}
const cached: Cached = {
    home: true
}
const registerModel = (model: Model) => {
    if(!cached[model.namespace]) {
        // 将 model 插入 dva
        app.model(model)
        cached[model.namespace] = true
    }
}
export const createHomeModel = (namespace: string) => {
    const model = modelExtend(homeModel, {namespace})
    registerModel(model)
}