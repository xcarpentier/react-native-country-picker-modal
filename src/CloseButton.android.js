// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import {
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Platform,
} from 'react-native';

import { getWidthPercent } from './ratio';

const styles = StyleSheet.create({
  closeButton: {
    height: 48,
    width: getWidthPercent(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});

const CloseButton = (props) => (
  <View style={styles.closeButton}>
    <TouchableNativeFeedback
      background={
        Platform.Version < 21 ?
        TouchableNativeFeedback.SelectableBackground()
        :
        TouchableNativeFeedback.SelectableBackgroundBorderless()
      }
      {...props}
    >
      <View>
        <Image
          source={require('./android-close.png')}
          style={styles.closeButtonImage}
        />
      </View>
    </TouchableNativeFeedback>
  </View>
);

export default CloseButton;
