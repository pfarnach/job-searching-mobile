import types from '../actions/types';

const INITIAL_STATE = {
  results: [],
  isLoading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_JOBS:
      return {
        ...state,
        ...action.payload
      };

    case types.FETCH_JOBS_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
}