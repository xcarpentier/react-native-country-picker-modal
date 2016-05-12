'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var React = require('react-native');
var dimension = React.Dimensions.get('window');
// remove the status bar height since the modal view does not cover this area
if (React.Platform.OS === 'android') {
  dimension.height = dimension.height - 24;
}

var Ratio = function () {
  function Ratio() {
    _classCallCheck(this, Ratio);
  }

  _createClass(Ratio, [{
    key: 'getWidthPercent',
    value: function getWidthPercent(percentage) {
      return dimension.width * percentage / 100;
    }
  }, {
    key: 'getHeightPercent',
    value: function getHeightPercent(percentage) {
      return dimension.height * percentage / 100;
    }
  }, {
    key: 'getPercent',
    value: function getPercent(percentage) {
      return (dimension.height + dimension.width) / 2 * percentage / 100;
    }
  }]);

  return Ratio;
}();

module.exports = new Ratio();