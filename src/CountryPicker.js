/**
 * react-native-country-picker
 * @author xcarpentier<contact@xaviercarpentier.com>
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, PixelRatio, Image, TouchableOpacity, Modal,
  Text, ListView,
} from 'react-native';
import countries from 'world-countries';
import _ from 'lodash';

import CountryFlags from './countryFlags';
import { getWidthPercent, getHeightPercent, getPercent } from './ratio';
import CloseButton from './CloseButton';

class CountryPicker extends Component {

  constructor(props) {
    super(props);
    this._openModal = this._openModal.bind(this);
    this.letters = _
      .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
      .map(n => String.fromCharCode(n).substr(0));

    // dimensions of country list and window
    this.itemHeight = getHeightPercent(7);
    this.listHeight = countries.length * this.itemHeight;


    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      modalVisible: false,
      dataSource: ds.cloneWithRows(this.orderCountryList())
    };
  }

  getCountry({ cca2 }) {
    return _.find(countries, {
      cca2
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.translation !== nextProps.translation) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.orderCountryList(nextProps.translation))
      });
    }
  }

  getCountryName(country, optionalTranslation) {
    const translation = optionalTranslation || this.props.translation || 'eng';
    return (
      country.translations[translation] &&
      country.translations[translation].common
    ) || country.name.common;
  }

  orderCountryList(optionalTranslation) {
    return _(countries)
      .map(country => _.pick(
        country,
        ['cca2', 'callingCode', 'translations', 'name', 'currency'])
      )
      .sortBy(n => _.deburr(this.getCountryName(n, optionalTranslation)))
      .value();
  }

  onSelect(country) {

    this.setState({
      modalVisible: false,
    });

    this.props.onChange({
      cca2: country.cca2,
      callingCode: country.callingCode[0],
      name: this.getCountryName(country),
      currency: country.currency
    });
  }

  setVisibleListHeight(offset) {
    this.visibleListHeight = getHeightPercent(100) - offset;
  }

  scrollTo(letter) {
    // find position of first country that starts with letter
    const index = this.orderCountryList().map((country) => {
      return this.getCountryName(country)[0];
    }).indexOf(letter);
    if (index === -1) {
      return;
    }
    let position = index * this.itemHeight;

    // do not scroll past the end of the list
    if (position + this.visibleListHeight > this.listHeight) {
      position = this.listHeight - this.visibleListHeight;
    }

    // scroll
    this._scrollView.scrollTo({
      y: position
    });
  }

  renderCountry(country, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this.onSelect(country)}
        activeOpacity={0.99}>
        {this.renderCountryDetail(country)}
      </TouchableOpacity>
    );
  }

  renderLetters(letter, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={()=> this.scrollTo(letter)}
        activeOpacity={0.6}>
        <View style={styles.letter}>
          <Text style={styles.letterText}>{letter}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderCountryDetail(country) {
    return (
      <View style={styles.itemCountry}>
        <View style={styles.itemCountryFlag}>
          <Image
            style={styles.imgStyle}
            source={{uri: CountryFlags[country.cca2]}}/>
        </View>
        <View style={styles.itemCountryName}>
          <Text style={styles.countryName}>
            {this.getCountryName(country)}
          </Text>
        </View>
      </View>
    );
  }

  _openModal() {
    this.setState({modalVisible: true});
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
              source={{uri: CountryFlags[this.props.cca2]}}/>
          </View>
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <View style={styles.modalContainer}>
            {
              this.props.closeable &&
              <CloseButton onPress={() => this.setState({modalVisible: false})} />
            }
            <ListView
              contentContainerStyle={styles.contentContainer}
              ref={scrollView => { this._scrollView = scrollView; }}
              dataSource={this.state.dataSource}
              renderRow={country => this.renderCountry(country)}
              initialListSize={20}
              pageSize={countries.length - 20}
              onLayout={({nativeEvent: { layout: { y: offset} }}) => this.setVisibleListHeight(offset)}
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

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    width: getWidthPercent(100),
    height: getHeightPercent(100),
  },
  contentContainer: {
    width: getWidthPercent(100),
    backgroundColor: 'white'
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: getPercent(0.5),
    width: getWidthPercent(5.5),
    height: getHeightPercent(2.5)
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(7),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: getHeightPercent(7),
    width: getWidthPercent(15)
  },
  itemCountryName: {
    justifyContent: 'center',
    width: getWidthPercent(70),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#ccc',
    height: getHeightPercent(7)
  },
  countryName: {
    fontSize: getHeightPercent(2.2)
  },
  letters: {
    position: 'absolute',
    height: getHeightPercent(100),
    top: 0,
    bottom: 0,
    right: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    height: getHeightPercent(3.3),
    width: getWidthPercent(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: getHeightPercent(2.2)
  }
});

CountryPicker.propTypes = {
  cca2: React.PropTypes.string.isRequired,
  translation: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  closeable: React.PropTypes.bool,
};

CountryPicker.defaultProps = {
  translation: 'eng',
};

module.exports = CountryPicker;
