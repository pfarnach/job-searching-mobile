import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Icon, SearchBar } from 'react-native-elements';
import { MapView } from 'expo';
import { connect } from 'react-redux';

import * as actions from '../actions';

class MapScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Map', // title of tab and header
    tabBarIcon: ({ tintColor }) => <Icon name="my-location" size={30} color={tintColor} />
  });

  state = {
    region: {
      longitude: -122.65949,
      latitude: 45.508535,
      longitudeDelta: 0.04,
      latitudeDelta: 0.09
    },
    mapLoaded: false,
    searchString: ''
  };

  componentDidMount() {
    // Workaround for android? (wasn't a problem on mine)
    this.setState({ mapLoaded: true });
  }

  onRegionChangeComplete = (region) => {
    this.setState({ region });
  };

  handleBtnPress = () => {
    const { region, searchString } = this.state;
    this.props.fetchJobs(region, searchString, () => {
      this.props.navigation.navigate('deck');
    });
  };

  render() {
    const { region, mapLoaded, searchString } = this.state;
    const { isLoading } = this.props;

    if (!mapLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return (
      <View style={{ flex: 1}}>
        <MapView
          region={region}
          style={{ flex: 1}}
          onRegionChangeComplete={this.onRegionChangeComplete}
        />
        <View style={styles.searchBarContainer}>
          <SearchBar
            lightTheme
            onChangeText={txt => this.setState({ searchString: txt })}
            value={searchString}
            maxLength={100}
            placeholder="Type keywords here (e.g. Javascript)"
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            large
            disabled={isLoading}
            title="Search This Area"
            backgroundColor="#009688"
            icon={{ name: 'search' }}
            onPress={this.handleBtnPress}
          />
        </View>
      </View>
    );
  }
}

const styles = {
  searchBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 25
  },
  btnContainer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0
  }
};

const mapStateToProps = ({ jobs }) => ({
  isLoading: jobs.isLoading
});

export default connect(mapStateToProps, actions)(MapScreen);
