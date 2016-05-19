'use strict';

/**
 * react-native-country-picker
 * @author xcarpentier<contact@xaviercarpentier.com>
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  PixelRatio,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Text,
  ListView
} from 'react-native';
import countries from 'world-countries';
import _ from 'lodash';
import CountryFlags from './CountryFlags';
import Ratio from './Ratio';

class CountryPicker extends Component {

  constructor(props) {
    super(props);
    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      cca2: props.cca2,
      currentCountry: this._getCountry(props.cca2),
      modalVisible: false,
      countries: ds.cloneWithRows(this._orderCountryList())
    };
    this.letters = _.range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1).map(n => String.fromCharCode(n).substr(0));
    this.lettersPositions = {};
  }

  _getCountry(cca2) {
    return _.find(countries, {
      cca2: cca2
    });
  }

  _getCountryName(country) {
    let translation = this.props.translation || 'eng';
    return (country.translations[translation] && country.translations[translation].common) || country.name.common;
    xrg
  }

  _orderCountryList() {
    return _(countries)
      .map(n => {
        return {
          cca2: n.cca2,
          callingCode: n.callingCode,
          translations: n.translations,
          name: n.name
        };
      })
      .sortBy(n => _.deburr(this._getCountryName(n))).value();
  }

  _onSelect(country) {

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

  _scrollTo(letter) {
    if (letter === 'A') {
      this._scrollView.scrollTo({
        y: 0
      });
    } else if (letter > 'U') {
      this._scrollView.scrollTo({
        y: this.lettersPositions['Z'] - Ratio.getHeightPercent(85)
      });
    } else {
      this._scrollView.scrollTo({
        y: this.lettersPositions[letter]
      });
    }

  }

  _updateLetterPosition(countryName, position_y) {

    let firstLetter = countryName.substr(0, 1);

    if (!this.lettersPositions[firstLetter] ||
      (
        this.lettersPositions[firstLetter] &&
        this.lettersPositions[firstLetter] > position_y)
    ) {
      this.lettersPositions[firstLetter] = position_y;
    }
  }

  _renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this._onSelect(country)}
        activeOpacity={0.99}
        onLayout={ e => this._updateLetterPosition(this._getCountryName(country), e.nativeEvent.layout.y) }>
        {this._renderCountryDetail(country)}
    </TouchableOpacity>);
  }

  _renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this._scrollTo(letter)}
        activeOpacity={0.6}>
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  _renderCountryDetail(country) {
    return (
      <View style={styles.itemCountry}>
        <View style={styles.itemCountryFlag}>
          <Image
            style={styles.imgStyle}
            source={{uri: CountryFlags[country.cca2]}}/>
        </View>
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>
            {this._getCountryName(country)}
          </Text>
        </View>
      </View>);
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={()=> this.setState({modalVisible: true})}
          activeOpacity={0.7}>
          <View style={styles.touchFlag}>
            <Image
              style={styles.imgStyle}
              source={{uri: CountryFlags[this.state.cca2]}}/>
          </View>
        </TouchableOpacity>
        <Modal visible={this.state.modalVisible}>
          {/*<ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollsToTop={true}>
            {_.map(this.state.countries, (country, index) => this._renderCountry(country, index))}
          </ScrollView>*/}
          <ListView
            contentContainerStyle={styles.contentContainer}
            ref={(scrollView) => { this._scrollView = scrollView; }}
            dataSource={this.state.countries}
            renderRow={(country) => this._renderCountry(country)}
          />
          <View style={styles.letters}>
            {_.map(this.letters, (letter, index) => this._renderLetters(letter, index))}
          </View>
        </Modal>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  contentContainer: {
    width: Ratio.getWidthPercent(100),
    backgroundColor: '#fff',
    padding: Ratio.getPercent(2)
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: Ratio.getPercent(0.5),
    width: Ratio.getWidthPercent(5.5),
    height: Ratio.getHeightPercent(2.5)
  },
  imgStyle: {
    resizeMode: 'stretch',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  currentCountry: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2 / PixelRatio.get(),
    borderBottomColor: '#000'
  },
  itemCountry: {
    flexDirection: 'row',
    height: Ratio.getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemCountrySelect: {
    height: Ratio.getHeightPercent(9)
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Ratio.getHeightPercent(7),
    width: Ratio.getWidthPercent(15)
  },
  itemCountryFlagSelect: {
    width: Ratio.getWidthPercent(33)
  },
  itemCountryName: {
    justifyContent: 'center',
    width: Ratio.getWidthPercent(70),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
    height: Ratio.getHeightPercent(7)
  },
  itemCountryNameSelect: {
    width: Ratio.getWidthPercent(35),
    borderBottomWidth: 0
  },
  countryName: {
    fontSize: Ratio.getHeightPercent(2.2)
  },
  letters: {
    position: 'absolute',
    height: Ratio.getHeightPercent(100),
    top: 0,
    bottom: 0,
    right: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    height: Ratio.getHeightPercent(3.3),
    width: Ratio.getWidthPercent(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: Ratio.getHeightPercent(2.2)
  }
});

module.exports = CountryPicker;
