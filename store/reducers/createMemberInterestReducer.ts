import {
  CREATE_MEMBER_INTEREST,
  CREATE_MEMBER_INTEREST_ERROR,
} from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_MEMBER_INTEREST:
      return {
        data: action.payload,
        error: null,
      };

    case CREATE_MEMBER_INTEREST_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
