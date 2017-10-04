import React from 'react';
import { Text } from 'react-native';
import nodeEmoji from 'node-emoji';

PropTypes = require('prop-types');

if (!PropTypes) {
  PropTypes = React.PropTypes;
}

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
