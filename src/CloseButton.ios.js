// eslint-disable-next-line
import React from 'react';
// eslint-disable-next-line
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
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
    height: 35,
    width: 35,
    resizeMode: 'contain',
  },
});

const CloseButton = (props) => (
  <View style={styles.closeButton}>
    <TouchableOpacity
      {...props}
    >
      <Image
        source={require('./ios7-close-empty.png')}
        style={styles.closeButtonImage}
      />
    </TouchableOpacity>
  </View>
);


export default CloseButton;
