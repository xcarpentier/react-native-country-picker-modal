import React from 'react'
import {
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const KeyboardViewDefault = props => (
  <View {...props} style={[styles.container, props.styles]} />
)

const KeyboardViewIos = props => (
  <NativeKeyboardAvoidingView
    keyboardVerticalOffset={props.offset || 0}
    behavior="padding"
    {...props}
    style={[styles.container, props.styles]}
  >
    <View style={styles.container}>{props.children}</View>
  </NativeKeyboardAvoidingView>
)

const KeyboardAvoidingView = props => Platform.select({
  ios: KeyboardViewIos(props),
  default: KeyboardViewDefault(props),
})

KeyboardAvoidingView.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  styles: PropTypes.array
}

KeyboardViewDefault.propTypes = KeyboardAvoidingView.propTypes
KeyboardViewIos.propTypes = KeyboardAvoidingView.propTypes

export default KeyboardAvoidingView
