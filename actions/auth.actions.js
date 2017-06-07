import { AsyncStorage } from 'react-native';
import { Facebook } from 'expo';

import types from './types';
import { FACEBOOK_APP_ID } from '../secret';

const fbTokenKey = 'fbToken';

// AsyncStorage.setItem('key', val)
// AsyncStorage.getItem('key')

export const facebookLogin = () =>
  async (dispatch) => {
    // Set loading to true
    dispatch({ type: types.FACEBOOK_LOGIN_IS_LOADING, payload: true });

    const token = await AsyncStorage.getItem(fbTokenKey);

    if (token) {
      // Dispatch an action saying FB login is done
      dispatch({ type: types.FACEBOOK_LOGIN_SUCCESS, payload: token });
      dispatch({ type: types.FACEBOOK_LOGIN_IS_LOADING, payload: false });
    } else {
      // Start up FB login process
      doFacebookLogin(dispatch);
    }
  }


const doFacebookLogin = async (dispatch) => {
  const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
    permissions: ['public_profile']
  });  // App ID is a string, not a number!

  if (type === 'cancel') {
    return dispatch({ type: types.FACEBOOK_LOGIN_FAIL });
  }

  await AsyncStorage.setItem(fbTokenKey, token);

  dispatch({ type: types.FACEBOOK_LOGIN_SUCCESS, payload: token });
  dispatch({ type: types.FACEBOOK_LOGIN_IS_LOADING, payload: false });
};
