/**
 * react-native-country-picker
 * @author xcarpentier<contact@xaviercarpentier.com>
 * @flow
 */

// eslint-disable-next-line
import React, { Component } from 'react';
// eslint-disable-next-line
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  ListView,
  Platform,
} from 'react-native';
import _ from 'lodash';

import cca2List from '../data/cca2';
import { getHeightPercent } from './ratio';
import CloseButton from './CloseButton';
import countryPickerStyles from './CountryPicker.style';

let countries = null;
let Emoji = null;
let styles = {};

// Maybe someday android get all flags emoji
// but for now just ios
// const isEmojiable = Platform.OS === 'ios' ||
// (Platform.OS === 'android' && Platform.Version >= 21);
const isEmojiable = Platform.OS === 'ios';

if (isEmojiable) {
  countries = require('../data/countries-emoji');
  Emoji = require('react-native-emoji').default;
} else {
  countries = require('../data/countries');

  Emoji = <View />;
}

export const getAllCountries = () => {
  return cca2List.map((cca2) => {
    return {...countries[cca2], cca2};
  });
};

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: React.PropTypes.string.isRequired,
    translation: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func,
    closeable: React.PropTypes.bool,
    children: React.PropTypes.node,
    countryList: React.PropTypes.array,
    styles: React.PropTypes.object,
  }

  static defaultProps = {
    translation: 'eng',
    countryList: cca2List
  }

  static renderEmojiFlag(cca2, emojiStyle) {
    return (
      <Text style={[styles.emojiFlag, emojiStyle]}>
        { cca2 !== '' ? <Emoji name={countries[cca2].flag} /> : null }
      </Text>
    );
  }

  static renderImageFlag(cca2, imageStyle) {
    return cca2 !== '' ? <Image
      style={[styles.imgStyle, imageStyle]}
      source={{ uri: countries[cca2].flag }}
    /> : null;
  }

  static renderFlag(cca2, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[styles.itemCountryFlag, itemStyle]}>
        {isEmojiable ?
            CountryPicker.renderEmojiFlag(cca2, emojiStyle)
            : CountryPicker.renderImageFlag(cca2, imageStyle)}
      </View>
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      cca2List: props.countryList,
      dataSource: ds.cloneWithRows(cca2List),
    };

    if (this.props.styles) {
      Object.keys(countryPickerStyles).each(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key],
        ]);
      });
      styles = StyleSheet.create(styles);
    } else {
      styles = countryPickerStyles;
    }
  }

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
    });

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2]),
    });
  }

  onClose() {
    this.setState({ modalVisible: false });
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  getCountryName(country, optionalTranslation) {
    const translation = optionalTranslation || this.props.translation || 'eng';
    return country.name[translation] || country.name.common;
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset;
  }

  openModal = this.openModal.bind(this);
  letters = _
    .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
    .map(n => String.fromCharCode(n).substr(0));

  // dimensions of country list and window
  itemHeight = getHeightPercent(7);
  listHeight = countries.length * this.itemHeight;

  openModal() {
    this.setState({ modalVisible: true });
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    const index = this.state.cca2List.map((country) => countries[country].name.common[0])
      .indexOf(letter);
    if (index === -1) {
      return;
    }
    let position = index * this.itemHeight;

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight;
    }

    // scroll
    this._listView.scrollTo({
      y: position,
    });
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(country)}
        activeOpacity={0.99}
      >
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    );
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCountryDetail(cca2) {
    const country = countries[cca2];
    return (
      <View style={styles.itemCountry}>
        {CountryPicker.renderFlag(cca2)}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>
            {this.getCountryName(country)}
          </Text>
        </View>
      </View>
    );
  }



  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {
            this.props.children ?
              this.props.children
            :
              (<View style={styles.touchFlag}>
                {CountryPicker.renderFlag(this.props.cca2)}
              </View>)
          }
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <View style={styles.modalContainer}>
            {
              this.props.closeable &&
                <CloseButton
                  onPress={() => this.onClose()}
                />
            }
            <ListView
              contentContainerStyle={styles.contentContainer}
              ref={listView => this._listView = listView}
              dataSource={this.state.dataSource}
              renderRow={country => this.renderCountry(country)}
              initialListSize={30}
              pageSize={countries.length - 30}
              onLayout={
                ({ nativeEvent: { layout: { y: offset } } }) => this.setVisibleListHeight(offset)
              }
            />
            <View style={styles.letters}>
              {this.letters.map((letter, index) => this.renderLetters(letter, index))}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
