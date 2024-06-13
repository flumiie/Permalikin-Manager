import axios from 'axios';

import { HOST } from '..';
import { GET_AUTH, GET_AUTH_ERROR } from '../constants';

interface GetAuthProps {
  email: string;
  password: string;
  onSuccess: (v: any) => void;
  onError: () => void;
}

export default (props: GetAuthProps) => {
  return async (dispatch: any) =>
    await axios
      .post(
        `${HOST}/v1/user/auth`,
        {
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
            type: GET_AUTH,
            payload: res.data,
          });
          if (res.data?.message === 'success') {
            props.onSuccess(res.data?.data);
          }
        }
      })
      .catch(err => {
        dispatch({
          type: GET_AUTH_ERROR,
          payload: err?.message,
        });
        props.onError();
      });
};
