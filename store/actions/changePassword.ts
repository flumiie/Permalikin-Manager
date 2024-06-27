import { FirebaseAuthTypes, firebase } from '@react-native-firebase/auth';

import { CHANGE_PASSWORD, CHANGE_PASSWORD_ERROR } from '../constants';

interface GetAuthProps {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  onSuccess: (v: FirebaseAuthTypes.UserCredential) => void;
  onError: (v: any) => void;
}

export default (props: GetAuthProps) => {
  const currentUser = firebase.auth().currentUser;

  if (currentUser) {
    const firebaseCredential = firebase.auth.EmailAuthProvider.credential(
      currentUser.email ?? '',
      props.oldPassword,
    );

    return (dispatch: any) =>
      currentUser
        .reauthenticateWithCredential(firebaseCredential)
        .then(v => {
          v.user
            .updatePassword(props.newPassword)
            .then(() => {
              dispatch({
                type: CHANGE_PASSWORD,
                payload: true,
              });
              props.onSuccess(v);
            })
            .catch(err => {
              dispatch({
                type: CHANGE_PASSWORD_ERROR,
                payload: err?.message,
              });

              props.onError(err);
            });
        })
        .catch(err => {
          dispatch({
            type: CHANGE_PASSWORD_ERROR,
            payload: err?.message,
          });

          props.onError(err);
        });
  }

  return null;
};
