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
          '@utils': './src/utils',
          '@pages': './src/pages',
          '@navigator': './src/navigator',
          '@models': './src/models',
          '@config': './src/config',
          '@components': './src/components',
          '@assets': './src/assets',
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

