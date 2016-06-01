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
    // dimensions of country list and window
    const itemHeight = Ratio.getHeightPercent(7);
    const listPadding = Ratio.getPercent(2);
    const listHeight = countries.length * itemHeight + 2 * listPadding;
    const windowHeight = Ratio.getHeightPercent(100);

    // find position of first country that starts with letter
    const index = this._orderCountryList().map((country) => {
      return this._getCountryName(country)[0];
    }).indexOf(letter);
    if (index === -1) {
      return;
    }
    let position = index * itemHeight + listPadding;

    // do not scroll past the end of the list
    if (position + windowHeight > listHeight) {
      position = listHeight - windowHeight;
    }

    // scroll
    this._scrollView.scrollTo({
      y: position
    });
  }

  _renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this._onSelect(country)}
        activeOpacity={0.99}>
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
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}
        >
          <ListView
            contentContainerStyle={styles.contentContainer}
            ref={(scrollView) => { this._scrollView = scrollView; }}
            dataSource={this.state.countries}
            renderRow={(country) => this._renderCountry(country)}
            initialListSize={20}
            pageSize={countries.length - 20}
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
    resizeMode: 'contain',
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
