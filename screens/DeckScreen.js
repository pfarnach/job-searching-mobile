import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { MapView } from 'expo';
import { Card, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import * as actions from '../actions';
import SwipeDeck from '../components/SwipeDeck';

class DeckScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Jobs', // title of tab and header
    tabBarIcon: ({ tintColor }) => <Icon name="description" size={30} color={tintColor} />
  });

  renderCard = (job) => {
    const initialRegion = {
      longitude: job.longitude,
      latitude: job.latitude,
      latitudeDelta: 0.045,
      longitudeDelta: 0.02
    };

    return (
      <Card title={job.jobtitle}>
        <View style={{ height: 300 }}>
          <MapView
            scrollEnabled={false}
            style={{ flex: 1 }}
            cacheEnabled={Platform.OS === 'android'}
            initialRegion={initialRegion}
          >
          </MapView>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={{ fontWeight: 'bold' }}>{job.company}</Text>
          <Text style={{ fontStyle: 'italic' }}>{job.formattedRelativeTime}</Text>
        </View>
        <Text>
          {job.snippet.replace(/<b>/g, '').replace(/<\/b>/g, '')}
        </Text>
      </Card>
    );
  }

  renderNoMoreCards = () => {
    return (
      <Card title="No More Jobs">
        <Button
          title="Back to Map"
          large
          icon={{ name: 'my-location' }}
          onPress={() => this.props.navigation.navigate('map')}
        />
      </Card>
    );
  }

  renderJobs = () => (
    <SwipeDeck
      data={this.props.jobs}
      renderCard={this.renderCard}
      renderNoMoreCards={this.renderNoMoreCards}
      onSwipeRight={job => this.props.likeJob(job)}
      keyProp="jobkey"
    />
  );

  render() {
    return (
      <View style={{ marginTop: 15 }}>
        {this.renderJobs()}
      </View>
    );
  }
}

const mapStateToProps = ({ jobs }) => ({
  jobs: jobs.results
});

const styles = {
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  }
};

export default connect(mapStateToProps, actions)(DeckScreen);
