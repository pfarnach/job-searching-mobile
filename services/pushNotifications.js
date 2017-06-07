import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

const PUSH_TOKEN_KEY = 'PUSH_TOKEN';
const PUSH_ENDPOINT = 'https://rallycoding.herokuapp.com/api/tokens';

export default async () => {
  try {
    // Check local storage to see if we have notifications token
    const token = await AsyncStorage.getItem(PUSH_TOKEN_KEY);

    if (token) {
      return;
    } else {
      const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);

      if (status !== 'granted') {
        return;
      }

      // Generate new push token (async)
      const newToken = await Notifications.getExponentPushTokenAsync();

      // Send token to server
      await axios.post(PUSH_ENDPOINT, { token: { token: newToken }});

      // Set token in local storage
      AsyncStorage.setItem(PUSH_TOKEN_KEY, newToken);
    }
  } catch (err) {
    console.error(err);
  }
};
