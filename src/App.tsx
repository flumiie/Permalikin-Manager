import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import store from '../store';
import Routes from './Routes';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
  },
};

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 1500);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <NavigationContainer theme={Theme}>
        <Provider store={store}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Routes />
          </GestureHandlerRootView>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
