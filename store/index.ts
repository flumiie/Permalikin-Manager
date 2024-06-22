import { Tuple, combineReducers, configureStore } from '@reduxjs/toolkit';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { thunk } from 'redux-thunk';

import {
  createMemberDueReducer,
  getAuthReducer,
  getMemberDuesReducer,
  signUpReducer,
} from './reducers';

const rootReducer = combineReducers({
  getAuth: getAuthReducer,
  getMemberDues: getMemberDuesReducer,
  createMemberDue: createMemberDueReducer,
  signUp: signUpReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(thunk),
});

type Dispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

const HOST = 'gs://permalikin-manager.appspot.com';
const asyncStorage = new MMKVLoader().initialize();

export type { Dispatch, RootState };
export { HOST, asyncStorage };
export default store;
