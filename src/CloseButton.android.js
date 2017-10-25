// eslint-disable-next-line
import React from 'react'
// eslint-disable-next-line
import {
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Platform
} from 'react-native'

const styles = StyleSheet.create({
  closeButton: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  }
})

const CloseButton = props => {

  let closeImage = require('./android-close.png');
  if (props.image) closeImage = props.image;
  
  return(
  <View style={props.styles[0]}>
    <TouchableNativeFeedback
      background={
        Platform.Version < 21
          ? TouchableNativeFeedback.SelectableBackground()
          : TouchableNativeFeedback.SelectableBackgroundBorderless()
      }
      onPress={props.onPress}
    >
      <View>
        <Image
          source={closeImage}
          style={props.styles[1]}
        />
      </View>
    </TouchableNativeFeedback>
  </View>
)}

export default CloseButton
