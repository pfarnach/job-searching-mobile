import axios from 'axios';
import reverseGeocode from 'latlng-to-zip';
import qs from 'qs';

import types from './types';
import { INDEED_PUBLISHER_KEY } from '../secret';

const INDEED_ROOT_URL = 'http://api.indeed.com/ads/apisearch?';
const DEFAULT_INDEED_PARAMS = {
  publisher: INDEED_PUBLISHER_KEY,  // my publisher ID (API key)
  format: 'json',
  v: '2', // version
  latlong: 1, // return lat long
  radius: 6 // miles
};

const buildJobsQueryString = (zipcode, searchString) => qs.stringify({
  ...DEFAULT_INDEED_PARAMS,
  l: zipcode,
  q: searchString.toLowerCase() || 'javascript'
});

export const fetchJobs = (region, searchString, navigationCb) => {
  return async (dispatch) => {
    try {
      dispatch({ type: types.FETCH_JOBS_IS_LOADING, payload: true });
      const zipcode = await reverseGeocode(region);

      const { data } = await axios.get(INDEED_ROOT_URL + buildJobsQueryString(zipcode, searchString));

      dispatch({ type: types.FETCH_JOBS, payload: data });
      navigationCb();
      dispatch({ type: types.FETCH_JOBS_IS_LOADING, payload: false });
    } catch (err) {
      console.error(err);
      dispatch({ type: types.FETCH_JOBS_IS_LOADING, payload: false });
    }
  }
};

export const likeJob = (job) => ({
  type: types.LIKE_JOB,
  payload: job
});

export const clearLikedJobs = () => ({
  type: types.CLEAR_LIKED_JOBS
});
