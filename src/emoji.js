// @flow
import React from 'react'
import { Text } from 'react-native'
import nodeEmoji from 'node-emoji'
import PropTypes from 'prop-types'

function Emoji({ name }) {
  const emoji = nodeEmoji.get(name)
  return <Text allowFontScaling={false}>{emoji}</Text>
}

Emoji.propTypes = {
  name: PropTypes.string.isRequired
}

export default Emoji
