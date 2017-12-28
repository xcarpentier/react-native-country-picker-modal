// eslint-disable-next-line
import React from 'react'
// eslint-disable-next-line
import { Image, TouchableNativeFeedback, View, Platform } from 'react-native'
import PropTypes from 'prop-types'

const CloseButton = props => {
  let closeImage = require('./android-close.png')

  if (props.image) closeImage = props.image

  return (
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
}

CloseButton.propTypes = {
  styles: PropTypes.array,
  onPress: PropTypes.func,
  image: PropTypes.any
}

export default CloseButton
