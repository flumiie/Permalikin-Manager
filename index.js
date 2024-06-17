/**
 * @format
 */
import { OAUTH_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { initializeFirestore } from 'firebase/firestore';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/App';

GoogleSignin.configure({
  webClientId: OAUTH_CLIENT_ID,
});

// const db = initializeFirestore(App, {
//   experimentalForceLongPolling: true,
// });

AppRegistry.registerComponent(appName, () => App);
