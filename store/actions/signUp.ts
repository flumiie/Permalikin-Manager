import axios from 'axios';

import { HOST } from '..';
import { SIGN_UP, SIGN_UP_ERROR } from '../constants';

interface SignUpProps {
  name: string;
  email: string;
  password: string;
  onSuccess: (v: any) => void;
  onError: () => void;
}

export default (props: SignUpProps) => {
  return async (dispatch: any) =>
    await axios
      .post(
        `${HOST}/v1/user/auth`,
        {
          name: props.name,
          email: props.email,
          password: props.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: SIGN_UP,
            payload: res.data,
          });
          if (res.data?.message === 'success') {
            props.onSuccess(res.data?.data);
          }
        }
      })
      .catch(err => {
        dispatch({
          type: SIGN_UP_ERROR,
          payload: err?.message,
        });
        props.onError();
      });
};
