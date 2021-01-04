windows环境只能开发android版

属于多页面应用

## 开发日志

### 初始化项目

`npx react-native init listen-book-rn --template react-native-template-typescript `

> 初始化报错
>
> 重新安装来自"react-native-community"的`cli`库 :`npm i -g @react-native-community/cli`

#### 多环境配置

区分开发，测试，线上环境

##### `react-native-config`库

安装

连接`ios`（android已经实现了自动连接）：`ios`目录下`pod install`

在 `android/app/build.gradle`中添加代码

```
// 2nd line, add a new apply:
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

配置`.env`文件

##### 配置绝对路径

`babel-plugin-module-resolver`

配置`babel.config.js`

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // 配置绝对路径
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@/utils': './src/utils',
          '@/pages': './src/pages',
          '@/navigator': './src/navigator',
          '@/models': './src/models',
          '@/config': './src/config',
          '@/components': './src/components',
          '@/assets': './src/assets',
        }
      }
    ]
  ]
};

```

配置`tsconfig.json`

```json
...
"baseUrl": "./src",                       /* Base directory to resolve non-absolute module names. */
"paths": {
    "@/assets/*": ["assets/*"],
    "@/components/*": ["components/*"],
    "@/config/*": ["config/*"],
    "@/models/*": ["models/*"],
    "@/navigator/*": ["navigator/*"],
    "@/pages/*": ["pages/*"],
    "@/utils/*": ["utils/*"]
},
...
```

> 未找到文件报错：`yarn start --reset-cache`

#### 接口文档

接口管理工具

`Yapi`：依赖`mongodb`，`ndoejs`

> https://www.mongodb.com/try/download/community

1. 安装：`npm install -g yapi-cli --registry https://registry.npm.taobao.org`

2. `yapi server`

3. 在浏览器打开 http://0.0.0.0:9090 访问。非本地服务器，请将 0.0.0.0 替换
   成指定的域名或ip

4. 初始化管理员账号成功,账号名："admin@admin.com"，密码："ymfe.org"。部署成功，请切换到部署目录，输入： "node vendors/server/app.js" 指令启动服务器, 然后在浏览器打开 http://127.0.0.1:3001 访问

mockjs数据规则示例：http://mockjs.com/examples.html

### 导航器

用来管理页面，react-navigation

#### 安装

安装核心包：`yarn add @react-navigation/native`

安装依赖库：`yarn add react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view`

> react-native-reanimated：组件式动画库
>
> react-native-gesture-handler：手势库
>
> react-native-screens：安卓和`ios`原生组件
>
> react-native-safe-area-context：保证组件在不同手机中都显示在安全区域
>
> @react-native-community/masked-view：堆栈式导航器依赖库

链接`ios`

`react-native-gesture-handler`需要重写`MainActivity.java`文件，参考https://docs.swmansion.com/react-native-gesture-handler/docs/

```java
package com.swmansion.gesturehandler.react.example;

import com.facebook.react.ReactActivity;
+ import com.facebook.react.ReactActivityDelegate;
+ import com.facebook.react.ReactRootView;
+ import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;
public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Example";
  }
+  @Override
+  protected ReactActivityDelegate createReactActivityDelegate() {
+    return new ReactActivityDelegate(this, getMainComponentName()) {
+      @Override
+      protected ReactRootView createRootView() {
+       return new RNGestureHandlerEnabledRootView(MainActivity.this);
+      }
+    };
+  }
}
```

`index.js`文件增加

```js
// 解决线上环境闪退
import 'react-native-gesture-handler';
```

#### 堆栈式导航器

安装`yarn add @react-navigation/stack`

> 安装报错：`An unexpected error occurred: "https://raw.githubusercontent.com/react-navigation/stack/3389391b24ff58957c33b41c102e5bf9afafa991/package.json: getaddrinfo ENOENT raw.githubusercontent.com raw.githubusercontent.com:443"`

找不到 `raw.githubusercontent.com` 的服务器 `IP` 地址

