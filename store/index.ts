import { Tuple, combineReducers, configureStore } from '@reduxjs/toolkit';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { thunk } from 'redux-thunk';

import { getAuthReducer, getUserDataReducer, signUpReducer } from './reducers';

const rootReducer = combineReducers({
  getAuth: getAuthReducer,
  getUserData: getUserDataReducer,
  signUp: signUpReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(thunk),
});

export type Dispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const HOST = 'https://HOST_URL_HERE';
export const asyncStorage = new MMKVLoader().initialize();

export default store;
