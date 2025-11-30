// index.js
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import mobileAds from 'react-native-google-mobile-ads';

// mobileAds()
//     .initialize()
//     .then(() => {
//         // AdMob initialized
//     });

AppRegistry.registerComponent(appName, () => App);
