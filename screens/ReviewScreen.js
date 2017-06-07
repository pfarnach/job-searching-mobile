import React, { Component } from 'react';
import { View, Text, Platform, ScrollView, Linking } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { MapView } from 'expo';

class ReviewScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Review Jobs', // title of tab and header
    tabBarIcon: ({ tintColor }) => <Icon name="favorite" size={30} color={tintColor} />,
    headerRight: (
      <Button
        title="Settings"
        onPress={() => navigation.navigate('settings')}
        backgroundColor="rgba(0,0,0,0)"
        color="rgba(0, 122, 255, 1)"
      />
    ),
    headerStyle: {
      marginTop: Platform.OS === 'android' ? 25 : 0
    }
  });

  renderLikedJobs() {
    return this.props.likedJobs.map((job, idx) => {
      const {
        company,
        formattedRelativeTime,
        url,
        latitude,
        longitude,
        jobtitle,
        jobkey
      } = job;

      const initialRegion = {
        longitude,
        latitude,
        longitudeDelta: 0.045,
        latitudeDelta: 0.02
      };

      const isLastCard = this.props.likedJobs.length - 1 === idx;

      return (
        <Card
          containerStyle={isLastCard ? styles.lastCard : ''}
          title={jobtitle}
          key={jobkey}
        >
          <View style={{ height: 200 }}>
            <MapView
              scrollEnabled={false}
              style={{ flex: 1 }}
              cacheEnabled={Platform.OS === 'android'}
              initialRegion={initialRegion}
            />
            <View style={styles.detailWrapper}>
              <Text style={styles.bold}>{company}</Text>
              <Text style={styles.italics}>{formattedRelativeTime}</Text>
            </View>
            <Button
              title="Apply Now!"
              backgroundColor="#03A9F4"
              onPress={() => Linking.openURL(url)}
            />
          </View>
        </Card>
      );
    })
  }

  render() {
    return (
      <ScrollView>
        {this.renderLikedJobs()}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({
  likedJobs: state.likedJobs
});

styles = {
  detailWrapper: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  lastCard: {
    marginBottom: 20
  },
  italics: {
    fontStyle: 'italic'
  },
  bold: {
    fontWeight: 'bold'
  }
};

export default connect(mapStateToProps)(ReviewScreen);
