import auth from '@react-native-firebase/auth';

import { PASSWORD_RESET, PASSWORD_RESET_ERROR } from '../constants';

interface GetAuthProps {
  email: string;
  onSuccess: (v: void) => void;
  onError: (v: any) => void;
}

export default (props: GetAuthProps) => {
  return async (dispatch: any) =>
    await auth()
      .sendPasswordResetEmail(props.email)
      .then(res => {
        dispatch({
          type: PASSWORD_RESET,
          payload: res,
        });

        props.onSuccess(res);
      })
      .catch(err => {
        dispatch({
          type: PASSWORD_RESET_ERROR,
          payload: err?.message,
        });

        props.onError(err);
      });
};
