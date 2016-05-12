'use strict';

var React = require('react-native');
var dimension = React.Dimensions.get('window');
// remove the status bar height since the modal view does not cover this area
if (React.Platform.OS === 'android') {
  dimension.height = dimension.height - 24;
}

class Ratio {
  constructor() {}

  getWidthPercent(percentage) {
    return (dimension.width * percentage) / 100;
  }

  getHeightPercent(percentage) {
    return (dimension.height * percentage) / 100;
  }

  getPercent(percentage) {
    return ((dimension.height + dimension.width) / 2 * percentage) / 100;
  }
}

module.exports = new Ratio();
