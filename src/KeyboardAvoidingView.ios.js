import React from 'react';

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
  offset: React.PropTypes.number,
  children: React.PropTypes.node,
  styles: React.PropTypes.array,
};

export default KeyboardAvoidingView;
