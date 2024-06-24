import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import { SIGN_UP, SIGN_UP_ERROR } from '../constants';

interface GetAuthProps {
  name: string;
  email: string;
  password: string;
  onSuccess: (v: FirebaseAuthTypes.UserCredential) => void;
  onError: (v: any) => void;
}

export default (props: GetAuthProps) => {
  return async (dispatch: any) =>
    await auth()
      .createUserWithEmailAndPassword(props.email, props.password)
      .then(res => {
        res.user.updateProfile({
          displayName: props.name,
        });
        dispatch({
          type: SIGN_UP,
          payload: res,
        });

        props.onSuccess(res);
      })
      .catch(err => {
        dispatch({
          type: SIGN_UP_ERROR,
          payload: err?.message,
        });

        props.onError(err);
      });
};
