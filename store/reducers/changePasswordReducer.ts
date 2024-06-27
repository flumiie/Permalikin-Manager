import { CHANGE_PASSWORD, CHANGE_PASSWORD_ERROR } from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CHANGE_PASSWORD:
      return {
        data: action.payload,
        error: null,
      };

    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
