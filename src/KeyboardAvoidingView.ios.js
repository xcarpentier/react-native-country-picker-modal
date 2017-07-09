import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const KeyboardAvoidingView = props => (
  <NativeKeyboardAvoidingView
    keyboardVerticalOffset={props.offset || 0}
    behavior="padding"
    {...props}
    style={[styles.container, props.styles]}
  >
    <View style={styles.container}>{props.children}</View>
  </NativeKeyboardAvoidingView>
);

KeyboardAvoidingView.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  styles: PropTypes.array,
};

export default KeyboardAvoidingView;
