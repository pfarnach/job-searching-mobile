import React, { Component } from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,  // used to retrieve user-specific device info
  Platform
  // UIManager,
  // LayoutAnimation  // for animations between re-renders (when cards bump up)
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;  // width necessary to swipe to register a like/dislike
const SWIPE_OUT_DURATION = 200;
const CARD_OFFSET = 5;

class SwipeDeck extends Component {
  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    keyProp: 'id'
  };

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    // PAN RESPONDER CONFIG
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    this.panResponder = panResponder;
    this.cardBouncePosition = new Animated.ValueXY();
    this.position = position;

    // STATE
    this.state = {
      index: 0
    };
  }

  // if we get new data from the parent component
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
        this.setState({ index: 0 });
    }
  }

  // for animations between re-renders (when cards bump up
  // componentWillUpdate() {
  //   UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

  //   LayoutAnimation.spring();
  // }

  forceSwipe(dir) {
    const x = dir === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;

    // timing is the same as spring but more linear
    Animated.timing(this.position, {
      toValue: { x: x * 1.5, y: 0 },  // get it off the screen
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(dir));
  }

  onSwipeComplete(dir) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    dir === 'right' ? onSwipeRight(item) : onSwipeLeft(item);

    // Move cards up
    Animated.timing(this.cardBouncePosition,
      {
        toValue: { x: 0, y: -CARD_OFFSET },
        duration: SWIPE_OUT_DURATION
      }).start(() => {
        // we update state (rerender page) ONLY after the animation is finished
        this.position.setValue({ x: 0, y: 0 });
        this.cardBouncePosition.setValue({ x: 0, y: 0 });
        this.setState({ index: this.state.index + 1 });
      });
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle() {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      outputRange: ['-90deg', '0deg', '90deg']
    });

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }

    const deck = this.props.data.map((item, idx) => {
      if (idx < this.state.index) {
        return null;
      }

      if (idx === this.state.index) {
        return (
          <Animated.View
            key={item[this.props.keyProp]}
            style={[this.getCardStyle(), styles.cardStyle, styles.topCard]}
            {...this.panResponder.panHandlers}
          >
            { this.props.renderCard(item)}
          </Animated.View>
        )
      }

      const idxDiff = idx - this.state.index;

      // Use Animated.View here b/c there can be an image flash when View component then gets rendered as an Animated.View when it comes to the top.
      return (
        <Animated.View
          style={[styles.cardStyle, { top: CARD_OFFSET * idxDiff, zIndex: -idx }]}
          key={item[this.props.keyProp]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      );
    });

    return Platform.OS === 'android' ? deck : deck.reverse();
  }

  render() {
    return (
      <Animated.View style={[this.cardBouncePosition.getLayout()]}>
        {this.renderCards()}
      </Animated.View>
    );
  }
}

const styles = {
  deckContainer: {
    flex: 1,
    alignItems: 'center'
  },
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  },
  topCard: {
    zIndex: 99
  }
};

export default SwipeDeck;
