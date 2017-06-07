import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import * as actions from '../actions';

class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Settings', // title of tab and header
    tabBarIcon: ({ tintColor }) => <Icon name="settings" size={30} color={tintColor} />,
    headerStyle: {
      marginTop: Platform.OS === 'android' ? 25 : 0
    }
  });

  render() {
    return (
      <View>
        <Button
          title="Reset Liked Jobs"
          large
          icon={{ name: 'delete-forever' }}
          backgroundColor="#F44336"
          buttonStyle={{ marginTop: 15 }}
          onPress={this.props.clearLikedJobs}
        />
      </View>
    );
  }
}

export default connect(null, actions)(SettingsScreen);
