<p align="center">
    <img alt="react-native-country-picker-modal" src="https://thumbs.gfycat.com/HandsomeInnocentAnura-size_restricted.gif" width=150>
</p>

<h3 align="center">
  The best Country Picker for React Native.
</h3>

<p align="center">
  <a href="https://reactnative.gallery"><img src="https://img.shields.io/badge/reactnative.gallery-%E2%99%A5-red.svg"></a>
  <a href="https://www.npmjs.com/package/react-native-country-picker-modal"><img src="https://img.shields.io/npm/v/react-native-country-picker-modal.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/react-native-country-picker-modal"><img src="https://img.shields.io/npm/dm/react-native-country-picker-modal.svg?style=flat-square"></a>
  <a href="https://codecov.io/gh/xcarpentier/react-native-country-picker-modal"><img src="https://codecov.io/gh/xcarpentier/react-native-country-picker-modal/coverage.svg"></a>
  <a href="https://circleci.com/gh/xcarpentier/react-native-country-picker-modal"><img src="https://circleci.com/gh/xcarpentier/react-native-country-picker-modal.svg?style=svg"></a>
</p>

<p align="center">
  <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://exp.host/@xcarpentier/react-native-country-picker-modal">
  <br>
  <a href="https://exp.host/@xcarpentier/react-native-country-picker-modal">Demo on Expo</a>
</p>

<br />

## Installation

```bash
$ yarn add react-native-country-picker-modal
```

## Basic Usage

```jsx
import DeviceInfo from 'react-native-device-info'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
  PixelRatio
} from 'react-native'
import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal'

const NORTH_AMERICA = ['CA', 'MX', 'US']

class Example extends Component {
  constructor(props) {
    StatusBarIOS.setHidden(true)
    super(props)
    let userLocaleCountryCode = DeviceInfo.getDeviceCountry()
    const userCountryData = getAllCountries()
      .filter(country => NORTH_AMERICA.includes(country.cca2))
      .filter(country => country.cca2 === userLocaleCountryCode)
      .pop()
    let callingCode = null
    let cca2 = userLocaleCountryCode
    if (!cca2 || !userCountryData) {
      cca2 = 'US'
      callingCode = '1'
    } else {
      callingCode = userCountryData.callingCode
    }
    this.state = {
      cca2,
      callingCode
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to Country Picker !</Text>
        <CountryPicker
          countryList={NORTH_AMERICA}
          onChange={value => {
            this.setState({ cca2: value.cca2, callingCode: value.callingCode })
          }}
          cca2={this.state.cca2}
          translation="eng"
        />
        <Text style={styles.instructions}>press on the flag</Text>
        {this.state.country && (
          <Text style={styles.data}>
            {JSON.stringify(this.state.country, null, 2)}
          </Text>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginBottom: 5
  },
  data: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777'
  }
})

AppRegistry.registerComponent('example', () => Example)
```

## Dark theme example
<p align="center">
    <img alt="react-native-country-picker-modal-dark" src="https://user-images.githubusercontent.com/2692166/40585272-094f817a-61b0-11e8-9668-abff0aeddb0e.png" width=150>
</p>

A simple example to display a `CountryPicker` component with a dark theme. You need to download a light colored image for the close button, for example [this one](https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/VisualEditor_-_Icon_-_Close_-_white.svg/240px-VisualEditor_-_Icon_-_Close_-_white.svg.png).
```jsx
import CountryPicker from 'react-native-country-picker-modal'

// change the import path according to your project structure
import closeImgLight from "/asset/iconWhite.png";

const DARK_COLOR = "#18171C";
const PLACEHOLDER_COLOR = "rgba(255,255,255,0.2)";
const LIGHT_COLOR = "#FFF";


export default (props) => (
  <CountryPicker
    filterPlaceholderTextColor={PLACEHOLDER_COLOR}
    closeButtonImage={closeImgLight}
    styles={darkTheme}
    {...props}
  />
);


const darkTheme = StyleSheet.create({
 modalContainer: {
    backgroundColor: DARK_COLOR
  },
  contentContainer: {
    backgroundColor: DARK_COLOR
  },
  header: {
    backgroundColor: DARK_COLOR
  },
  itemCountryName: {
    borderBottomWidth: 0
  },
  countryName: {
    color: LIGHT_COLOR
  },
  letterText: {
    color: LIGHT_COLOR
  },
  input: {
    color: LIGHT_COLOR,
    borderBottomWidth: 1,
    borderColor: LIGHT_COLOR
  }
});
```

