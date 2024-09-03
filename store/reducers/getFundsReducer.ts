import { GET_FUNDS, GET_FUNDS_ERROR } from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_FUNDS:
      return {
        data: action.payload,
        error: null,
      };

    case GET_FUNDS_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
