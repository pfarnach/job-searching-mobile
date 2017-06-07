import Expo, { Notifications } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import store from './store';
import registerForNotifications from './services/pushNotifications';

import AuthScreen from './screens/AuthScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReviewScreen from './screens/ReviewScreen';

class App extends React.Component {
  componentDidMount() {
    registerForNotifications();

    // Listener for push notifications
    Notifications.addListener(notification => {
      const { data: { text }, origin } = notification;

      if (origin === 'received' && text) {
        // Send alert
        Alert.alert(
          'New Notification',
          text,
          [{ text: 'Ok' }]
        );
      }
    });
  }

  render() {
    const MainNavigator = TabNavigator({
      welcome: { screen: WelcomeScreen },
      auth: { screen: AuthScreen },
      main: {
        screen: TabNavigator({
          map: { screen: MapScreen },
          deck: { screen: DeckScreen },
          review: {
            screen: StackNavigator({
              review: { screen: ReviewScreen },
              settings: { screen: SettingsScreen }
            })
          }
        },{
          tabBarPosition: 'bottom',
          tabBarOptions: {
            labelStyle: { fontSize: 12 },
            showIcon: true,
            iconStyle: { width: 30 }
          },
          swipeEnabled: false,
        })
      }
    },{
      navigationOptions: {
        tabBarVisible: false
      },
      lazy: true,
      tabBarPosition: 'bottom',
      swipeEnabled: false,
    });

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

Expo.registerRootComponent(App);