## Props

| Key               | Type     | Default                                                                                                      | Description                                                                                                                           |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| cca2              | string   | \*required                                                                                                   | code ISO 3166-1 alpha-2 (ie. FR, US, etc.)                                                                                            |
| translation       | string   | 'eng'                                                                                                        | The language display for the name of the country (deu, fra, hrv, ita, jpn, nld, por, rus, spa, svk, fin, zho, cym)                    |
| onChange          | function | \*required                                                                                                   | The handler when a country is selected                                                                                                |
| onClose           | function | \*required                                                                                                   | The handler when the close button is clicked                                                                                          |
| countryList       | array    | See [cca2.json](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/data/cca2.json) | List of custom CCA2 countries to render in the list. Use getAllCountries to filter what you need if you want to pass in a custom list |
| excludeCountries  | array    | []                                                                                                           | List of custom CCA2 countries you don't want to render                                                                                |
| closeable         | bool     | false                                                                                                        | If true, the CountryPicker will have a close button                                                                                   |
| filterable        | bool     | false                                                                                                        | If true, the CountryPicker will have search bar                                                                                       |
| filterPlaceholder | string   | 'Filter'                                                                                                     | The search bar placeholder                                                                                                            |
| filterPlaceholderTextColor | string   | undefined                                                                                                    | The search bar placeholder text color                                                                                                           |
| autoFocusFilter   | bool     | true                                                                                                         | Whether or not the search bar should be autofocused                                                                                   |
| styles            | object   | {}                                                                                                           | Override any style specified in the component (see source code)                                                                       |
| disabled          | bool     | false                                                                                                        | Whether or not the Country Picker onPress is disabled                                                                                 |
| transparent        | bool     | false                                                                                                        | If true, the CountryPicker will render the modal over a transparent background                                                        |
| animationType     | string   |'none'                                                                                                        | The handler that controls how the modal animates                                                                                      |
| closeButtonImage  | React.element| default close button Image                                                                               | Custom close button Image
| flagType  | string | 'emoji' on iOS, 'flat' on Android | If set, overwrites the default OS based flag type.
| hideAlphabetFilter  | bool | false | If set to true, prevents the alphabet filter rendering
| showCallingCode | bool | false | If set to true, Country Picker List will show calling code after country name `United States (+1)`
| renderFilter  | Function | undefined | If 'filterable={true}' and renderFilter function is provided, render custom filter component.\*

\* 
```js
renderFilter = ({value, onChange, onClose}) => (
  <CustomFilterComponent
     value={value}
     onChange={onChange}
     onClose={onClose} 
   />
)
```
## Dependencies

* world-countries : https://www.npmjs.com/package/world-countries

## FAQ

### Is it supported and tested both on android and iOS?

YES

### Is the data that is populated inside the list saved offline once I install your package?

YES : It used the world-countries package and image is stored into json and base64.

## Tiers lib using this lib

* [react-native-phone-verification](https://github.com/joinspontaneous/react-native-phone-verification)

[> Your project?](https://github.com/xcarpentier/react-native-linkedin/issues/new)

## See also

* [react-native-linkedin](https://github.com/xcarpentier/react-native-linkedin)

## Contribution

* [@xcapentier](mailto:contact@xaviercarpentier.com) The main author.

## Questions

Feel free to [contact me](mailto:contact@xaviercarpentier.com) or [create an issue](https://github.com/xcarpentier/react-native-country-picker/issues/new)

> made with ♥

## Licence

[MIT](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/LICENSE.md)
