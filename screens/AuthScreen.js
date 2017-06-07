import React, { Component } from 'react';
import { View, Text, AsyncStorage, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../actions';

class AuthScreen extends Component {
  componentDidMount() {
    this.props.facebookLogin();
    // AsyncStorage.removeItem('fbToken');  // debug utility to remove token from storage if necessary

    this.onAuthComplete(this.props.token); // probably won't ever have token ready at this point but just in case flow changes at some point
  }

  componentWillReceiveProps(nextProps) {
    this.onAuthComplete(nextProps.token);
  }

  onAuthComplete(token) {
    if (token) {
      this.props.navigation.navigate('map');
    }
  }

  render() {
    const { isLoading } = this.props;

    // NOTE: ActivityIndicator not working on my Galaxy S5; seems like a known issue

    return (
      <View style={styles.container}>
        { isLoading ?
          <ActivityIndicator
            animating
            size="large"
            color="#03a9f4"
            style={{ opacity: 1 }}
          /> :
          <View />
        }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}

const mapStateToProps = ({ auth }) => ({
  token: auth.token,
  isLoading: auth.isLoading
});

export default connect(mapStateToProps, actions)(AuthScreen);
