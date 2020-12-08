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

#### 报错

> error: ReferenceError: SHA-1 for file C:\Users\Frontend\AppData\Roaming\npm\node_modules\@react-native-community\cli\node_modules\metro\src\lib\polyfills\require.js (C:\Users\Frontend\AppData\Roaming\npm\node_modules\@react-native-community\cli\node_modules\metro\src\lib\polyfills\require.js) is not computed

由于使用旧的本机版本配置旧项目，因此引发了此问题。 然后尝试使用新Project运行最新的react-native版本。

解决：npm i -g react-native-cli --force

> Error while updating property 'nativeBackgroundAndroid' of a view managed by: RCTView
>
> Button组件会报错