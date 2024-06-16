/**
 * @format
 */
import { OAUTH_CLIENT_ID } from '@env';
import { firebase } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

GoogleSignin.configure({
  webClientId: OAUTH_CLIENT_ID,
});

firebase.firestore().settings({
  experimentalForceLongPolling: true,
});

AppRegistry.registerComponent(appName, () => App);
