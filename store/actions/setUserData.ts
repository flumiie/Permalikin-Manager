import auth from '@react-native-firebase/auth';

import { PASSWORD_RESET, PASSWORD_RESET_ERROR } from '../constants';

interface GetAuthProps {
  name: string;
  email: string;
  photo: string;
  onSuccess: (v: void) => void;
  onError: (v: any) => void;
}

export default (props: GetAuthProps) => {
  return async (dispatch: any) =>
    await auth()
      .currentUser?.updateEmail(props.email)
      .then(() => {
        auth()
          .currentUser?.updateProfile({
            displayName: props.name,
            photoURL: props.photo,
          })
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
      })
      .catch(err => {
        dispatch({
          type: PASSWORD_RESET_ERROR,
          payload: err?.message,
        });

        props.onError(err);
      });
};
