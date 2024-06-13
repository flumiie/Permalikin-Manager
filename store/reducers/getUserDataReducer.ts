import { GET_USER_DATA, GET_USER_DATA_ERROR } from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_USER_DATA:
      return {
        data: action.payload,
        error: null,
      };

    case GET_USER_DATA_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
