import axios from 'axios';
import * as rssParser from 'react-native-rss-parser';

import { GET_AUTH, GET_AUTH_ERROR } from '../constants';

interface GetAuthProps {
  onSuccess: (v: any) => void;
  onError: (v: string) => void;
}

export default (props: GetAuthProps) => {
  return async (dispatch: any) =>
    await axios
      .get('https://kaltim.antaranews.com/rss/nasional.xml', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => {
        if (res.status === 200) {
          const data = rssParser.parse(res.data);
          dispatch({
            type: GET_AUTH,
            payload: data,
          });
          props.onSuccess(data);
        }
      })
      .catch(err => {
        dispatch({
          type: GET_AUTH_ERROR,
          payload: err?.message,
        });
        props.onError(err?.message);
      });
};
