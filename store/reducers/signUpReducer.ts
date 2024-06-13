import { SIGN_UP, SIGN_UP_ERROR } from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case SIGN_UP:
      return {
        data: action.payload,
        error: null,
      };

    case SIGN_UP_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
