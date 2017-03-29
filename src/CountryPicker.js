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
  TextInput,
  ListView,
  ScrollView,
  Platform,
} from 'react-native';
import Fuse from 'fuse.js';

import cca2List from '../data/cca2';
import { getHeightPercent } from './ratio';
import CloseButton from './CloseButton';
import countryPickerStyles from './CountryPicker.style';
import KeyboardAvoidingView from './KeyboardAvoidingView';

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

export const getAllCountries = () => cca2List.map((cca2) => ({ ...countries[cca2], cca2 }));

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: React.PropTypes.string.isRequired,
    translation: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onClose: React.PropTypes.func,
    closeable: React.PropTypes.bool,
    filterable: React.PropTypes.bool,
    children: React.PropTypes.node,
    countryList: React.PropTypes.array,
    styles: React.PropTypes.object,
    filterPlaceholder: React.PropTypes.string,
    autoFocusFilter: React.PropTypes.bool,
  }

  static defaultProps = {
    translation: 'eng',
    countryList: cca2List,
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
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
      dataSource: ds.cloneWithRows(props.countryList),
      filter: '',
      letters: this.getLetters(props.countryList),
    };

    if (this.props.styles) {
      Object.keys(countryPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key],
        ]);
      });
      styles = StyleSheet.create(styles);
    } else {
      styles = countryPickerStyles;
    }

    this.fuse = new Fuse(
      props.countryList.reduce(
        (acc, item) => [...acc, { id: item, name: this.getCountryName(countries[item]) }],
        [],
      ), {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: ['name'],
        id: 'id',
      }
    );
  }

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: ds.cloneWithRows(this.state.cca2List),
    });

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2]),
    });
  }

  onClose() {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: ds.cloneWithRows(this.state.cca2List),
    });
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

  getLetters(list) {
    return Object.keys(list.reduce((acc, val) => ({
      ...acc,
      [this.getCountryName(countries[val]).slice(0, 1).toUpperCase()]: '',
    }), {})).sort();
  }

  openModal = this.openModal.bind(this);

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

  handleFilterChange = (value) => {
    const filteredCountries = value === '' ? this.state.cca2List : this.fuse.search(value);

    this._listView.scrollTo({ y: 0 });

    this.setState({
      filter: value,
      dataSource: ds.cloneWithRows(filteredCountries),
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
            <View style={styles.header}>
              {
                this.props.closeable &&
                  <CloseButton
                    onPress={() => this.onClose()}
                  />
              }
              {
                this.props.filterable &&
                  <TextInput
                    autoFocus={this.props.autoFocusFilter}
                    autoCorrect={false}
                    placeholder={this.props.filterPlaceholder}
                    style={[styles.input, !this.props.closeable && styles.inputOnly]}
                    onChangeText={this.handleFilterChange}
                    value={this.state.filter}
                  />
              }
            </View>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.contentContainer}>
                <ListView
                  keyboardShouldPersistTaps="always"
                  enableEmptySections
                  ref={listView => this._listView = listView}
                  dataSource={this.state.dataSource}
                  renderRow={country => this.renderCountry(country)}
                  initialListSize={30}
                  pageSize={15}
                  onLayout={
                    (
                      { nativeEvent: { layout: { y: offset } } }
                    ) => this.setVisibleListHeight(offset)
                  }
                />
                <ScrollView
                  contentContainerStyle={styles.letters}
                  keyboardShouldPersistTaps="always"
                >
                  {
                    this.state.filter === '' &&
                    this.state.letters.map((letter, index) => this.renderLetters(letter, index))
                  }
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </View>
    );
  }
}
