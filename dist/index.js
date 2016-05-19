'use strict';

/**
 * react-native-country-picker
 * @author xcarpentier<contact@xaviercarpentier.com>
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _worldCountries = require('world-countries');

var _worldCountries2 = _interopRequireDefault(_worldCountries);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _CountryFlags = require('./CountryFlags');

var _CountryFlags2 = _interopRequireDefault(_CountryFlags);

var _Ratio = require('./Ratio');

var _Ratio2 = _interopRequireDefault(_Ratio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CountryPicker = function (_Component) {
  _inherits(CountryPicker, _Component);

  function CountryPicker(props) {
    _classCallCheck(this, CountryPicker);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CountryPicker).call(this, props));

    var ds = new _reactNative.ListView.DataSource({ rowHasChanged: function rowHasChanged(r1, r2) {
        return r1 !== r2;
      } });
    _this.state = {
      cca2: props.cca2,
      currentCountry: _this._getCountry(props.cca2),
      modalVisible: false,
      countries: ds.cloneWithRows(_this._orderCountryList())
    };
    _this.letters = _lodash2.default.range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1).map(function (n) {
      return String.fromCharCode(n).substr(0);
    });
    _this.lettersPositions = {};
    return _this;
  }

  _createClass(CountryPicker, [{
    key: '_getCountry',
    value: function _getCountry(cca2) {
      return _lodash2.default.find(_worldCountries2.default, {
        cca2: cca2
      });
    }
  }, {
    key: '_getCountryName',
    value: function _getCountryName(country) {
      var translation = this.props.translation || 'eng';
      return country.translations[translation] && country.translations[translation].common || country.name.common;
      xrg;
    }
  }, {
    key: '_orderCountryList',
    value: function _orderCountryList() {
      var _this2 = this;

      return (0, _lodash2.default)(_worldCountries2.default).map(function (n) {
        return {
          cca2: n.cca2,
          callingCode: n.callingCode,
          translations: n.translations,
          name: n.name
        };
      }).sortBy(function (n) {
        return _lodash2.default.deburr(_this2._getCountryName(n));
      }).value();
    }
  }, {
    key: '_onSelect',
    value: function _onSelect(country) {

      this.setState({
        modalVisible: false,
        cca2: country.cca2
      });

      if (this.props.onChange) {
        this.props.onChange({
          cca2: country.cca2,
          callingCode: country.callingCode[0],
          name: this._getCountryName(country)
        });
      }
    }
  }, {
    key: '_scrollTo',
    value: function _scrollTo(letter) {
      if (letter === 'A') {
        this._scrollView.scrollTo({
          y: 0
        });
      } else if (letter > 'U') {
        this._scrollView.scrollTo({
          y: this.lettersPositions['Z'] - _Ratio2.default.getHeightPercent(85)
        });
      } else {
        this._scrollView.scrollTo({
          y: this.lettersPositions[letter]
        });
      }
    }
  }, {
    key: '_updateLetterPosition',
    value: function _updateLetterPosition(countryName, position_y) {

      var firstLetter = countryName.substr(0, 1);

      if (!this.lettersPositions[firstLetter] || this.lettersPositions[firstLetter] && this.lettersPositions[firstLetter] > position_y) {
        this.lettersPositions[firstLetter] = position_y;
      }
    }
  }, {
    key: '_renderCountry',
    value: function _renderCountry(country, index) {
      var _this3 = this;

      return _react2.default.createElement(
        _reactNative.TouchableOpacity,
        {
          key: index,
          onPress: function onPress() {
            return _this3._onSelect(country);
          },
          activeOpacity: 0.99,
          onLayout: function onLayout(e) {
            return _this3._updateLetterPosition(_this3._getCountryName(country), e.nativeEvent.layout.y);
          } },
        this._renderCountryDetail(country)
      );
    }
  }, {
    key: '_renderLetters',
    value: function _renderLetters(letter, index) {
      var _this4 = this;

      return _react2.default.createElement(
        _reactNative.TouchableOpacity,
        {
          key: index,
          onPress: function onPress() {
            return _this4._scrollTo(letter);
          },
          activeOpacity: 0.6 },
        _react2.default.createElement(
          _reactNative.View,
          { style: styles.letter },
          _react2.default.createElement(
            _reactNative.Text,
            { style: styles.letterText },
            letter
          )
        )
      );
    }
  }, {
    key: '_renderCountryDetail',
    value: function _renderCountryDetail(country) {
      return _react2.default.createElement(
        _reactNative.View,
        { style: styles.itemCountry },
        _react2.default.createElement(
          _reactNative.View,
          { style: styles.itemCountryFlag },
          _react2.default.createElement(_reactNative.Image, {
            style: styles.imgStyle,
            source: { uri: _CountryFlags2.default[country.cca2] } })
        ),
        _react2.default.createElement(
          _reactNative.View,
          { style: styles.itemCountryName },
          _react2.default.createElement(
            _reactNative.Text,
            { style: styles.countryName },
            this._getCountryName(country)
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        _reactNative.View,
        null,
        _react2.default.createElement(
          _reactNative.TouchableOpacity,
          {
            onPress: function onPress() {
              return _this5.setState({ modalVisible: true });
            },
            activeOpacity: 0.7 },
          _react2.default.createElement(
            _reactNative.View,
            { style: styles.touchFlag },
            _react2.default.createElement(_reactNative.Image, {
              style: styles.imgStyle,
              source: { uri: _CountryFlags2.default[this.state.cca2] } })
          )
        ),
        _react2.default.createElement(
          _reactNative.Modal,
          { visible: this.state.modalVisible },
          _react2.default.createElement(_reactNative.ListView, {
            contentContainerStyle: styles.contentContainer,
            ref: function ref(scrollView) {
              _this5._scrollView = scrollView;
            },
            dataSource: this.state.countries,
            renderRow: function renderRow(country) {
              return _this5._renderCountry(country);
            }
          }),
          _react2.default.createElement(
            _reactNative.View,
            { style: styles.letters },
            _lodash2.default.map(this.letters, function (letter, index) {
              return _this5._renderLetters(letter, index);
            })
          )
        )
      );
    }
  }]);

  return CountryPicker;
}(_react.Component);

var styles = _reactNative.StyleSheet.create({
  contentContainer: {
    width: _Ratio2.default.getWidthPercent(100),
    backgroundColor: '#fff',
    padding: _Ratio2.default.getPercent(2)
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: _Ratio2.default.getPercent(0.5),
    width: _Ratio2.default.getWidthPercent(5.5),
    height: _Ratio2.default.getHeightPercent(2.5)
  },
  imgStyle: {
    resizeMode: 'stretch',
    width: 25,
    height: 19,
    borderWidth: 1 / _reactNative.PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  currentCountry: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2 / _reactNative.PixelRatio.get(),
    borderBottomColor: '#000'
  },
  itemCountry: {
    flexDirection: 'row',
    height: _Ratio2.default.getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemCountrySelect: {
    height: _Ratio2.default.getHeightPercent(9)
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: _Ratio2.default.getHeightPercent(7),
    width: _Ratio2.default.getWidthPercent(15)
  },
  itemCountryFlagSelect: {
    width: _Ratio2.default.getWidthPercent(33)
  },
  itemCountryName: {
    justifyContent: 'center',
    width: _Ratio2.default.getWidthPercent(70),
    borderBottomWidth: 1 / _reactNative.PixelRatio.get(),
    borderBottomColor: '#ccc',
    height: _Ratio2.default.getHeightPercent(7)
  },
  itemCountryNameSelect: {
    width: _Ratio2.default.getWidthPercent(35),
    borderBottomWidth: 0
  },
  countryName: {
    fontSize: _Ratio2.default.getHeightPercent(2.2)
  },
  letters: {
    position: 'absolute',
    height: _Ratio2.default.getHeightPercent(100),
    top: 0,
    bottom: 0,
    right: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    height: _Ratio2.default.getHeightPercent(3.3),
    width: _Ratio2.default.getWidthPercent(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: _Ratio2.default.getHeightPercent(2.2)
  }
});

module.exports = CountryPicker;