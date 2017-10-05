// eslint-disable-next-line
import React from 'react';


// eslint-disable-next-line
import {
  StyleSheet,
  KeyboardAvoidingView as NativeKeyboardAvoidingView,
  View,
} from 'react-native';

let PropTypes = null;

// eslint-disable-next-line
PropTypes = require('prop-types');

if (!PropTypes) {
  PropTypes = React.PropTypes;
}

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
