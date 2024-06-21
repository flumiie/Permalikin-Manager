import firestore from '@react-native-firebase/firestore';

import { GET_MEMBER_LIST, GET_MEMBER_LIST_ERROR } from '../constants';

interface GetUserDataProps {
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: GetUserDataProps) => {
  return async (dispatch: any) =>
    await firestore()
      .collection('Personels')
      .limit(10)
      .get()
      .then(querySnap => {
        if (querySnap.docs.length) {
          const data = querySnap.docs.map(doc => doc.data());
          dispatch({
            type: GET_MEMBER_LIST,
            payload: data,
          });
          if (data.length) {
            props.onSuccess(data);
          }
        }
      })
      .catch(err => {
        dispatch({
          type: GET_MEMBER_LIST_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
