import {
  CREATE_MEMBER_DONATION,
  CREATE_MEMBER_DONATION_ERROR,
} from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_MEMBER_DONATION:
      return {
        data: action.payload,
        error: null,
      };

    case CREATE_MEMBER_DONATION_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
