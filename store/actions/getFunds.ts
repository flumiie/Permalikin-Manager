import firestore from '@react-native-firebase/firestore';

import { GET_FUNDS, GET_FUNDS_ERROR } from '../constants';

interface GetUserDataProps {
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: GetUserDataProps) => {
  return async (dispatch: any) =>
    await firestore()
      .collection('Funds')
      .get()
      .then(querySnap => {
        const data = querySnap.docs[0].data();

        dispatch({
          type: GET_FUNDS,
          payload: data,
        });

        props.onSuccess(data);
      })
      .catch(err => {
        dispatch({
          type: GET_FUNDS_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
