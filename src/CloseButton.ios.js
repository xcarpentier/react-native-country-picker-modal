// @flow
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

const styles = StyleSheet.create({
  closeButton: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonImage: {
    height: 35,
    width: 35,
    resizeMode: 'contain'
  }
})

const CloseButton = props => {

  let closeImage = require('./ios7-close-empty.png');
  if (props.image) closeImage = props.image;

  return(
  <View style={props.styles[0]}>
    <TouchableOpacity onPress={props.onPress}>
      <Image
        source={closeImage}
        style={props.styles[1]}
      />
    </TouchableOpacity>
  </View>
)}

export default CloseButton
