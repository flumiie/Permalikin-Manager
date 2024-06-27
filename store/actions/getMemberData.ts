import firestore from '@react-native-firebase/firestore';

import { MasterDataType } from '../../src/libs/dataTypes';
import { GET_MEMBER, GET_MEMBER_ERROR } from '../constants';

interface GetUserDataProps {
  memberCode: string;
  onSuccess: (v: MasterDataType) => void;
  onError: (v: string) => void;
}

export default (props: GetUserDataProps) => {
  return async (dispatch: any) =>
    await firestore()
      .collection('Personels')
      .where('memberCode', '==', props.memberCode)
      .get()
      .then(querySnap => {
        const data = querySnap.docs.map(doc => doc.data());

        dispatch({
          type: GET_MEMBER,
          payload: data,
        });

        return props.onSuccess(data?.[0]);
      })
      .catch(err => {
        dispatch({
          type: GET_MEMBER_ERROR,
          payload: err?.message,
        });
        return props.onError(err?.message);
      });
};
