import { Tuple, combineReducers, configureStore } from '@reduxjs/toolkit';
import { MMKVLoader } from 'react-native-mmkv-storage';
import { thunk } from 'redux-thunk';

import {
  changePasswordReducer,
  createMemberDonationReducer,
  createMemberDueReducer,
  getAuthReducer,
  getMemberDonationsReducer,
  getMemberDuesReducer,
  getMemberInterestsReducer,
  signUpReducer,
} from './reducers';
import getFundsReducer from './reducers/getFundsReducer';

const rootReducer = combineReducers({
  getAuth: getAuthReducer,
  changePassword: changePasswordReducer,
  signUp: signUpReducer,
  getFunds: getFundsReducer,
  getMemberDues: getMemberDuesReducer,
  getMemberDonations: getMemberDonationsReducer,
  getMemberInterests: getMemberInterestsReducer,
  createMemberDonation: createMemberDonationReducer,
  createMemberDue: createMemberDueReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(thunk),
});

type Dispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

const HOST = 'gs://permalikin-manager.appspot.com';
const storage = new MMKVLoader().initialize();

export type { Dispatch, RootState };
export { HOST, storage as asyncStorage };
export default store;
