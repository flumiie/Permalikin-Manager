import { useNetInfo } from '@react-native-community/netinfo';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import store, { asyncStorage } from '../store';
import Routes from './Routes';
import { Snackbar } from './components';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF',
  },
};

function App(): React.JSX.Element {
  const { isConnected } = useNetInfo();

  const [networkConnected, setNetworkConnected] = useMMKVStorage(
    'networkConnected',
    asyncStorage,
    false,
  );
  const [snackbar, setSnackbar] = useMMKVStorage<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>('snackbar', asyncStorage, null);

  useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide({ fade: true });
    }, 1500);
  }, []);

  useEffect(() => {
    setSnackbar({
      show: false,
      type: 'success',
      message: '',
    });
  }, [setSnackbar]);

  useEffect(() => {
    setNetworkConnected(!!isConnected);
  }, [isConnected, setNetworkConnected]);

  useEffect(() => {
    if (networkConnected) {
      setSnackbar({
        show: true,
        type: 'success',
        message: 'Berhasil terhubung ke internet',
      });
    }
  }, [networkConnected, setSnackbar]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#FCFCFF" />
      <Snackbar
        visible={snackbar?.show ?? false}
        onHide={() => {
          setSnackbar({
            show: false,
            type: 'success',
            message: '',
          });
        }}
        type={snackbar?.type ?? 'success'}
        message={snackbar?.message ?? ''}
      />
      <NavigationContainer theme={Theme}>
        <Provider store={store}>
          <GestureHandlerRootView style={styles.flex}>
            <Routes />
          </GestureHandlerRootView>
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default App;
