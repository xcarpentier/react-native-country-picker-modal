// eslint-disable-next-line
import React from 'react';

// eslint-disable-next-line
import {
  StyleSheet,
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
  <View {...props} style={[styles.container, props.styles]} />
);

KeyboardAvoidingView.propTypes = {
  offset: PropTypes.number,
  children: PropTypes.node,
  styles: PropTypes.array,
};

export default KeyboardAvoidingView;
