import types from '../actions/types';

const DEFAULT_STATE = {
  token: null,
  isLoading: true
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case types.FACEBOOK_LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload
      };

    case types.FACEBOOK_LOGIN_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case types.FACEBOOK_LOGIN_FAIL:
      return { token: null };

    default:
      return state;
  }
};
