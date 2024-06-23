import firestore from '@react-native-firebase/firestore';

import { GET_MEMBER_DONATIONS, GET_MEMBER_DONATIONS_ERROR } from '../constants';

interface GetUserDataProps {
  memberCode: string;
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: GetUserDataProps) => {
  return async (dispatch: any) =>
    await firestore()
      .collection('Personels')
      .where('memberCode', '==', props.memberCode)
      .where('donations', '!=', [])
      .get()
      .then(querySnap => {
        const data = querySnap.docs.map(doc => {
          return doc.data().donations;
        });

        dispatch({
          type: GET_MEMBER_DONATIONS,
          payload: data,
        });

        props.onSuccess(data);
      })
      .catch(err => {
        dispatch({
          type: GET_MEMBER_DONATIONS_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
