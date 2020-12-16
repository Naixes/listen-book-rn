import AsyncStorage from '@react-native-community/async-storage'
import Storage, { LoadParams } from 'react-native-storage'

const storage = new Storage({
    // 最大容量，超出后会删除，循环使用
    size: 1000,
    // 数据存储引擎，不设置会存储在内存中，浏览器则传 入window.localstorage
    storageBackend: AsyncStorage,
    // 传 null 永远不会过期
    defaultExpires: 1000 * 3600 * 24 * 7,
    enableCache: true,
    // 获取数据时 storage 中没有或过期时会调用 sync 中的对应方法返回最新数据
    // 可以在 model 中添加
    sync: {}
})

// 从 storage 中获取数据
// 重新封装是为了保持 this 指向
export const load = (params: LoadParams) => {
    return storage.load(params)
}

export default storage