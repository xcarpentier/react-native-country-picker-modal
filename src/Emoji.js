import React from 'react';
import { Text } from 'react-native';
import nodeEmoji from 'node-emoji';
import PropTypes from 'prop-types';

class Emoji extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  }

  render() {
    const emoji = nodeEmoji.get(this.props.name);
    return (<Text>{ emoji }</Text>);
  }
}

export default Emoji;
