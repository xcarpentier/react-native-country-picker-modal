import React from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('screen');

interface Props {
  visible: boolean,
  children: React.ReactNode,
}

const styles = {
  wrapper: {
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    left: 0,
    top: 0,
    zIndex: 100,
  },
}

export default class Modal extends React.Component<Props> {
  aniVal = new Animated.Value(WINDOW_HEIGHT);

  componentDidUpdate(prevProps: Props) {
    const { visible } = this.props;
    if (visible && !prevProps.visible) {
      this.showModal();
    }
    if (!visible && prevProps.visible) {
      this.hideModal();
    }
  }

  hideModal(): void {
    Animated.timing(
      this.aniVal,
      {
        toValue: WINDOW_HEIGHT,
        duration: 300,
      }
    ).start();
  }

  showModal(): void {
    Animated.timing(
      this.aniVal,
      {
        toValue: 0,
        duration: 300,
      }
    ).start();
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.wrapper,
          { top: this.aniVal }
        ]}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}