上[https://www.ipaddress.com](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.ipaddress.com)查一下[raw.githubusercontent.com](https://links.jianshu.com/go?to=http%3A%2F%2Fraw.githubusercontent.com)的ipv4地址，比如我现在查到的是199.232.68.133。

使用管理员权限打开`C:/Windows/System32/hosts`文件，添加一行

在`C:\Windows\System32\drivers\etc`路径下找到hosts文件

添加 以下内容并保存即可恢复

`199.232.96.133 raw.githubusercontent.com`

##### 报错

> error: ReferenceError: SHA-1 for file C:\Users\Frontend\AppData\Roaming\npm\node_modules\@react-native-community\cli\node_modules\metro\src\lib\polyfills\require.js (C:\Users\Frontend\AppData\Roaming\npm\node_modules\@react-native-community\cli\node_modules\metro\src\lib\polyfills\require.js) is not computed

由于使用旧的本机版本配置旧项目，因此引发了此问题。 然后尝试使用新Project运行最新的react-native版本。

解决：npm i -g react-native-cli --force

> Error while updating property 'nativeBackgroundAndroid' of a view managed by: RCTView

安卓4.x的版本Button组件会报错

##### 使用

```tsx
// navigator/index.tsx
import { NavigationContainer } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator, HeaderStyleInterpolators, StackNavigationProp } from '@react-navigation/stack'
import React from 'react'

import Home from '@/pages/Home'
import Detail from '@/pages/Detail'
import { Platform, StyleSheet } from 'react-native'

// 不能使用interface，缺少索引签名
export type RootStackParamList = {
    Home: undefined;
    Detail: {
        id: number
    };
}

// 定义props类型
export type RootStackProps = StackNavigationProp<RootStackParamList>

// Record是一个很好用的工具类型。他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
// 堆栈式导航器
let Stack = createStackNavigator<RootStackParamList>()
// {
//     Navigator,
//     Screen
// }

class Navigator extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    // 标题模式
                    // float(ios默认，共用一个标题栏)/screen(android默认)
                    headerMode="screen"
                    screenOptions={{
                        headerTitleAlign: "center",
                        // 标题动画
                        headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
                        // 内容动画
                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                        // 打开手势系统，安卓默认关闭
                        gestureEnabled: true,
                        // 设置手势方向
                        gestureDirection: "horizontal",
                        // 统一标题样式
                        headerStyle: {
                            ...Platform.select({
                                android: {
                                    // 阴影
                                    elevation: 0,
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                },
                                ios: {}
                            })
                        }
                    }}
                >
                    {/* options和screenOptions内容一样，options优先级更高 */}
                    <Stack.Screen options={{headerTitle: "首页"}} name="Home" component={Home} />
                    <Stack.Screen options={{headerTitle: "详情"}} name="Detail" component={Detail} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default Navigator

// Home.tsx
import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { RootStackProps } from '../navigator'

interface IProps {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

class Home extends React.Component<IProps> {
    pressHandler = () => {
        const {navigation} = this.props
        navigation.navigate("Detail", {id: 1})
    }
    render() {
        return (
            <View>
                <Text>Home</Text>
                <TouchableOpacity onPress={this.pressHandler}>
                    <Text>点击跳转到详情</Text>
                </TouchableOpacity>
                {/* 安卓4.x的版本Button可能会报错 */}
                {/* <Button title="点击跳转到详情" onPress={this.pressHandler}></Button> */}
            </View>
        )
    }
}

export default Home

// Detail.tsx
import { RouteProp } from '@react-navigation/native'
import React from 'react'
import { View, Text } from 'react-native'
import { RootStackParamList } from '../navigator'

interface IProps {
    // navigation传过来的参数，可获取路由信息
    route: RouteProp<RootStackParamList, 'Detail'>
}

class Detail extends React.Component<IProps> {
    render() {
        const {route} = this.props

        return (
            <View>
                <Text>Detail</Text>
                <Text>{route.params.id}</Text>
            </View>
        )
    }
}

export default Detail
```

#### 标签导航器

安装`yarn add @react-navigation/bottom-tabs`

##### 导航嵌套

堆栈式导航器嵌套标签导航器

获取当前路由标题动态修改headerTitle

```tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
// import { NavigationContainer } from '@react-navigation/native'
import Home from '@/pages/Home'
import Listen from '@/pages/Listen'
import Found from '@/pages/Found'
import Account from '@/pages/Account'
import { RootStackParamList, RootStackProps } from '.'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native'

type Route = RouteProp<RootStackParamList, 'BottomTab'>;

export interface IProps {
    navigation: RootStackProps,
    route: Route
}

export type BottomTabParamList = {
    Home: undefined;
    Listen: undefined;
    Found: undefined;
    Account: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>()

function getHeaderTile(route: Route) {
    // 获取当前路由名称
    const name = getFocusedRouteNameFromRoute(route)
    const routeName = name ? name : route.params ? route.params.screen : 'Home'
    let Titles = new Map([
        ['Home', '首页'],
        ['Listen', '我听'],
        ['Found', '发现'],
        ['Account', '我的'],
    ]);
    return Titles.get(routeName as string)
}

class BottomTabs extends React.Component<IProps> {
    componentDidUpdate() {
        const {navigation, route} = this.props
        navigation.setOptions({
            headerTitle: getHeaderTile(route)
        })
    }

    render()  {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: "#f86442"
            }}>
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: "首页"
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Listen"
                    component={Listen}
                    options={{
                        tabBarLabel: "我听"
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Found"
                    component={Found}
                    options={{
                        tabBarLabel: "发现"
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Account"
                    component={Account}
                    options={{
                        tabBarLabel: "我的"
                    }}
                ></Tab.Screen>
            </Tab.Navigator>
        )
    }
}

export default BottomTabs
```

### 状态管理

redux：只提供一个仓库，并且不能直接操作，rematch和dva是对redux的封装，redux-saga是redux的中间件，一种异步解决方案，类似的还有redux-thunk，redux-promise

mobx：多个仓库，监听这些仓库的数据，可以对数据进行操作

#### DVA

dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。

##### 集成DVA

安装dva-core-ts，react-redux

`yarn add dva-core-ts react-redux @types/react-redux`

```ts
// dva.ts
import { create } from "dva-core-ts";

import models from '@/models/index'

// 创建实例
const app = create()
// 加载model对象
models.forEach(model => {
    app.model(model)
})
// 启动dva
app.start()
// 导出dva数据
export default app._store

// models/home.ts
import { Effect, Model } from "dva-core-ts"
import { Reducer } from "redux"

interface HomeState {
    num: number
}

interface HomeModel extends Model {
    namespace: 'home';
    state: HomeState;
    reducers: {
        add: Reducer<HomeState>
    };
    // 异步
    // 所有的函数都是生成器函数
    effects: {
        asyncAdd: Effect
    };
}

const initialState = {
    num: 0
}

const delay = (timeout: number) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}

const homeModel: HomeModel = {
    namespace: 'home',
    state: {
        num: 0
    },
    reducers: {
        add(state = initialState, {payload}) {
            return {
                ...state,
                num: state.num + payload.num
            }
        }
    },
    effects: {
        *asyncAdd({payload}, {call, put}) {
            yield call(delay, 1000)
            // 和dispatch作用一样
            yield put({
                type: 'add',
                payload
            })
        }
    }
}

export default homeModel

// models/index.ts
import home from './home'

const models = [home]
// 导出State类型
export type RootState = {
    home: typeof home.state
}

export default models

// index.tsx
import React from 'react'
import { Provider } from 'react-redux'

import Navigator from '@/navigator/index'
import store from '@/config/dva'

export default class extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Navigator></Navigator>
            </Provider>
        )
    }
}
```

##### 使用dva

状态映射

异步操作

```tsx
import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'

const mapStateToProps = ({home}: RootState) => ({
    num: home.num
})

// 状态映射
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

// 继承 model state
interface IProps extends ModelState {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}

class Home extends React.Component<IProps> {
    pressAddHandler = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'home/add',
            payload: {
                num: 3
            }
        })
    }
    // 异步操作
    pressAsyncAddHandler = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'home/asyncAdd',
            payload: {
                num: 3
            }
        })
    }
    render() {
        const num = this.props.num
        return (
            <View>
                <Text>Home{num}</Text>
                <TouchableOpacity onPress={this.pressAddHandler}>
                    <Text>点击+3</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pressAsyncAddHandler}>
                    <Text>点击async+3</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default connector(Home)
```

##### 插件-dva-loading



`yarn add dva-loading-ts`

使用

```tsx
// dva.ts
// start前执行
app.use(createLoading())

// index.ts
...
// 导出State类型
export type RootState = {
    home: typeof home.state,
    loading: DvaLoadingState
}

// pages/Home.tsx
import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'

const mapStateToProps = ({home, loading}: RootState) => ({
    num: home.num,
    loading: loading.effects['home/asyncAdd']
})
...

class Home extends React.Component<IProps> {
    ...
    render() {
        const {num, loading} = this.props
        return (
            <View>
                <Text>Home{num}</Text>
                <Text>{loading? '正在努力计算中' : ''}</Text>
                <TouchableOpacity onPress={this.pressAsyncAddHandler}>
                    <Text>点击async+3</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default connector(Home)
```

### 首页

#### 需求分析

底部导航栏图标

头部标签，包含手势功能

头部导航栏背景动态渐变

获取数据显示轮播图

猜你喜欢组件

列表显示

下拉时头部颜色变化

#### 导航栏图标

`react-native-vector-icons`库，字体图标，缺点：会完整打包

`react-native-iconfont-cli`库，命令行工具，把iconfont.cn图标转换为RN组件，不依赖字体，多色彩，热更新（可自定义使用图标比较灵活，本项目使用）

##### 使用

安装依赖：

`yarn add react-native-svg`（ios需要连接）

`yarn add react-native-iconfont-cli -D`

配置：

`npx iconfont-init`：创建iconfont.json文件

修改配置文件链接和其他配置

```json
{
    "symbol_url": "http://at.alicdn.com/t/font_1669816_zcvnh1deqnm.js",
    "use_typescript": true,
    "save_dir": "./src/assets/iconfont",
    // 通用的前缀
    "trim_icon_prefix": "",
    "default_icon_size": 18,
    // 本地 svg 的路径, 配置此项后在路径中添加 svg 文件即可。支持渐变图标
    "local_svgs": "./localSvgs"
}

```

生成组件：

`npx iconfont-rn`

使用组件：

```tsx
import Icon from '@/assets/iconfont/index'
...
class BottomTabs extends React.Component<IProps> {
	...
    render()  {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: "#f86442"
            }}>
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: "首页",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-shouye" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                ...
            </Tab.Navigator>
        )
    }
}

export default BottomTabs
```

#### 顶部标签导航器

`yarn add @react-navigation/material-top-tabs react-native-tab-view`

```tsx
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Listen from '@/pages/Listen'
import Found from '@/pages/Found'
import Account from '@/pages/Account'
import { RootStackParamList, RootStackProps } from '.'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native'
import Icon from '@/assets/iconfont/index'
import HomeTabs from '@/navigator/HomeTabs'

type Route = RouteProp<RootStackParamList, 'BottomTab'>;

export interface IProps {
    navigation: RootStackProps,
    route: Route
}

export type BottomTabParamList = {
    HomeTabs: undefined;
    Listen: undefined;
    Found: undefined;
    Account: undefined;
}

const Tab = createBottomTabNavigator<BottomTabParamList>()

function getHeaderTile(route: Route) {
    // 获取当前路由名称
    const name = getFocusedRouteNameFromRoute(route)
    const routeName = name ? name : route.params ? route.params.screen : 'Home'
    let Titles = new Map([
        ['HomeTabs', '首页'],
        ['Listen', '我听'],
        ['Found', '发现'],
        ['Account', '我的'],
    ]);
    console.log(routeName);
    
    return Titles.get(routeName as string)
}

class BottomTabs extends React.Component<IProps> {
    componentDidUpdate() {
        const {navigation, route} = this.props
        navigation.setOptions({
            headerTitle: getHeaderTile(route)
        })
    }

    render()  {
        return (
            <Tab.Navigator tabBarOptions={{
                activeTintColor: "#f86442"
            }}>
                {/* 嵌套首页的顶部导航器 */}
                <Tab.Screen
                    name="HomeTabs"
                    component={HomeTabs}
                    options={{
                        tabBarLabel: "首页",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-shouye" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Listen"
                    component={Listen}
                    options={{
                        tabBarLabel: "我听",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-shoucang" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Found"
                    component={Found}
                    options={{
                        tabBarLabel: "发现",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-faxian" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
                <Tab.Screen
                    name="Account"
                    component={Account}
                    options={{
                        tabBarLabel: "我的",
                        tabBarIcon: ({color, size}) => (
                            <Icon name="icon-user" color={color} size={size} />
                        )
                    }}
                ></Tab.Screen>
            </Tab.Navigator>
        )
    }
}

export default BottomTabs
```

#### 轮播图

安装依赖

`yarn add react-native-snap-carousel @types/react-native-snap-carousel`

` yarn add -D @types/react-native-snap-carousel`

获取接口数据：使用axios`yarn add axios`

```tsx
// pages/Home/Carousel.tsx
import React from 'react'
import SnapCarousel, { ParallaxImage, AdditionalParallaxProps, Pagination } from 'react-native-snap-carousel'
import {StyleSheet, View } from 'react-native'

import {viewportWidth, widFromPer, heiFromPer} from '@/utils/index'
import {ICarousel} from '@/models/home'

interface IProps {
    data: ICarousel[]
}

const itemWidth = widFromPer(90) + widFromPer(3) * 2
const itemHeight = heiFromPer(26)

class Carousel extends React.Component<IProps> {
    state = {
        activeIndex: 0
    }

    snapHandler = (index: number) => {
        this.setState({
            activeIndex: index
        })
    }

    // get表示是一个属性
    get pagination() {
        const {activeIndex} = this.state
        const {data} = this.props
        return (
            <View style={styles.paginationWrapper}>
                <Pagination
                    containerStyle={styles.paginationContainer}
                    dotContainerStyle={styles.dotContainer}
                    dotStyle={styles.dotStyle}
                    dotsLength={data.length}
                    activeDotIndex={activeIndex}
                    inactiveDotScale={0.7}
                    inactiveDotOpacity={0.6}
                ></Pagination>
            </View>
        )
    }

    // item为data中的每一项
    // parallexProps：视差配置
    renderItem = ({item}: {item: ICarousel}, parallaxProps?: AdditionalParallaxProps) => {
        return (
            <ParallaxImage
                source={{uri: item.image}}
                containerStyle={styles.imageContainer}
                style={styles.image}
                // 视差速度默认0.3
                parallaxFactor={0.8}
                {...parallaxProps}
                // 显示加载动画
                showSpinner
                spinnerColor="rgba(0,0,0,0.25)"
            />
        )
    }

    render() {
        const {data} = this.props
        return (
            <View>
                <SnapCarousel
                    data={data}
                    renderItem={this.renderItem}
                    sliderWidth={viewportWidth}
                    itemWidth={itemWidth}
                    onSnapToItem={this.snapHandler}
                    hasParallaxImages
                    loop
                    autoplay
                ></SnapCarousel>
                {this.pagination}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: itemWidth,
        height: itemHeight,
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    paginationWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    paginationContainer: {
        position: "absolute",
        top: -18,
        // backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    dotContainer: {
        marginHorizontal: 4,
    },
    dotStyle: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgb(255, 255, 255)',
    }
})

export default Carousel

// models/home.ts
import { Effect, Model } from "dva-core-ts"
import { Reducer } from "redux"
import axios from 'axios'

const CAROUSEL_URL = '/mock/11/carousel'
export interface ICarousel {
    id: string;
    image: string;
    color: [string, string]
}
interface HomeState {
    carousels: ICarousel[]
}
interface HomeModel extends Model {
    namespace: 'home';
    state: HomeState;
    reducers: {
        setState: Reducer<HomeState>
    };
    // 所有的函数都是生成器函数
    effects: {
        fetchCarousels: Effect
    };
}
const initialState: HomeState = {
    carousels: []
}
const homeModel: HomeModel = {
    namespace: 'home',
    state: {
        carousels: []
    },
    reducers: {
        setState(state = initialState, {payload}) {
            return {
                ...state,
                ...payload
            }
        }
    },
    effects: {
        *fetchCarousels({payload}, {call, put}) {
            // 解构出data
            const {data} = yield call(axios.get, CAROUSEL_URL)
            // 和dispatch作用一样
            yield put({
                type: 'setState',
                payload: {
                    carousels: data
                }
            })
        }
    }
}

export default homeModel

// pages/Home/index
import React from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'
import Carousel from '@/pages/Home/Carousel'

const mapStateToProps = ({home, loading}: RootState) => ({
    carousels: home.carousels,
    loading: loading.effects['home/fetchCarousels']
})
// 状态映射
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>
// 继承 model state
interface IProps extends ModelState {
    // navigation传过来的参数，可进行路由跳转
    navigation: RootStackProps
}
class Home extends React.Component<IProps> {
    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchCarousels'
        })
    }
    render() {
        const {carousels} = this.props
        
        return (
            <View>
                <Carousel data={carousels}/>
            </View>
        )
    }
}
export default connector(Home)
```

> 报错uncaught at _callee3 at _callee3

原因：yapi服务无法访问导致，修改为本地ip即可

#### 猜你喜欢

封装Touchable组件

滚动视图

#### 首页列表

> 在ScrollView中使用FlatList会有警告

```tsx
import React from 'react'
import { FlatList, ListRenderItemInfo, ScrollView, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import { RootState } from '@/models/index'
import { RootStackProps } from '@/navigator/index'
import Carousel from './Carousel'
import Guess from './Guess'
import ChannelItem from './ChannelItem'
import { IChannel } from '@/models/home'

...

class Home extends React.Component<IProps> {
    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchCarousels'
        })
        dispatch({
            type: 'home/fetchChannel'
        })
    }
    renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
        return (
            <ChannelItem item={item}></ChannelItem>
        )
    }
    get header() {
        const {carousels} = this.props
        return (
            <View>
                <Carousel data={carousels}/>
                <Guess />
            </View>
        )
    }
    render() {
        const {channels} = this.props
        return (
            // ScrollView 的子组件不能有 FlatList，使用ListHeaderComponent 属性即可
            <FlatList  ListHeaderComponent={this.header} data={channels} renderItem={this.renderItem}/>
        )
    }
}

export default connector(Home)
```

安卓端不支持阴影效果，支持投影效果（比阴影更明显，只有一个属性，会改变层级）

```css
item: {
    ...
    // 阴影效果
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowColor: '#ccc',
    // 投影效果
    elevation: 80,
},
```

##### 优化

在父组件处理业务逻辑，保持子组件纯粹

父组件状态改变时，子组件都会被重新渲染，可以使用PureComponents进行自动判断（浅对比）优化子组件，因此尽量不要直接给组件传递字面量属性或者匿名函数，否则使用PureComponents没有意义。函数式组件则使用memo进行优化

FlatList的keyExtractor

```tsx
...
class Home extends React.Component<IProps> {
    ...
    // 在父组件处理业务逻辑
    onPress = (data: IChannel) => {
        console.log(data);
    }
    renderItem = ({item}: ListRenderItemInfo<IChannel>) => {
        return (
            // 不要在这里使用匿名函数
            <ChannelItem onPress={this.onPress} item={item}></ChannelItem>
        )
    }
    ...
    keyExtractor = (item: IChannel) => {
        return item.id
    }
    render() {
        const {channels} = this.props
        return (
            // ScrollView 的子组件不能有 FlatList，使用ListHeaderComponent 属性即可
            <FlatList
                ListHeaderComponent={this.header}
                data={channels}
                renderItem={this.renderItem}
                // keyExtractor生成不重复的key，减少重新渲染，不指定时默认使用data的key或下标
                keyExtractor={this.keyExtractor}
            />
        )
    }
}

export default connector(Home)
```

##### 上拉下拉

```tsx
...
const mapStateToProps = ({home, loading}: RootState) => ({
    carousels: home.carousels,
    channels: home.channels,
    hasMore: home.pagination.hasMore,
    loading: loading.effects['home/fetchChannel']
})
...
class Home extends React.Component<IProps, IState> {
    state = {
        refreshing: false
    }
    ...
    // 加载提示
    get footer() {
        const {loading, hasMore, channels} = this.props
        if(!hasMore) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>---我是有底线的---</Text>
                </View>
            )
        }
        if(loading && hasMore && channels.length > 0) {
            return (
                <View style={styles.container}>
                    <Text style={styles.text}>正在加载中...</Text>
                </View>
            )
        }
    }
    // 暂无数据
    get empty() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>暂无数据</Text>
            </View>
        )
    }
    // 加载更多
    onEndReached = () => {
        // 正在加载以及无更多数据时中断
        const {loading, hasMore} = this.props
        if(loading || !hasMore) return

        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchChannel',
            payload: {
                loadMore: true
            }
        })
    }
    // 下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        })
        const {dispatch} = this.props
        dispatch({
            type: 'home/fetchChannel',
            callback: () => {
                this.setState({
                    refreshing: false
                })
            }
        })
    }
    render() {
        const {channels} = this.props
        const {refreshing} = this.state
        return (
            // ScrollView 的子组件不能有 FlatList，使用ListHeaderComponent 属性即可
            <FlatList
                ListHeaderComponent={this.header}
                ListFooterComponent={this.footer}
                ListEmptyComponent={this.empty}
                ...
                // 下拉
                onRefresh={this.onRefresh}
                refreshing={refreshing}
                // 上拉
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.2}
            />
        )
    }
}

export default connector(Home)
```

model

```tsx
...
// 首页列表
const CHANNEL_URL = '/mock/11/channel'

...
export interface IChannel {
    id: string;
    title: string;
    image: string;
    remark: string;
    played: number;
    playing: number;
}

export interface IPagination {
    current: number;
    total: number;
    hasMore: boolean;
}

interface HomeState {
    carousels: ICarousel[],
    guess: IGuess[],
    channels: IChannel[],
    pagination: IPagination,
}

interface HomeModel extends Model {
    namespace: 'home';
    state: HomeState;
    reducers: {
        setState: Reducer<HomeState>
    };
    // 所有的函数都是生成器函数
    effects: {
        fetchCarousels: Effect
        fetchGuess: Effect
        fetchChannel: Effect
    };
}

const initialState: HomeState = {
    carousels: [],
    guess: [],
    channels: [],
    pagination: {
        current: 1,
        total: 0,
        hasMore: true,
    }
}

const homeModel: HomeModel = {
    ...
    effects: {
        ...
        *fetchChannel({callback, payload}, {call, put, select}) {
            const {channels, pagination} = yield select((state: RootState) => state.home)

            // 获取页码
            let page = 1
            if(payload && payload.loadMore) {
                page = pagination.current + 1
            }
            const {data} = yield call(axios.get, CHANNEL_URL, {
                params: {
                    page
                }
            })
            let newChannels = data.results

            // 加载更多时进行数据拼接
            if(payload && payload.loadMore) {
                newChannels = channels.concat(newChannels)
            }

            let newPagination = data.pagination
            
            // 和dispatch作用一样
            yield put({
                type: 'setState',
                payload: {
                    channels: newChannels,
                    pagination: {
                        current: newPagination.current,
                        total: newPagination.total,
                        hasMore: newChannels.length < newPagination.total
                    }
                }
            })
            if(typeof callback === 'function') {
                callback()
            }
        }
    }
}

export default homeModel
```

#### 自定义顶部标签

##### 顶部标签布局

首页隐藏标题栏

```tsx
// navigator/BottomTabs.tsx
...

function getHeaderTile(name: string) {
    let Titles = new Map([
        ['HomeTabs', '首页'],
        ['Listen', '我听'],
        ['Found', '发现'],
        ['Account', '我的'],
    ]);
    
    return Titles.get(name)
}

class BottomTabs extends React.Component<IProps> {
    componentDidMount() {
        this.setHeaderOptions()
    }
    componentDidUpdate() {
        this.setHeaderOptions()
    }

    // 设置头部标题栏
    setHeaderOptions = () => {
        const {navigation, route} = this.props
        // 首页时隐藏标题
        // 获取当前路由名称
        const name = getFocusedRouteNameFromRoute(route)
        const routeName = name ? name : route.params ? route.params.screen : 'HomeTabs'
        if(routeName === 'HomeTabs') {
            navigation.setOptions({
                headerTransparent: true,
                headerTitle: ''
            })
        }else {
            navigation.setOptions({
                headerTransparent: false,
                headerTitle: getHeaderTile(routeName as string)
            })
        }
    }

    render()  {
        ...
    }
}

export default BottomTabs
```

在原有顶部标签组件基础上进行修改

```tsx
// navigator/HomeTabs.tsx
import React from 'react'
import {createMaterialTopTabNavigator, MaterialTopTabBarProps} from '@react-navigation/material-top-tabs'

...

const Tab = createMaterialTopTabNavigator()

class HomeTabs extends React.Component {
    renderTabBar = (props: MaterialTopTabBarProps) => {
        // 在原有组件基础上进行修改
        return (
            <TopTabBarWrapper {...props}></TopTabBarWrapper>
        )
    }
    render() {
        return (
            <Tab.Navigator
                // 设置tab内容透明背景色
                sceneContainerStyle={styles.sceneContainer}
                // 自定义tabBar
                tabBar={this.renderTabBar}
                ...
            >
                <Tab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarLabel: "首页"
                    }}
                ></Tab.Screen>
            </Tab.Navigator>
        )
    }
}

const styles = StyleSheet.create({
    sceneContainer: {
        backgroundColor: 'transparent'
    }
})

export default HomeTabs
```

- 顶部标签栏和系统状态栏重叠，需要获取系统状态栏的高度。ios不能直接获取并且依赖机型，需要使用库`react-native-iphone-X-helper`（堆栈式导航器的依赖库）的`getStatusBarHeight()`方法

##### 添加渐变色背景

- `yarn add react-native-linear-gradient`，ios需要链接
- 动态改变颜色，过渡效果`yarn add react-native-linear-animated-gradient-transition`替换之前的

- 轮播图不可见时取消渐变更改文字颜色（FlatList监听滚动事件），猜你喜欢覆盖渐变色（背景色设为白色）

```tsx
import Touchable from '@/components/Touchable'
import { RootState } from '@/models/index'
import { MaterialTopTabBar, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {getStatusBarHeight} from 'react-native-iphone-x-helper'
import LinearAnimatedGradientTransition from 'react-native-linear-animated-gradient-transition'
import { connect, ConnectedProps } from 'react-redux'

const mapStateToProps = ({home}: RootState) => {
  return {
    gradientVisible: home.gradientVisible,
    linearColors: home.carousels && home.carousels.length > 0 ? home.carousels[home.activeCarouselIndex].colors : undefined
  }
}
const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>
type IProps = MaterialTopTabBarProps & ModelState

class TopTabBarWrapper extends React.Component<IProps> {
  get linearGradient() {
    const {linearColors = ['#fff', '#f86442'], gradientVisible} = this.props
    if(gradientVisible) {
      return (
        <LinearAnimatedGradientTransition colors={linearColors} style={styles.gradient}></LinearAnimatedGradientTransition>
      )
    }
    return null
  }
  render() {
    let {gradientVisible, indicatorStyle, ...restProps} = this.props

    let textStyle = styles.blackText
    let activeTintColor = '#f86442'

    // 渐变显示时的文字颜色
    if(gradientVisible) {
      textStyle = styles.text
      activeTintColor = '#fff'
      if(indicatorStyle) {
        indicatorStyle = StyleSheet.compose(indicatorStyle, styles.whiteBackgroundColor)
      }
    }

    return (
      <View style={styles.container}>
        {/* 渐变色 */}
        {this.linearGradient}
        <View style={styles.topTabBarView}>
          <MaterialTopTabBar 
            style={styles.tabBar}
            {...restProps}
            indicatorStyle={indicatorStyle}
            activeTintColor={activeTintColor}
          ></MaterialTopTabBar>
          <Touchable style={styles.categoryBtn}>
            <Text style={textStyle}>分类</Text>
          </Touchable>
        </View>
        <View style={styles.searchBar}>
          <Touchable style={styles.searchBtn}>
            <Text style={textStyle}>搜索按钮</Text>
          </Touchable>
          <Touchable style={styles.historyBtn}>
            <Text style={textStyle}>历史记录</Text>
          </Touchable>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
  },
  gradient: {
    // 占据整个父容器
    ...StyleSheet.absoluteFillObject,
    height: 240,
  },
  topTabBarView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabBar: {
      flex: 1,
      elevation: 0,
      overflow: "hidden",
      backgroundColor: 'transparent'
  },
  categoryBtn: {
    paddingHorizontal: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ccc',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
  },
  searchBtn: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 12,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  historyBtn: {
    marginLeft: 24,
  },
  text: {
    color: '#fff',
  },
  blackText: {
    color: '#333',
  },
  whiteBackgroundColor: {
    backgroundColor: '#fff'
  },
});

export default connector(TopTabBarWrapper)
```

### 分类模块

#### 需求分析

包含我的分类和其他分类两部分

我的分类

- 可删除
- 拖拽排序
- 默认模块不可删除拖拽

其他分类

- 可添加

完成保存分类并跳转首页，首页动态渲染

#### 本地数据存储

- 安装本地库`yarn add @react-native-community/async-storage`，ios需链接

一般不会直接使用，仅支持保存字符串类型，安装其封装库`yarn add react-native-storage`

- 配置

```ts
// config.storage.ts
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
```

- 使用

dva加载完说有数据之后就会执行subscriptions中的函数

在model中添加storage的sync配置

```ts
import storage, {load} from "@/config/storage";
import axios from "axios";
import { Effect, Model, SubscriptionsMapObject } from "dva-core-ts";
import {Reducer} from 'redux'

interface ICategory {
    id: string;
    name: string;
    classify?: string;
}

interface CategoryModelState {
    myCategorys: ICategory[];
    categorys: ICategory[];
}

interface CategoryModel extends Model {
    namespace: 'category';
    state: CategoryModelState;
    effects: {
        loadData: Effect;
    };
    reducers: {
        setState: Reducer<CategoryModelState>;
    };
    // 订阅数据源根据条件调用不同的 subscription
    subscriptions: SubscriptionsMapObject;
}

const initialState = {
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
```

导出model

```ts
// models/index.ts
import {DvaLoadingState} from 'dva-loading-ts'

import home from '@/models/home'
import category from '@/models/category'

const models = [home, category]

// 导出State类型
export type RootState = {
    home: typeof home.state,
    category: typeof category.state,
    loading: DvaLoadingState,
}

export default models
```

#### 样式布局

使用lodash处理数据`yarn add lodash @types/lodash`

```tsx
// pages/Category/index.tsx
...

import {ICategory} from '@/models/category'
import Item from './Item'

const mapStateToProps = ({category}: RootState) => {
    return {
        myCategorys: category.myCategorys,
        categorys: category.categorys
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}
interface IState {
    myCategorys: ICategory[]
}

class Category extends React.Component<IProps, IState> {
    state = {
        myCategorys: this.props.myCategorys
    }
    renderItem = (cate: ICategory, index: number) => {
        return (
            <Item item={cate}></Item>
        )
    }
    render() {
        const {categorys} = this.props
        const {myCategorys} = this.state
        // groupBy根据回调的返回值进行分组
        const classifyGroup = _.groupBy(categorys, item => item.classify)
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.myTypeText}>我的分类</Text>
                <View style={styles.sortWrap}>
                    {myCategorys.map(this.renderItem)}
                </View>
                <View>
                    {Object.keys(classifyGroup).map(key => {
                        return (
                            <View key={key}>
                                <Text style={styles.myTypeText}>{key}</Text>
                                <View style={styles.sortWrap}>
                                    {classifyGroup[key].map(this.renderItem)}
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
	...
});

export default connector(Category)
```

#### 切换编辑状态

给标题栏添加按钮的两种方式：

1. 在navigator中声明页面的地方增加options的属性headerRight

   ```tsx
   <Stack.Screen
       options={{
           headerTitle: "分类",
           headerRight: () => <HeaderRightBtn />
       }}
       name="Category"
       component={Category} 
   />
   ```

2. 在页面中取出navigation使用setOptions增加headerRight属性

项目使用方式2，使用库`yarn add react-navigation-header-buttons`的组件

dva新增当前状态，根据状态修改文字

```tsx
import { RootState } from '@/models/index'
import React from 'react'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import { connect, ConnectedProps } from 'react-redux'

const mapStateToProps = ({category}: RootState) => {
    return {
        isEdit: category.isEdit
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    toggleEdit: () => void
}

class HeaderRightBtn extends React.PureComponent<IProps> {
    render() {
        const {toggleEdit, isEdit} = this.props
        return (
            <HeaderButtons>
                <Item title={isEdit ? '完成' : '编辑'} onPress={toggleEdit} />
            </HeaderButtons>
        )
    }
}

export default connector(HeaderRightBtn)
```

修改ios返回样式

#### 添加删除类别

```tsx
// pages/Category/index.tsx
...

const mapStateToProps = ({category}: RootState) => {
    return {
        isEdit: category.isEdit,
        myCategorys: category.myCategorys,
        categorys: category.categorys
    }
}

const connector = connect(mapStateToProps)

type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    navigation: RootStackProps
}
interface IState {
    myCategorys: ICategory[]
}

// 我的分类默认项，不能删除
const fixedItem = [0,1]

class Category extends React.Component<IProps, IState> {
    state = {
        myCategorys: this.props.myCategorys
    }
    constructor(props: IProps) {
        super(props)
        props.navigation.setOptions({
            headerRight: () => <HeaderRightBtn toggleEdit={this.toggleEdit} />
        })
    }
    componentWillUnmount() {
        const {dispatch} = this.props
        // 初始化状态
        dispatch({
            type: 'category/setState',
            payload: {
                isEdit: false
            }
        })
    }
    // 切换编辑状态，保存数据
    toggleEdit = () => {
        const {dispatch} = this.props
        const {myCategorys} = this.state
        dispatch({
            type: 'category/toggle',
            payload: {
                myCategorys,
            }
        })
    }
    // 长按进入编辑状态
    onLongPress = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'category/setState',
            payload: {
                isEdit: true
            }
        })
    }
    // 增加、删除我的分类
    onPress = (cate: ICategory, index: number, isSelected: boolean) => {
        const {isEdit} = this.props
        const {myCategorys} = this.state
        const disabled = isSelected && fixedItem.indexOf(index) > -1
        if(disabled) return
        if(isEdit) {
            if(!isSelected) {
                this.setState({
                    myCategorys: myCategorys.concat(cate)
                })
            }else {
                this.setState({
                    myCategorys: myCategorys.filter(item => item.id !== cate.id)
                })
            }
        }
    }
    // 我的分类
    renderItem = (cate: ICategory, index: number) => {
        const {isEdit} = this.props
        const disabled = fixedItem.indexOf(index) > -1
        return (
            <Touchable
                key={cate.id}
                onPress={() => this.onPress(cate, index, true)}
            >
                <Item
                    disabled={disabled}
                    item={cate}
                    isEdit={isEdit}
                    isSelected
                ></Item>
            </Touchable>
        )
    }
    // 其他分类
    renderUnselectedItem = (cate: ICategory, index: number) => {
        const {isEdit} = this.props
        return (
            <Touchable
                key={cate.id}
                onLongPress={this.onLongPress}
                onPress={() => this.onPress(cate, index, false)}
            >
                <Item
                    item={cate}
                    isEdit={isEdit}
                    isSelected={false}
                ></Item>
            </Touchable>
        )
    }
    render() {
        const {categorys} = this.props
        const {myCategorys} = this.state
        // groupBy根据回调的返回值进行分组
        const classifyGroup = _.groupBy(categorys, item => item.classify)
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.TypeText}>我的分类</Text>
                <View style={styles.sortWrap}>
                    {myCategorys.map(this.renderItem)}
                </View>
                {Object.keys(classifyGroup).map(key => {
                    return (
                        <View key={key}>
                            <Text style={styles.TypeText}>{key}</Text>
                            <View style={styles.sortWrap}>
                                {/* 过滤掉已经选中的项 */}
                                {classifyGroup[key].filter(item => myCategorys.every(selectedItem => (selectedItem.id !== item.id))).map(this.renderUnselectedItem)}
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  ...
});

export default connector(Category)
```

保存到storage

```tsx
// models/category.ts
...

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
    ...
}

const categoryModel: CategoryModel = {
    namespace: 'category',
    state: initialState,
    effects: {
        ...
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
        ...
    },
    subscriptions: {
        ...
    }
}

export default categoryModel
```

#### 拖拽功能

`yarn add react-native-drag-sort`

```tsx
...
class Category extends React.Component<IProps, IState> {
    ...
    // 切换编辑状态，保存数据
    toggleEdit = () => {
        const {dispatch, navigation, isEdit} = this.props
        const {myCategorys} = this.state
        dispatch({
            type: 'category/toggle',
            payload: {
                myCategorys,
            }
        })
        // 完成时返回首页
        if(isEdit) {
            navigation.goBack()
        }
    }
    // 我的分类
    renderItem = (cate: ICategory, index: number) => {
        const {isEdit} = this.props
        const disabled = fixedItem.indexOf(index) > -1
        return (
            <Item
                key={cate.id}
                disabled={disabled}
                item={cate}
                isEdit={isEdit}
                isSelected
            ></Item>
        )
    }
    // 其他分类
    renderUnselectedItem = (cate: ICategory, index: number) => {
        ...
    }
    onSortChange = (data: ICategory[]) => {
        this.setState({
            myCategorys: data
        })
    }
    onClickItem = (data: ICategory[], item: ICategory) => {
        this.onPress(item, data.indexOf(item), true)
    }
    render() {
        const {categorys, isEdit} = this.props
        const {myCategorys} = this.state
        // groupBy根据回调的返回值进行分组
        const classifyGroup = _.groupBy(categorys, item => item.classify)
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.TypeText}>我的分类</Text>
                <View style={styles.sortWrap}>
                    <DragSortableView
                        fixedItems={fixedItem}
                        dataSource={myCategorys}
                        renderItem={this.renderItem}
                        sortable={isEdit}
                        keyExtractor={item => item.id}
                        onDataChange={this.onSortChange}
                        parentWidth={parentWidth}
                        childrenWidth={itemWidth}
                        childrenHeight={itemHeight}
                        onClickItem={this.onClickItem}
                    />
                </View>
                ...
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  ...
});

export default connector(Category)
```

#### 动态生成标签导航器

动态生成model，每一个类别都有自己独立的model

`yarn add dva-model-extend`三年未更新，需要自己写ts类型

```ts
// /index.d.ts
declare module 'dva-model-extend' {
    import { Model } from "dva-core-ts";
    export default function modelExtend(...model: Model[]): Model
}
```

修改dva

```ts
...
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
```

动态生成model

```tsx
// navigator/HomeTabs.tsx
...
export type HomeTabList = {
    [key: string]: {
        namespace: string;
    }
}

const Tab = createMaterialTopTabNavigator<HomeTabList>()

const mapStateToProps = ({category}: RootState) => {
    return {
        myCategorys: category.myCategorys
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>
interface IProps extends ModelState {}

class HomeTabs extends React.Component<IProps> {
    ...
    renderScreen = (item: ICategory) => {
        createHomeModel(item.id)
        return (
            <Tab.Screen
                key={item.id}
                name={item.id}
                component={Home}
                options={{
                    tabBarLabel: item.name
                }}
                initialParams={{
                    // 当前使用的model
                    namespace: item.id
                }}
            ></Tab.Screen>
        )
    }
    render() {
        const {myCategorys} = this.props
        return (
            <Tab.Navigator
                ...
            >
                {/* 动态生成 Tab.Screen */}
                { myCategorys.map(this.renderScreen) }
            </Tab.Navigator>
        )
    }
}
...
export default connector(HomeTabs)
```

动态获取model

```tsx
// pages/Home/index.tsx
...
const mapStateToProps = (state: RootState, {route}: {route: RouteProp<HomeTabList, string>}) => {
    // 获取 namespace
    const {namespace} = route.params
    const modelState = state[namespace]
    return {
        namespace,
        carousels: modelState.carousels,
        channels: modelState.channels,
        hasMore: modelState.pagination.hasMore,
        loading: state.loading.effects[namespace + '/fetchChannel'],
        gradientVisible: modelState.gradientVisible
    }
}
...
```

其他使用到的页面也需要修改

*TODO：请求接口还未新增类别*

### 频道模块 

点击猜你喜欢或首页列表进入

简介和节目两个tab

手势系统

#### 添加路由，跳转

#### 头部布局

动态修改标题，标题栏透明

获取数据

样式布局

图片模糊效果`yarn add @react-native-community/blur`，ios链接，android某些版本可能出现闪退

```tsx
...
import {BlurView} from '@react-native-community/blur'

import CoverRight from '@/assets/cover-right.png'

const mapStateToProps = ({album}: RootState) => {
    return {
        summary: album.summary,
        author: album.author,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    // RouteProp：推导route类型
    route: RouteProp<RootStackParamList, 'Album'>
}

// useHeaderHeight是hook函数在函数式组件中使用
const Album: React.FC<IProps> = ({dispatch, route, summary, author}) => {
    const {id, title, image} = route.params.item

    console.log('author', author);
    

    // 获取标题栏的高度
    const headerHeight = useHeaderHeight()

    useEffect(() => {
        dispatch({
            type: 'album/fetchAlbum',
            payload: {
                id
            }
        })
    }, [dispatch, route.params.item.id]);

    const renderHeader = () => {
        return (
        <View style={[styles.header, {paddingTop: headerHeight}]}>
            {/* 背景 */}
            {/* BlurView包含的组件都会模糊 */}
            {/* blurAmount：模糊程度，默认10 */}
            <Image style={styles.background} source={{uri: image}}></Image>
            {/* BlurView不能有子元素 */}
            <BlurView blurType='light' blurAmount={5} style={StyleSheet.absoluteFillObject} />
            <View style={styles.leftView}>
                <Image style={styles.thumbnail} source={{uri: image}}></Image>
                <Image style={styles.coverRight} source={CoverRight}></Image>
            </View>
            <View style={styles.rightView}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.summary}>
                    <Text style={styles.summaryText} numberOfLines={1}>{summary}</Text>
                </View>
                <View style={styles.author}>
                    <Image style={styles.avatar} source={{uri: author.avatar}}></Image>
                    <Text style={styles.name}>{author.name}</Text>
                </View>
            </View>
        </View>
        )
    }
    return (
        <View>{renderHeader()}</View>
    )
}

const styles = StyleSheet.create({
    ...
})

export default connector(Album)
```

#### 标签组件

使用react-native-tab-view库，前面已安装

获取数据

自定义标签样式

```tsx
import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import {SceneRendererProps, TabBar, TabView} from 'react-native-tab-view'
import Introduction from './Introduction'
import List from './List'

interface IRoute {
    key: string;
    title: string;
}

interface IState {
    routes: IRoute[];
    index: number;
}

interface IProps {}

class Tab extends React.Component<IProps, IState> {
    state = {
        // 默认下标 1
        index: 1,
        routes: [
            { key: 'introduction', title: '简介' },
            { key: 'albums', title: '节目' },
        ],
    }
    onIndexChange = (index: number) => {
        this.setState({
            index,
        })
    }
    renderScene = ({route}: {route: IRoute}) => {
        switch (route.key) {
            case 'introduction':
                return <Introduction />
            case 'albums':
                return <List />
            default:
                break;
        }
    }
    renderTabBar = (props: SceneRendererProps & {navigationState: IState}) => {
        return (
            <TabBar
                {...props}
                // 启动滚动，自定义宽度，默认平分
                scrollEnabled
                tabStyle={styles.tabStyle}
                labelStyle={styles.label}
                style={styles.tabbar}
                // 指示器样式
                indicatorStyle={styles.indicator}
            ></TabBar>
        )
    }
    render() {
        // const {routes, index} = this.state
        return (
            <TabView
                navigationState={this.state}
                onIndexChange={this.onIndexChange}
                // 渲染每一个标签
                renderScene={this.renderScene}
                // 自定义tabBar
                renderTabBar={this.renderTabBar}
            >
            </TabView>
        )
    }
}

const styles = {
    ...
}

export default Tab
```

#### 列表滚动效果

##### 动画

`react-native`的`Animated`

1. 设置动画值
2. 声明动画
3. 执行动画，需要使用动画组件`<Animated.View><Animated.Text><Animated.Image><Animated.FlatList><Animated.SectionList>`

插值动画修改颜色透明度等

```tsx
import { Image, StyleSheet, Text, View, Animated } from 'react-native'
...
const Album: React.FC<IProps> = ({dispatch, route, summary, author}) => {
    const {id, title, image} = route.params.item

    // 1. 声明动画值
    // const translateY = new Animated.Value(0)
    const [translateY] = useState(new Animated.Value(0));
    // 2. 声明动画
    Animated.timing(translateY, {
        toValue: -170,
        duration: 3000,
        useNativeDriver: true,
    }).start()
    ...
    const renderHeader = () => {...}
    return (
        // 4. 使用动画值
        <Animated.View style={[styles.container,
            {
                opacity: translateY.interpolate({
                  inputRange: [-170, 0],
                  outputRange: [1, 0],
                }),
                transform: [{translateY}]
            }
        ]}>
            {renderHeader()}
            <Tab></Tab>
        </Animated.View>
    )
}

export default connector(Album)
```

##### 手势响应系统

库`react-native-gesture-handler`（导航器已经依赖不用重新安装），分为两种手势，持续手势和不持续手势（长按，点击等）

监听拖动手势组件：

`<PanGestureHandler onGestureEvent={} />`，支持动画监听库

监听拖动

监听手势状态

增加限制

```tsx
...
// 手势库
import { PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler'
// 这个库旨在解决React Native在动画方面的性能问题，让我们能够创建运行在UI线程上的顺滑动画和流畅交互
// import Animated, { Easing } from 'react-native-reanimated'
...

interface IProps extends ModelState {
    // RouteProp：推导route类型
    route: RouteProp<RootStackParamList, 'Album'>,
    headerHeight: number;
}

const USE_NATIVE_DRIVER = true
const HEADER_HEIGHT = 260

// useHeaderHeight是hook函数在函数式组件中使用
class Album extends React.Component<IProps> {
    RANGE = [-(HEADER_HEIGHT - this.props.headerHeight), 0]
    // 1. 声明动画值
    translationY = new Animated.Value(0)
    translationYOffset = new Animated.Value(0)
    translateY = Animated.add(this.translationY, this.translationYOffset)
    translationYValue = 0
    // // 2. 声明动画
    // Animated.timing(this.translateY, {
    //     toValue: -170,
    //     duration: 3000,
    //     // 启动原生动画驱动
    //     useNativeDriver: USE_NATIVE_DRIVER
    // }).start()

    componentDidMount() {
        const {dispatch, route} = this.props
        const {id} = route.params.item
        dispatch({
            type: 'album/fetchAlbum',
            payload: {
                id
            }
        })
    }

    renderHeader = () => {...}

    // 监听拖动
    // onGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    //     console.log(event.nativeEvent.translationY);
    // }
    onGestureEvent = Animated.event([{
        // 绑定 translationY
        nativeEvent: {translationY: this.translationY}
    }], 
    // 配置
    { useNativeDriver: USE_NATIVE_DRIVER })

    // 监听手势状态
    onHandlerStateChange = ({nativeEvent}: PanGestureHandlerStateChangeEvent) => {
        // 防止每次拖动都回到初始高度
        // 上一次状态是活动的
        if(nativeEvent.oldState === State.ACTIVE) {
            let {translationY} = nativeEvent
            // 每个Animated.Value中都有两个值，一个value一个offset
            // 将 translationYOffset 的 value 值设置到 offset 上清空value值
            // offset = value
            this.translationYOffset.extractOffset()
            // 重新设置 value
            // value = translationY
            this.translationYOffset.setValue(translationY)
            // 将 offset 和 value 相加重新设置 value
            // value = value + offset
            this.translationYOffset.flattenOffset()
            this.translationY.setValue(0)
            this.translationYValue += translationY
            // 判断是否超出范围
            // spring：弹簧效果，inputRange、outputRange也要对应修改
            if(this.translationYValue < this.RANGE[0]) {
                this.translationYValue = this.RANGE[0]
                Animated.timing(this.translationYOffset, {
                    toValue: this.RANGE[0],
                    duration: 1000,
                    useNativeDriver: USE_NATIVE_DRIVER
                }).start()
            }else if(this.translationYValue > this.RANGE[1]) {
                this.translationYValue = this.RANGE[1]
                Animated.timing(this.translationYOffset, {
                    toValue: this.RANGE[1],
                    duration: 1000,
                    useNativeDriver: USE_NATIVE_DRIVER
                }).start()
            }
        }
    }

    render() {
        console.log('RANGE', this.RANGE);
        
        return (
            // onHandlerStateChange手势状态改变时调用
            <PanGestureHandler onHandlerStateChange={this.onHandlerStateChange} onGestureEvent={this.onGestureEvent}>
                {/* 4. 使用动画值 */}
                <Animated.View style={[styles.container,
                    {
                        // opacity: translateY.interpolate({
                        // inputRange: [-170, 0],
                        // outputRange: [1, 0],
                        // }),
                        transform: [{translateY: this.translateY.interpolate({
                            inputRange: this.RANGE,
                            outputRange: this.RANGE,
                            // 超出范围不做处理
                            extrapolate: 'clamp',
                        })}]
                    }
                ]}>
                    {this.renderHeader()}
                    {/* 设置列表高度 */}
                    <View style={{height: viewportHeight - this.props.headerHeight}}>
                        <Tab></Tab>
                    </View>
                </Animated.View>
            </PanGestureHandler>
        )
    }

}
...

const Wrapper = function(props: IProps) {
    // 获取标题栏的高度
    const headerHeight = useHeaderHeight();
    return <Album {...props} headerHeight={headerHeight} />;
  };

export default connector(Wrapper)
```

#### 频道详情

##### 全屏模式

相当于同时渲染多个页面，由于全屏模式是添加在导航器上的，现在只有频道页面需要，所以可以在最外层再添加一层堆栈式导航器与详情页面并列

```tsx
// navigator/index.tsx
...
// RootStackScreen
...
const RootStackScreen = () => {
    return (...)
}

// ModelStackScreen
export type ModelStackParamList = {
    Root: undefined;
    Detail: undefined;
}
export type ModelStackProps = StackNavigationProp<ModelStackParamList>
const ModelStack = createStackNavigator<ModelStackParamList>()
const ModelStackScreen = () => {
    return (
        // 设置全屏模式
        <ModelStack.Navigator mode='modal' headerMode='screen'>
            <ModelStack.Screen
                name='Root'
                component={RootStackScreen}
                options={{
                    // 隐藏标题栏
                    headerShown: false
                }}
            ></ModelStack.Screen>
            <ModelStack.Screen name='Detail' component={Detail}></ModelStack.Screen>
        </ModelStack.Navigator>
    )
}

class Navigator extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <ModelStackScreen></ModelStackScreen>
            </NavigationContainer>
        )
    }
}

export default Navigator
```

##### 播放音频

`yarn add react-native-sound`

```ts
// config/sound.ts
import Sound from 'react-native-sound'

Sound.setCategory('Playback')

let sound: Sound

const initPlay = (filePath: string) => {
    return new Promise((resolve, reject) => {
        sound = new Sound(filePath, '', error => {
            if(error) {
                console.log('failed to load sound', error);
                reject(error)
            }else {
                resolve(sound)
            }
        })
    })
}

const play = () => {
    return new Promise((resolve, reject) => {
        if(sound) {
            // 播放完成后才返回
            sound.play((success) => {
                if(success) {
                    resolve(sound)
                }else {
                    reject()
                }
                // 释放资源
                // sound.release()
            })
        }else {
            reject()
        }
    })
}

const pause = () => {
    return new Promise(resolve => {
        if(sound) {
            sound.pause(() => {
                resolve(sound)
            })
        }else {
            resolve(sound)
        }
    })
}

const getCurrentTime = () => {
    return new Promise(resolve => {
        if(sound && sound.isLoaded()) {
            sound.getCurrentTime(seconds => resolve(seconds))
        }else {
            resolve(0)
        }
    })
}

const getDuration = () => {
    console.log('sound', !!sound);
    if(sound) {
        console.log('sound', sound.getDuration());
        return sound.getDuration()
    }
    return 0
}

export {
    initPlay,
    play,
    pause,
    getCurrentTime,
    getDuration,
}

// models/player.ts
...
const PLAYER_URL = '/mock/11/player'

export interface PlayerState {
    id: string;
    title: string;
    soundUrl: string;
    playState: string;
    currentTime: number;
    duration: number;
    prevId: string;
    nextId: string;
    sounds: {id: string, title: string}[];
}

export interface PlayerModel extends Model {
    namespace: 'player',
    state: PlayerState,
    effects: {
        fetchPlayer: Effect,
        play: Effect,
        pause: Effect,
        // 监听播放时间
        // EffectWithType 是一个数组
        currentTimeWatcher: EffectWithType,
        prev: Effect,
        next: Effect,
    },
    reducers: {
        setState: Reducer<PlayerState>
    }
}

const initialState: PlayerState = {
    id: '',
    title: '',
    soundUrl: '',
    playState: '',
    currentTime: 0,
    duration: 0,
    prevId: '',
    nextId: '',
    sounds: [],
}

// 延时函数
const delay = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout))

// 每隔一秒获取音频时间
function* currentTime({call, put}: EffectsCommandMap) {
    while(true) {
        yield call(delay, 1000)
        const currentTime = yield call(getCurrentTime)
        yield put({
            type: 'setState',
            payload: {
                currentTime
            }
        })
    }
}

const playerModel: PlayerModel = {
    namespace: 'player',
    state: initialState,
    reducers: {
        setState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        }
    },
    effects: {
        *fetchPlayer({payload}, {call, put}) {
            const {data} = yield call(axios.get, PLAYER_URL, {params: {id: payload.id}})
            console.log('getDuration', getDuration());
            
            // 初始化音频
            yield call(initPlay, data.soundUrl)
            // 播放音频
            yield put({
                type: 'play'
            })
            // 保存数据
            yield put({
                type: 'setState',
                payload: {
                    // 由于是mock数据这里使用参数的id
                    id: payload.id,
                    soundUrl: data.soundUrl,
                    duration: getDuration()
                }
            })
        },
        // 播放上一首
        *prev({payload}, {call, put, select}) {
            // 先停止播放
            yield call(stop)
            const {id, sounds}: PlayerState = yield select(({player}: RootState) => player)
            const index = sounds.findIndex(item => item.id === id)
            const currentIndex = index - 1
            const currentItem = sounds[currentIndex]
            const prevItem = sounds[currentIndex - 1]
            // 更新数据
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                    id: currentItem.id,
                    title: currentItem.title,
                    prevId: prevItem ? prevItem.id : '',
                    nextId: index,
                }
            })
            // 播放
            yield put({
                type: 'fetchPlayer',
                payload: {
                    id: currentItem.id,
                }
            })
        },
        // 播放下一首
        *next({payload}, {call, put, select}) {
            // 先停止播放
            yield call(stop)
            const {id, sounds}: PlayerState = yield select(({player}: RootState) => player)
            const index = sounds.findIndex(item => item.id === id)
            const currentIndex = index + 1
            const currentItem = sounds[currentIndex]
            const nextItem = sounds[currentIndex + 1]
            // 更新数据
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                    id: currentItem.id,
                    title: currentItem.title,
                    nextId: nextItem ? nextItem.id : '',
                    prevId: index,
                }
            })
            // 播放
            yield put({
                type: 'fetchPlayer',
                payload: {
                    id: currentItem.id,
                }
            })
        },
        // 播放音频
        *play({payload}, {call, put}) {
            // 修改播放状态
            yield put({
                type: 'setState',
                payload: {
                    playState: 'playing',
                }
            })
            yield call(play)
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                }
            })
        },
        // 暂停音频
        *pause({payload}, {call, put}) {
            yield call(pause)
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                }
            })
        },
        // 监听播放时间
        // 参数是生成器函数
        currentTimeWatcher: [
            function*(sagaEffects) {
                const {call, race, take} = sagaEffects
                // 启动轮询
                while(true) {
                    // 监听play
                    yield take('play')
                    yield race([call(currentTime, sagaEffects), take('pause')])
                }
            },
            {
                // 监听，在dva加载时执行参数1的函数
                type: 'watcher'
            }
        ]
    }
}

export default playerModel
```

播放，暂停

显示进度条：监听播放进度

拖动进度条（未完成）

安装库`yarn add react-native-slider-x`

```tsx
// pages/Detail/PlayerSlider.tsx
...

class PlayerSlider extends React.Component<IProps> {
    renderThumb = () => {
        const {currentTime, duration} = this.props
        return (
            <View>
                <Text style={styles.text}>{formatTime(currentTime)}/{formatTime(duration)}</Text>
            </View>
        )
    }

    render() {
        const {currentTime, duration} = this.props

        return (
            <View style={styles.container}>
                <Slider
                    value={currentTime}
                    maximumValue={duration}
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    minimumTrackTintColor="#fff"
                    renderThumb={this.renderThumb}
                    thumbStyle={styles.thumb}
                ></Slider>
            </View>
        )
    }
}
...

export default connector(PlayerSlider)
```

上一首下一首

```tsx
// pages/Detail/index.tsx
...

const mapStateToProps = ({player}: RootState) => {
    return {
        soundUrl: player.soundUrl,
        playState: player.playState,
        title: player.title,
        prevId: player.prevId,
        nextId: player.nextId,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    navigation: ModelStackProps
    route: RouteProp<ModelStackParamList, 'Detail'>
}

class Detail extends React.Component<IProps> {
    componentDidMount() {
        const {dispatch, route, navigation, title} = this.props
        dispatch({
            type: 'player/fetchPlayer',
            payload: {
                id: route.params.id
            }
        })
        // 设置标题
        navigation.setOptions({
            headerTitle: title
        })
    }
    componentDidUpdate(prevProps: IProps) {
        const {navigation, title} = this.props
        if(title !== prevProps.title) {
            navigation.setOptions({
                headerTitle: title
            })
        }
    }

    toggle = () => {
        const {dispatch, playState} = this.props
        dispatch({
            type: playState === 'playing' ? 'player/pause'  : 'player/play'
        })
    }

    prev = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'player/prev'
        })
    }

    next = () => {
        const {dispatch} = this.props
        dispatch({
            type: 'player/next'
        })
    }

    render() {
        const {playState, prevId, nextId} = this.props
        return (
            <View style={styles.container}>
                <Text>Detail</Text>
                <PlayerSlider></PlayerSlider>
                <View style={styles.control}>
                    <Touchable disabled={!prevId} onPress={this.prev}>
                        <Icon
                            name='icon-shangyishou'
                            size={30}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                    <Touchable onPress={this.toggle}>
                        <Icon
                            name={playState === 'playing' ? 'icon-paste' : 'icon-bofang'}
                            size={40}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                    <Touchable disabled={!nextId} onPress={this.next}>
                        <Icon
                            name='icon-xiayishou'
                            size={30}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                </View>
            </View>
        )
    }
}
...

export default connector(Detail)
```

##### 图片背景弹幕

###### 弹幕

超出后消失

多轨道

单轨道多弹幕

```tsx
// pages/Barrage/item.tsx
...

interface IProps {
    data: IBarrageInTrack,
    outside: (data: IBarrageInTrack) => void
}

class BarrageItem extends React.PureComponent<IProps> {

    translateX = new Animated.Value(0)

    componentDidMount() {
        const {data, outside} = this.props
        Animated.timing(this.translateX, {
            toValue: 10,
            duration: 6000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({finished}) => {
            // 监听动画结束
            if(finished) {
                outside(data)
            }
        })
        // 监听动画
        // value 为 inputRange 0-10
        this.translateX.addListener(({value}) => {
            if(value > 3) {
                data.isFree = true
            }
        })
    }

    render() {
        const {data} = this.props
        // 获取弹幕大概长度
        const width = data.title.length * 15
        return (
            <Animated.View style={{
                transform: [
                    {
                        translateX: this.translateX.interpolate({
                            inputRange: [0, 10],
                            outputRange: [viewportWidth, -width]
                        })
                    }
                ],
                position: 'absolute',
                top: data.trackIndex * 30
            }}>
                <Text>{data.title}</Text>
            </Animated.View>
        )
    }
}

export default BarrageItem
```

```tsx
// pages/Barrage/index.tsx
...
export interface IBarrage {
    id: number;
    title: string;
}

export interface IBarrageInTrack extends IBarrage {
    trackIndex: number;
    isFree?: boolean;
}

interface IProps {
    source: IBarrage[],
    maxTrack: number,
    style?: StyleProp<ViewStyle>
}

interface IState {
    data: IBarrage[],
    list: IBarrageInTrack[][],
}

// 添加弹幕
function addBarrage(data: IBarrage[], maxTrack: number, list: IBarrageInTrack[][]) {
    for (let index = 0; index < data.length; index++) {
        const trackIndex = getTrackIndex(maxTrack, list)
        if(trackIndex < 0) {
            continue
        }
        // 初始化
        if(!list[trackIndex]) {
            list[trackIndex] = []
        }
        const barrage = {
            ...data[index],
            trackIndex,
        }
        list[trackIndex].push(barrage)
    }
    return list
}

// 获取需要增加弹幕的轨道下标
function getTrackIndex(maxTrack: number, list: IBarrageInTrack[][]) {
    for (let index = 0; index < maxTrack; index++) {
        const barrages = list[index]
        if(!barrages || barrages.length === 0) {
            return index
        }
        const lastBarrage = barrages[barrages.length - 1]
        if(lastBarrage.isFree) {
            return index
        }
    }
    return -1
}

class Barrage extends React.Component<IProps, IState> {
    state = {
        data: this.props.source,
        list: [this.props.source.map(item => ({...item, trackIndex: 0}))],
    }

    // 生命周期函数，从props中获取数据更新state，会在每次重新渲染时调用
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const {source, maxTrack} = nextProps
        if(source !== prevState.data) {
            // 返回新的state
            return {
                source,
                // 合并list
                list: addBarrage(source, maxTrack, prevState.list)
            }
        }
        return null
    }

    outsideHandler = (data: IBarrageInTrack) => {
        const {list} = this.state
        const newList = list.slice()
        if(newList.length > 0) {
            const {trackIndex} = data
            newList[trackIndex] = newList[trackIndex].filter(item => item.id !== data.id)
            this.setState({
                list: newList
            })
        }
    }

    renderItem = (item: IBarrageInTrack[], index: number) => {
        return item.map(barrage => {
            return (
                <BarrageItem
                    key={barrage.id}
                    data={barrage}
                    outside={this.outsideHandler}
                ></BarrageItem>
            )
        })
    }

    render() {
        const {list} = this.state
        const {style} = this.props
        return (
            <View style={[styles.container, style]}>
                { list.map(this.renderItem) }
            </View>
        )
    }
}
...

export default Barrage
```

```tsx
// pages/Detail/index.tsx
...

const data: string[] = [
    '岁的妇女和进口奖励几乎都oh几乎要更换一台有几个说明你',
    ...
]
const randomIndex = (length: number) => {
    return Math.floor(Math.random() * length)
}
const getText = () => {
    return data[randomIndex(data.length)]
}

const mapStateToProps = ({player}: RootState) => {
    return {
        soundUrl: player.soundUrl,
        playState: player.playState,
        title: player.title,
        prevId: player.prevId,
        nextId: player.nextId,
        thumbnailUrl: player.thumbnailUrl,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    navigation: ModelStackProps
    route: RouteProp<ModelStackParamList, 'Detail'>
}

interface IState {
    barrageVisible: boolean,
    barrageData: IBarrage[],
}

const IMAGE_WIDTH = 180
const PADDING_TOP = (viewportWidth - IMAGE_WIDTH) / 2
const SCALE = viewportWidth / IMAGE_WIDTH

class Detail extends React.Component<IProps, IState> {
    state = {
        barrageVisible: false,
        barrageData: []
    }

    // 弹幕动画
    animate = new Animated.Value(1)

    componentDidMount() {
        const {dispatch, route, navigation, title} = this.props
        dispatch({
            type: 'player/fetchPlayer',
            payload: {
                id: route.params.id
            }
        })
        // 设置标题
        navigation.setOptions({
            headerTitle: title
        })
        this.addBarrage()
    }
    ...

    addBarrage = () => {
        setInterval(() => {
            const {barrageVisible} = this.state
            if(barrageVisible) {
                const id = Date.now()
                const title = getText()
                this.setState({
                    barrageData: [{id, title}]
                })
            }
        }, 1000)
    }
    
    barrage = () => {
        this.setState({
            barrageVisible: !this.state.barrageVisible
        })
        // 启动动画
        Animated.timing(this.animate, {
            toValue: this.state.barrageVisible ? 1 : SCALE,
            duration: 100,
            useNativeDriver: true,
        }).start()
    }

    render() {
        const {playState, prevId, nextId, thumbnailUrl} = this.props
        const {barrageVisible, barrageData} = this.state
        return (
            <View style={styles.container}>
                {/* 图片 */}
                <View style={styles.imageContainer}>
                    <Animated.Image
                        style={[styles.image, {
                            transform: [{scale: this.animate}]
                        }]}
                        source={{uri: thumbnailUrl}}
                    ></Animated.Image>
                </View>
                {
                    barrageVisible && (
                        <>
                            {/* 渐变色 */}
                            <LinearGradient colors={['rgba(128,104,102,0.5)', '#807c66']} style={styles.linear}></LinearGradient>
                            {/* 弹幕 */}
                            <Barrage
                                source={barrageData}
                                maxTrack={5}
                                style={{top: PADDING_TOP}}
                            ></Barrage>
                        </>
                    )
                }
                {/* 弹幕按钮 */}
                <Touchable
                    onPress={this.barrage}
                    style={styles.barrageBtn}
                >
                    <Text style={styles.barrageText}>弹幕</Text>
                </Touchable>
                {/* 进度条 */}
                <PlayerSlider></PlayerSlider>
                {/* 控制器 */}
                <View style={styles.control}>
                    <Touchable disabled={!prevId} onPress={this.prev}>
                        <Icon
                            name='icon-shangyishou'
                            size={30}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                    <Touchable onPress={this.toggle}>
                        <Icon
                            name={playState === 'playing' ? 'icon-paste' : 'icon-bofang'}
                            size={40}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                    <Touchable disabled={!nextId} onPress={this.next}>
                        <Icon
                            name='icon-xiayishou'
                            size={30}
                            color='#fff'
                            style={styles.button}
                        ></Icon>
                    </Touchable>
                </View>
            </View>
        )
    }
}
...

export default connector(Detail)
```

#### 底部标签播放

播放时显示图片并旋转

显示进度：安装库`yarn add react-native-circular-progress`，生成圆形进度条

```tsx
// /pages/views/CircleProgress.tsx
...

const mapStateToProps = ({player}: RootState) => {
    return {
        currentTime: player.currentTime,
        duration: player.duration,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {}

class Progress extends React.PureComponent<IProps> {
    render() {
        const {children, currentTime, duration} = this.props
        const fill = duration ? currentTime / duration * 100 : 0
        return (
            <AnimatedCircularProgress
                size={40}
                width={2}
                tintColor="#f86442"
                backgroundColor="#ededed"
                fill={fill}
            >
                {() => <>{children}</>}
            </AnimatedCircularProgress>
        )
    }
}

export default connector(Progress)
```

点击跳转详情

```tsx
// /navigator/BottomTabs.tsx
// 增加一个Screen
...
<Tab.Screen
    name="paly"
    component={PlayButton}
    options={({navigation}) => ({
        tabBarButton: () => {
            return (<PlayButton onPress={() => navigation.navigator('Detail')} />)
        },
    })}
></Tab.Screen>
...

// /pages/views/PlayButton.tsx
...
import Progress from '@/pages/views/CircleProgress'

const mapStateToProps = ({player}: RootState) => {
    return {
        thumbnailUrl: player.thumbnailUrl,
        playState: player.playState,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    onPress: () => void
}

class PlayButton extends React.Component<IProps> {
    animate = new Animated.Value(0)
    rotate: Animated.AnimatedInterpolation
    timing: Animated.CompositeAnimation
    constructor(props: IProps) {
        super(props)
        this.timing = Animated.loop(Animated.timing(this.animate, {
            toValue: 1,
            duration: 10000,
            useNativeDriver: true,
            easing: Easing.linear,
        }), {iterations: -1})
        this.rotate = this.animate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        })
    }
    componentDidMount() {
        const {playState} = this.props
        if(playState === 'playing') {
            this.timing.start()
        }
    }
    componentDidUpdate() {
        const {playState} = this.props
        if(playState === 'playing') {
            this.timing.start()
        }else {
            this.timing.stop()
        }
    }
    onPress = () => {
        const {onPress, thumbnailUrl} = this.props
        if(thumbnailUrl && onPress) {
            onPress()
        }
    }
    render() {
        const {thumbnailUrl} = this.props
        return (
            <Touchable style={styles.play} onPress={this.onPress}>
                <Progress>
                    <Animated.View style={{transform: [{rotate: this.rotate}]}}>
                        {
                            thumbnailUrl ?
                            <Image source={{uri: thumbnailUrl}} style={styles.image}></Image> :
                            <Icon name="icon-bofang3" color="#ededed" size={40}></Icon>
                        }
                    </Animated.View>
                </Progress>
            </Touchable>
        )
    }
}
...

export default connector(PlayButton)
```

#### 独立的播放按钮

暂停和部分页面不显示

点击跳转详情页，通过ref实现

```tsx
// 获取当前页面
// /navigator/index.tsx
...

class Navigator extends React.Component {
    state = {
        routeName: 'Root'
    }
    onStateChange = (state: NavigationState) => {
        const routeName = getActiveTabName(state)
        this.setState({
            routeName
        })
    }
    render() {
        const {routeName} = this.state
        return (
            // 页面切换时触发 onStateChange
            <NavigationContainer ref={navigationRef} onStateChange={this.onStateChange}>
                <ModelStackScreen></ModelStackScreen>
                <PlayView routeName={routeName}></PlayView>
            </NavigationContainer>
        )
    }
}
...

export default Navigator

// /pages/views/PlayView.tsx
...
import PlayButton from './PlayButton';
import { viewportWidth, navigate } from '@/utils/index';

const mapStateToProps = ({player}: RootState) => {
    return {
        playState: player.playState,
    }
}
const connector = connect(mapStateToProps)
type ModelState = ConnectedProps<typeof connector>

interface IProps extends ModelState {
    routeName: string;
}

class PlayView extends React.Component<IProps> {
    onPress = () => {
        navigate('Detail')
    }
    render() {
        const {routeName, playState} = this.props
        if(['Root', 'Detail'].includes(routeName) || playState === 'pause') {
            return null
        }
        return (
            <View style={styles.container}>
                <Text>{routeName}</Text>
                <PlayButton onPress={this.onPress}></PlayButton>
            </View>
        )
    }
}

const width = 50

const styles = StyleSheet.create({
    container: {
        ...
        // 阴影
        ...Platform.select({
            android: {
                elevation: 4
            },
            ios: {
                shadowColor: 'rgba(0,0,0,0.3)',
                shadowOpacity: 0.85,
                shadowRadius: 5,
                shadowOffset: {
                    width: StyleSheet.hairlineWidth,
                    height: StyleSheet.hairlineWidth,
                }
            },
        })
    }
})

export default connector(PlayView)

// utils
...
const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string, params?: any) {
    if(navigationRef.current) {
        navigationRef.current.navigate(name, params)
    }
}
```

### 我听模块

#### 本地数据存储

`yarn add realm`提供筛选，排序等功能，ios需链接（命令后--verbose可以查看详细进度，会卡住，需要修改代码，浏览器下载并保存到临时目录）

安装报错该换为npm安装`npm i realm@5.0.1`

```tsx
// config/realm.ts
import Realm from 'realm'

// 表结构
export interface IPlayer {
    id: string;
    title: string;
    thumbnailUrl: string;
    currentTime: number;
    duration: number;
    rate: number;
}

// 声明表
class Player {
    duration = 0
    currentTime = 0
    static schema = {
        name: 'Player',
        primaryKey: 'id',
        properties: {
            id: 'string',
            title: 'string',
            thumbnailUrl: 'string',
            currentTime: {type: 'double', default: 0},
            duration: {type: 'double', default: 0},
        }
    }

    get rate() {
        return this.duration > 0 ? Math.floor((this.currentTime * 100 / this.duration) * 100) / 100 : 0
    }
}

// 更新表结构，指定版本号，从0开始；如有数据指定数据迁移函数
// const realm = new Realm({schema: [Player], schemaVersion: 1, migration: (oldRealm, newRealm) => {
//     if(oldRealm.schemaVersion < 1) {
//         // ...
//     }
// }})
const realm = new Realm({schema: [Player]})

// 保存数据
export function savePlayer(data: Partial<IPlayer>) {
    try {
        realm.write(() => {
            // 此处闪退，解决见下文
            realm.create('Player', data)
        })
    } catch (error) {
        console.log('save error', error);
    }
}

export default realm

// 使用
// /models/player.ts
...
const playerModel: PlayerModel = {
    ...
    effects: {
        *fetchPlayer({payload}, {call, put, select}) {
            // 先停止播放
            yield call(stop)
            const {data} = yield call(axios.get, PLAYER_URL, {params: {id: payload.id}})
            
            // 初始化音频
            yield call(initPlay, data.soundUrl)
            // 播放音频
            yield put({
                type: 'play'
            })
            // 保存数据
            yield put({
                type: 'setState',
                payload: {
                    // 由于是mock数据这里使用参数的id
                    id: payload.id,
                    soundUrl: data.soundUrl,
                    duration: getDuration()
                }
            })
            // 保存播放记录
            // const {id, title, thumbnailUrl, currentTime} = yield select(({player}: RootState) => player)
            // savePlayer({id, title, thumbnailUrl, currentTime, duration: getDuration()})
        },
        ...
        // 暂停音频
        *pause({payload}, {call, put, select}) {
            yield call(pause)
            yield put({
                type: 'setState',
                payload: {
                    playState: 'pause',
                }
            })
            // 更新播放记录
            // const {id, currentTime}: PlayerState = yield select(({player}: RootState) => player)
            // savePlayer({id, currentTime})
        },
        ...
    }
}

export default playerModel
        
// /pages/listen.tsc
...

class Listen extends React.Component<IProps> {
    renderItem = ({item}: ListRenderItemInfo<IPlayer>) => {
        return (
            <View style={styles.item}>
                <Image style={styles.image} source={{uri: item.thumbnailUrl}}></Image>
                <View style={styles.content}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.bottom}>
                        <Icon name='icon-time' color="#999" size={14}></Icon>
                        <Text style={styles.text}>{formatTime(item.currentTime)}</Text>
                        <Text style={styles.rate}>已播放：{item.rate}%</Text>
                    </View>
                </View>
                <Touchable onPress={() => this.delete(item)} style={styles.deleteBtn}>
                    <Text style={styles.delete}>删除</Text>
                </Touchable>
            </View>
        )
    }

    delete = (item: IPlayer) => {
        realm.write(() => {
            // 先查询
            const player = realm.objects('Player').filtered(`id='${item.id}'`)
            realm.delete(player)
            // 刷新页面
            this.setState({})
        })
    }
    
    render() {
        const players = realm.objects<IPlayer>('Player')
        return (
            <FlatList
                data={players}
                renderItem={this.renderItem}
            ></FlatList>
        )
    }
}
...

export default Listen
```

> 闪退：
>
> https://github.com/callstack/haul/issues/684
>
> Are you using `@haul-bundler/babel-preset-react-native`?? If so, the `class`es are not compiled to `functions` so Realm is probably not instantiating `Setting` with `new`. You can try replacing `class Setting { }` with `function Settings() { }`.
>
> ```ts
> // /config/realm.ts
> import Realm from 'realm'
> ...
> 
> // 声明表
> const Player = {
>     name: 'Player',
>     primaryKey: 'id',
>     properties: {
>         id: 'string',
>         title: 'string',
>         thumbnailUrl: 'string',
>         currentTime: {type: 'double', default: 0},
>         duration: {type: 'double', default: 0},
>     }
> }
> // class Player {
> //     duration = 0
> //     currentTime = 0
> //     static schema = {
> //         name: 'Player',
> //         primaryKey: 'id',
> //         properties: {
> //             id: 'string',
> //             title: 'string',
> //             thumbnailUrl: 'string',
> //             currentTime: {type: 'double', default: 0},
> //             duration: {type: 'double', default: 0},
> //         }
> //     }
> 
> //     // get rate() {
> //     //     return this.duration > 0 ? Math.floor((this.currentTime * 100 / this.duration) * 100) / 100 : 0
> //     // }
> // }
> ...
> 
> export default realm
> ```
>
> 获取列表返回空对象
>
> https://github.com/realm/realm-js/issues/3306
>
> 官方给出的解决方案与上一bug冲突，暂不能解决

##### 修改表结构

### 发现模块

将逻辑写到dva中，将数据不存储在dva中

视频依赖库：`npm i react-native-video`，`npm i -D @types/react-native-video`，ios需链接

自带控制组件有bug，安装控制组件依赖库`npm i react-native-video-custom-controls`

限制当前只播放一个视频

播放视频时暂停音频

播放音频时暂停视频（未完成）

```tsx
// /models/found.ts
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

// /pages/Found/index.tsx
...

const connector = connect()
type ModelState = ConnectedProps<typeof connector>

interface IState {
    list: IFound[];
    currentId: string;

}

class Found extends React.Component<IProps, IState> {
    state={
        list: [],
        currentId: ''
    }

    componentDidMount() {
        const {dispatch} = this.props
        dispatch({
            type: 'found/fetchList',
            callback: (data: IFound[]) => {
                this.setState({
                    list: data,
                })
            }
        })
    }
    setCurrentId = (id: string) => {
        const {dispatch} = this.props
        this.setState({
            currentId: id
        })
        // 暂停音频
        if(id) {
            dispatch({
                type: 'player/pause'
            })
        }
    }
    renderItem = ({item}: ListRenderItemInfo<IFound>) => {
        const {currentId} = this.state
        // 判断当前视频是否正在播放
        const pause = currentId !== item.id
        return <Item pause={pause} setCurrentId={this.setCurrentId} data={item} />
    }
    render() {
        const {list, currentId} = this.state
        return (
            // FlatList是一个PureComponent如果数据没有改变不会重新渲染
            <FlatList
                // extraData改变时可以让其重新渲染
                extraData={currentId}
                data={list}
                renderItem={this.renderItem}
            />
        )
    }
}

export default connector(Found)

// /pages/Found/Item.tsx
...

interface IProps {
    data: IFound,
    setCurrentId: (id: string) => void,
    pause: boolean,
}

class Item extends React.Component<IProps> {
    onPlay = () => {
        const {data, setCurrentId} = this.props
        setCurrentId(data.id)
    }
    onPause = () => {
        const {setCurrentId} = this.props
        setCurrentId('')
    }
    render() {
        const {data, pause} = this.props
        return (
            <view>
                <Text>{data.title}</Text>
                <VideoControls
                    paused={pause}
                    onPlay={this.onPlay}
                    onPause={this.onPause}
                    source={{uri: data.videoUrl}}
                    style={styles.video}
                ></VideoControls>
            </view>
        )
    }
}
...

export default Item
```

### 账号模块

表单管理formik和校验库yup，`npm i formik`

> 安装时报错no such file or directory, rename xxx
>
> 解决：删除package-lock重新安装

使用表单最外层使用ScrollView，避免键盘遮挡

```tsx
// /pages/Login.tsx
...
import * as Yup from 'yup'

interface Values {
    account: string;
    password: string;
}

const initialValues = {
    account: '',
    password: '',
}
...

const validationSchema = Yup.object().shape({
    account: Yup.string().trim().required('请输入账号'),
    password: Yup.string().trim().required('请输入密码'),
})

class Login extends React.Component<IProps> {
    onSubmit = (values: Values) => {
        const {dispatch} = this.props
        
        dispatch({
            type: 'user/login',
            payload: values
        })
    }
    render() {
        return (
            // keyboardShouldPersistTaps:"handled"切换多个input时，键盘一直唤醒
            <ScrollView keyboardShouldPersistTaps="handled">
                <Text style={styles.logo}>听书</Text>
                <Formik
                    initialValues={initialValues}
                    onSubmit={this.onSubmit}
                    // 定义校验规则
                    validationSchema={validationSchema}
                >
                    {({values, handleChange, handleBlur, handleSubmit, errors}) => {
                        return (
                            <View>
                                <TextInput
                                    onChangeText={handleChange('account')}
                                    onBlur={handleBlur('account')}
                                    value={values.account}
                                ></TextInput>
                                {errors.account && <Text>{errors.account}</Text>}
                                <TextInput
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry
                                ></TextInput>
                                {errors.password && <Text>{errors.password}</Text>}
                                <Touchable onPress={handleSubmit}>
                                    <Text>登录</Text>
                                </Touchable>
                            </View>
                        )
                    }}
                </Formik>
            </ScrollView>
        )
    }
}
...

export default connector(Login)
```

封装表单组件

```tsx

```

保存登录状态，显示登录后内容

封装登录状态判断