import axios from 'axios';

import { HOST } from '..';
import { SET_USER_DATA, SET_USER_DATA_ERROR } from '../constants';

interface SetUserDataProps {
  token: string;
  name: string;
  email: string;
  position: string;
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: SetUserDataProps) => {
  return async (dispatch: any) =>
    await axios
      .put(
        `${HOST}/v1/user`,
        {
          name: props?.name,
          email: props?.email,
          position: props?.position,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${props.token}`,
          },
        },
      )
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: SET_USER_DATA,
            payload: res.data,
          });
          if (res.data?.message === 'success') {
            props.onSuccess(res.data);
          }
        }
      })
      .catch(err => {
        dispatch({
          type: SET_USER_DATA_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
