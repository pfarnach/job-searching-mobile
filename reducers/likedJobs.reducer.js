import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';

import types from '../actions/types';

export default (state = [], action) => {
  switch (action.type) {
    case types.LIKE_JOB:
      return _.uniqBy([action.payload, ...state], 'jobkey');

    case types.CLEAR_LIKED_JOBS:
      return [];

    case REHYDRATE:
      return action.payload.likedJobs || [];

    default:
      return state;
  }
}