/**
 * @format
 */

import {AppRegistry} from 'react-native';
// 引入app
import App from './src/index';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => App);
