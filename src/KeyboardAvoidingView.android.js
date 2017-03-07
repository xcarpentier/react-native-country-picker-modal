import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const KeyboardAvoidingView = props => (
  <View {...props} style={[styles.container, props.styles]} />
);

KeyboardAvoidingView.propTypes = {
  offset: React.PropTypes.number,
  children: React.PropTypes.node,
  styles: React.PropTypes.array,
};

export default KeyboardAvoidingView;
