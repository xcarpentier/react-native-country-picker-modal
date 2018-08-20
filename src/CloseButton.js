// eslint-disable-next-line
import React from 'react'
// eslint-disable-next-line
import { Image, TouchableOpacity, TouchableNativeFeedback, View, Platform } from 'react-native'
import PropTypes from 'prop-types'

const CloseButtonAndroid = (props, closeImage) => (
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
        <Image source={closeImage} style={props.styles[1]} />
      </View>
    </TouchableNativeFeedback>
  </View>
)

const CloseButtonDefault = (props, closeImage) => (
  <View style={props.styles[0]}>
    <TouchableOpacity onPress={props.onPress}>
      <Image source={closeImage} style={props.styles[1]} />
    </TouchableOpacity>
  </View>
)

const CloseButton = props => {
  let closeImage = Platform.select({
    android: require('./android-close.png'),
    default: require('./ios7-close-empty.png')
  })

  if (props.image) closeImage = props.image

  return Platform.select({
    android: CloseButtonAndroid(props, closeImage),
    default: CloseButtonDefault(props, closeImage)
  })
}

CloseButton.propTypes = {
  styles: PropTypes.array,
  onPress: PropTypes.func,
  image: PropTypes.any
}

CloseButtonAndroid.propTypes = CloseButton.propTypes
CloseButtonDefault.propTypes = CloseButton.propTypes

export default CloseButton
