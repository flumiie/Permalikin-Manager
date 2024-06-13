import { GET_AUTH, GET_AUTH_ERROR } from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_AUTH:
      return {
        data: action.payload,
        error: null,
      };

    case GET_AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
