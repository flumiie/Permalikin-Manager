import auth from '@react-native-firebase/auth';

import { GET_AUTH, GET_AUTH_ERROR } from '../constants';

interface GetAuthProps {
  email: string;
  password: string;
  onSuccess: (v: any) => void;
  onError: (v: any) => void;
}

export default (props: GetAuthProps) => {
  return async (dispatch: any) =>
    await auth()
      .signInWithEmailAndPassword(props.email, props.password)
      .then(res => {
        dispatch({
          type: GET_AUTH,
          payload: res,
        });

        props.onSuccess(res);
      })
      .catch(err => {
        dispatch({
          type: GET_AUTH_ERROR,
          payload: err?.message,
        });

        props.onError(err);
      });
};
