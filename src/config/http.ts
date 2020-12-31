import axios from 'axios'
import Config from 'react-native-config'

axios.defaults.baseURL = Config.API_URL

// 请求拦截器
axios.interceptors.request.use((config) => {
    return config
}, (err) => {
    return Promise.reject(err)
})

// 响应拦截器
axios.interceptors.response.use((response) => {
    return response.data
}, (err) => {
    return Promise.reject(err)
})

