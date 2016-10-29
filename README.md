[![Downloads](https://img.shields.io/npm/dm/react-native-country-picker-modal.svg)](https://www.npmjs.com/package/react-native-country-picker-modal)

[**Support me with a Follow**](https://github.com/xcarpentier/followers)

# react-native-country-picker-modal

The best Country Picker for React Native.

[**Demo on Exponent**](https://getexponent.com/@xcarpentier/react-native-country-picker-demo)

| iOS | Android |
| --------|---------|
|![](http://i.giphy.com/l2SpOUptMAEXW2jqU.gif)|![](http://i.giphy.com/26ufd30pDhSeEbIwE.gif)|
## Installation
```bash
$ npm i react-native-country-picker-modal --save
```
or
```bash
$ yarn add react-native-country-picker-modal
```
## Basic Usage
- Install `react-native` first

```bash
$ npm i react-native -g
```

- Initialization of a react-native project

```bash
$ react-native init myproject
```

- Then, edit `myproject/index.ios.js`, like this:

```javascript

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  StatusBarIOS,
  PixelRatio
} from 'react-native';

import CountryPicker from 'react-native-country-picker-modal';

class Example extends Component {
  constructor(props){
    StatusBarIOS.setHidden(true);
    super(props);
    this.state = {
      cca2: 'US'
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Country Picker !
        </Text>
        <CountryPicker
          onChange={(value)=> this.setState({country: value, cca2: value.cca2})}
          cca2={this.state.cca2}
          translation='eng'
        />
        <Text style={styles.instructions}>
          press on the flag
        </Text>
        {this.state.country &&
          <Text style={styles.data}>
            {JSON.stringify(this.state.country, null, 2)}
          </Text>
        }
      </View>
    );
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
    margin: 10,
  },
  instructions: {
    fontSize: 12,
    textAlign: 'center',
    color: '#888',
    marginBottom: 5,
  },
  data: {
    padding: 15,
    marginTop: 10,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777'
  }
});

AppRegistry.registerComponent('example', () => Example);
```

## Props

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| cca2 | string | \*required | code ISO 3166-1 alpha-2 (ie. FR, US, etc.)|
| translation | string | 'eng' | The language display for the name of the country (deu, fra, hrv, ita, jpn, nld, por, rus, spa, svk,  fin, zho, cym) |
| onChange | function | \*required | The handler when a country is selected |
| closeable | bool | false | If true, the CountryPicker will have a close button |

## Dependencies
- world-countries : https://www.npmjs.com/package/world-countries

## FAQ
### Is it supported and tested both on android and iOS?
YES
### Is the data that is populated inside the list saved offline once I install your package?
YES : It used the world-countries package and image is stored into json and base64.

## Contribution

- [@xcapentier](mailto:contact@xaviercarpentier.com) The main author.

## Questions

Feel free to [contact me](mailto:contact@xaviercarpentier.com) or [create an issue](https://github.com/xcarpentier/react-native-country-picker/issues/new)

> made with ♥
