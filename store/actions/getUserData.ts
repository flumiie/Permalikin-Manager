import axios from 'axios';

import { HOST } from '..';
import { GET_USER_DATA, GET_USER_DATA_ERROR } from '../constants';

interface GetUserDataProps {
  token: string;
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: GetUserDataProps) => {
  return async (dispatch: any) =>
    await axios
      .get(`${HOST}/v1/user`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then(res => {
        if (res.status === 200) {
          dispatch({
            type: GET_USER_DATA,
            payload: res.data,
          });
          if (res.data?.message === 'success') {
            props.onSuccess(res.data?.data);
          }
        }
      })
      .catch(err => {
        dispatch({
          type: GET_USER_DATA_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
