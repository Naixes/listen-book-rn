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

