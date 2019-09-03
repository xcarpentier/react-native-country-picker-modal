// @flow
/* eslint import/newline-after-import: 0 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SafeAreaView from 'react-native-safe-area-view'

import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  Platform
} from 'react-native'

import Fuse from 'fuse.js'

import cca2List from '../data/cca2.json'
import { getHeightPercent } from './ratio'
import CloseButton from './CloseButton'
import countryPickerStyles from './CountryPicker.style'
import KeyboardAvoidingView from './KeyboardAvoidingView'

let countries = null
let Emoji = null
let styles = {}

let isEmojiable = Platform.OS === 'ios'

const FLAG_TYPES = {
  flat: 'flat',
  emoji: 'emoji'
}

const setCountries = flagType => {
  if (typeof flagType !== 'undefined') {
    isEmojiable = flagType === FLAG_TYPES.emoji
  }

  if (isEmojiable) {
    countries = require('../data/countries-emoji.json')
    Emoji = require('./emoji').default
  } else {
    countries = require('../data/countries.json')
    Emoji = <View />
  }
}

setCountries()

export const getAllCountries = () =>
  cca2List.map(cca2 => ({ ...countries[cca2], cca2 }))

export default class CountryPicker extends Component {
  static propTypes = {
    cca2: PropTypes.string.isRequired,
    translation: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    closeable: PropTypes.bool,
    filterable: PropTypes.bool,
    children: PropTypes.node,
    countryList: PropTypes.array,
    excludeCountries: PropTypes.array,
    styles: PropTypes.object,
    filterPlaceholder: PropTypes.string,
    autoFocusFilter: PropTypes.bool,
    // to provide a functionality to disable/enable the onPress of Country Picker.
    disabled: PropTypes.bool,
    filterPlaceholderTextColor: PropTypes.string,
    closeButtonImage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    transparent: PropTypes.bool,
    animationType: PropTypes.oneOf(['slide', 'fade', 'none']),
    flagType: PropTypes.oneOf(Object.values(FLAG_TYPES)),
    hideAlphabetFilter: PropTypes.bool,
    hideCountryFlag: PropTypes.bool,
    renderFilter: PropTypes.func,
    showCallingCode: PropTypes.bool,
    filterOptions: PropTypes.object,
    showCountryNameWithFlag: PropTypes.bool
  }

  static defaultProps = {
    translation: 'eng',
    countryList: cca2List,
    hideCountryFlag: false,
    excludeCountries: [],
    filterPlaceholder: 'Filter',
    autoFocusFilter: true,
    transparent: false,
    animationType: 'none'
  }

  static renderEmojiFlag(cca2, emojiStyle) {
    return (
      <Text style={[countryPickerStyles.emojiFlag, emojiStyle]} allowFontScaling={false}>
        {cca2 !== '' && countries[cca2.toUpperCase()] ? (
          <Emoji name={countries[cca2.toUpperCase()].flag} />
        ) : null}
      </Text>
    )
  }

  static renderImageFlag(cca2, imageStyle) {
    return cca2 !== '' ? (
      <Image
        style={[countryPickerStyles.imgStyle, imageStyle]}
        source={{ uri: countries[cca2].flag }}
      />
    ) : null
  }

  static renderFlag(cca2, itemStyle, emojiStyle, imageStyle) {
    return (
      <View style={[countryPickerStyles.itemCountryFlag, itemStyle]}>
        {isEmojiable
          ? CountryPicker.renderEmojiFlag(cca2, emojiStyle)
          : CountryPicker.renderImageFlag(cca2, imageStyle)}
      </View>
    )
  }

  static renderFlagWithName(cca2,countryName, itemStyle, emojiStyle, imageStyle, countryNameStyle) {
    return (
      <View style={{flexDirection:'row', flexWrap:'wrap',alignItems: "center",}}>
        <View style={[countryPickerStyles.itemCountryFlag, itemStyle]}>
          {isEmojiable
            ? CountryPicker.renderEmojiFlag(cca2, emojiStyle)
            : CountryPicker.renderImageFlag(cca2, imageStyle)}

        </View>
        <Text style={[{fontSize:16}, countryNameStyle]}>{countryName}</Text>
      </View>
    )
  }

  constructor(props) {
    super(props)
    this.openModal = this.openModal.bind(this)

    setCountries(props.flagType)
    let countryList = [...props.countryList]
    const excludeCountries = [...props.excludeCountries]

    excludeCountries.forEach(excludeCountry => {
      const index = countryList.indexOf(excludeCountry)

      if (index !== -1) {
        countryList.splice(index, 1)
      }
    })

    // Sort country list
    countryList = countryList
      .map(c => [c, this.getCountryName(countries[c])])
      .sort((a, b) => {
        if (a[1] < b[1]) return -1
        if (a[1] > b[1]) return 1
        return 0
      })
      .map(c => c[0])

    this.state = {
      modalVisible: false,
      cca2List: countryList,
      flatListMap: countryList.map(n => ({ key: n })),
      dataSource: countryList,
      filter: '',
      letters: this.getLetters(countryList)
    }

    if (this.props.styles) {
      Object.keys(countryPickerStyles).forEach(key => {
        styles[key] = StyleSheet.flatten([
          countryPickerStyles[key],
          this.props.styles[key]
        ])
      })
      styles = StyleSheet.create(styles)
    } else {
      styles = countryPickerStyles
    }

    const options = Object.assign({
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ['name'],
      id: 'id'
    }, this.props.filterOptions);
    this.fuse = new Fuse(
      countryList.reduce(
        (acc, item) => [
          ...acc,
          { id: item, name: this.getCountryName(countries[item]) }
        ],
        []
      ),
      options
    )
  }

componentDidUpdate (prevProps) {
    if (prevProps.countryList !== this.props.countryList) {
      this.setState({
        cca2List: nextProps.countryList,
        dataSource: nextProps.countryList
      })
    }
  }

  onSelectCountry(cca2) {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: this.state.cca2List,
      flatListMap: this.state.cca2List.map(n => ({ key: n }))
    })

    this.props.onChange({
      cca2,
      ...countries[cca2],
      flag: undefined,
      name: this.getCountryName(countries[cca2])
    })
  }

  onClose = () => {
    this.setState({
      modalVisible: false,
      filter: '',
      dataSource: this.state.cca2List
    })
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  getCountryName(country, optionalTranslation) {
    if (!country) {
      return ''
    }
    const translation = optionalTranslation || this.props.translation || 'eng'
    return country.name[translation] || country.name.common
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset
  }

  getLetters(list) {
    return Object.keys(
      list.reduce(
        (acc, val) => ({
          ...acc,
          [this.getCountryName(countries[val])
            .slice(0, 1)
            .toUpperCase()]: ''
        }),
        {}
      )
    ).sort()
  }

  openModal = this.openModal.bind(this)

  // dimensions of country list and window
  itemHeight = getHeightPercent(7)
  listHeight = countries.length * this.itemHeight

  openModal() {
    this.setState({ modalVisible: true })
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    const index = this.state.cca2List
      .map(country => this.getCountryName(countries[country])[0])
      .indexOf(letter)
    if (index === -1) {
      return
    }
    let position = index * this.itemHeight

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight
    }

    this._flatList.scrollToIndex({ index });
  }

  handleFilterChange = value => {
    const filteredCountries =
      value === '' ? this.state.cca2List : this.fuse.search(value)
    this._flatList.scrollToOffset({ offset: 0 });

    this.setState({
      filter: value,
      dataSource: filteredCountries,
      flatListMap: filteredCountries.map(n => ({ key: n }))
    })
  }

  renderCountry(cca2, index) {
    const country = countries[cca2];

    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.onSelectCountry(cca2)}
        activeOpacity={0.99}
        testID={`country-selector-${country.name.common}`}
      >
        {this.renderCountryDetail(cca2)}
      </TouchableOpacity>
    )
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        testID={`letter-${letter}`}
        key={index}
        onPress={() => this.scrollTo(letter)}
        activeOpacity={0.6}
      >
        <View style={styles.letter}>
          <Text style={styles.letterText} allowFontScaling={false}>
            {letter}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderCountryDetail(cca2) {
    const country = countries[cca2]
    return (
      <View style={styles.itemCountry}>
        {!this.props.hideCountryFlag &&
          CountryPicker.renderFlag(cca2,
                styles.itemCountryFlag,
                styles.emojiFlag,
                styles.imgStyle)}
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName} allowFontScaling>
            {this.getCountryName(country)}
          </Text>
          {this.props.showCallingCode &&
          country.callingCode &&
          <Text style={styles.countryCode}>{`+${country.callingCode}`}</Text>}
        </View>
      </View>
    )
  }

  renderFilter = () => {
    const {
      renderFilter,
      autoFocusFilter,
      filterPlaceholder,
      filterPlaceholderTextColor
    } = this.props

    const value = this.state.filter
    const onChange = this.handleFilterChange
    const onClose = this.onClose

    return renderFilter ? (
      renderFilter({ value, onChange, onClose })
    ) : (
      <TextInput
        testID="text-input-country-filter"
        autoFocus={autoFocusFilter}
        autoCorrect={false}
        placeholder={filterPlaceholder}
        placeholderTextColor={filterPlaceholderTextColor}
        style={[styles.input, !this.props.closeable && styles.inputOnly]}
        onChangeText={onChange}
        value={value}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          disabled={this.props.disabled}
          onPress={() => this.setState({ modalVisible: true })}
          activeOpacity={0.7}
        >
          {this.props.children ? (
            this.props.children
          ) : (
            <View
              style={[styles.touchFlag, { marginTop: isEmojiable ? 0 : 5 }]}
            >
              {this.props.showCountryNameWithFlag && CountryPicker.renderFlagWithName(this.props.cca2,this.getCountryName(countries[this.props.cca2]),
                styles.itemCountryFlag,
                styles.emojiFlag,
                styles.imgStyle,
                styles.countryNameStyle)}

              {!this.props.showCountryNameWithFlag && CountryPicker.renderFlag(this.props.cca2,
                styles.itemCountryFlag,
                styles.emojiFlag,
                styles.imgStyle)}
            </View>
          )}
        </TouchableOpacity>
        <Modal
          transparent={this.props.transparent}
          animationType={this.props.animationType}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.header}>
              {this.props.closeable && (
                <CloseButton
                  image={this.props.closeButtonImage}
                  styles={[styles.closeButton, styles.closeButtonImage]}
                  onPress={() => this.onClose()}
                />
              )}
              {this.props.filterable && this.renderFilter()}
            </View>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.contentContainer}>
                <FlatList
                  testID="list-countries"
                  keyboardShouldPersistTaps="handled"
                  data={this.state.flatListMap}
                  ref={flatList => (this._flatList = flatList)}
                  initialNumToRender={30}
onScrollToIndexFailed={()=>{}}
                  renderItem={country => this.renderCountry(country.item.key)}
                  keyExtractor={(item) => item.key}
                  getItemLayout={(data, index) => (
                    { length: this.itemHeight, offset: this.itemHeight * index, index }
                  )}
                />
                {!this.props.hideAlphabetFilter && (
                  <ScrollView
                    contentContainerStyle={styles.letters}
                    keyboardShouldPersistTaps="always"
                  >
                    {this.state.filter === '' &&
                      this.state.letters.map((letter, index) =>
                        this.renderLetters(letter, index)
                      )}
                  </ScrollView>
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}
