import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Slides extends Component {
  renderLastSlider(slide, idx) {
    if (idx === this.props.data.length - 1) {
      return (
        <Button
          title="Onwards!"
          raised
          onPress={this.props.onComplete}
        />
      )
    }
  }

  renderSlides(data) {
    return data.map((slide, idx) => (
      <View key={slide.text} style={[styles.slide, { backgroundColor: slide.color }]}>
        <Text style={styles.slideText}>{slide.text}</Text>
        {this.renderLastSlider(slide, idx)}
      </View>
    ));
  }

  render() {
    const { data } = this.props;

    return (
      <ScrollView
        horizontal
        pagingEnabled
        style={{ flex: 1 }}
      >
        {this.renderSlides(data)}
      </ScrollView>
    );
  }
}

const styles = {
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH
  },
  slideText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 15
  },
  // button: {
  //   backgroundColor: '#0288D1',
  //   marginTop: 15
  // }
}

export default Slides;
