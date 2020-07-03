<h3>
  Country Picker for React Native.
</h3>

<p>
   <a href="https://reactnative.gallery/xcarpentier/country-picker"><img src="https://img.shields.io/badge/reactnative.gallery-%F0%9F%8E%AC-green.svg"/></a>
  <a href="https://www.npmjs.com/package/react-native-country-picker-modal"><img src="https://img.shields.io/npm/v/react-native-country-picker-modal.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/react-native-country-picker-modal"><img src="https://img.shields.io/npm/dm/react-native-country-picker-modal.svg?style=flat-square"></a>
  <a href="#hire-an-expert"><img src="https://img.shields.io/badge/%F0%9F%92%AA-hire%20an%20expert-brightgreen"/></a>
</p>

| iOS                                                                                               | Android                                                                                           | Web                                                                                               |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| <img  src="https://media.giphy.com/media/cKmlP4Ue5pUrH0DQLi/giphy.gif" width="200" height="400"/> | <img  src="https://media.giphy.com/media/Q7SDti4eARGx2CQIGE/giphy.gif" width="200" height="400"/> | <img  src="https://media.giphy.com/media/gKl3z3c7sVVL7KSSh8/giphy.gif" width="250" height="400"/> |

## Demo

- 🎉[ GO TO WEB DEMO ](http://xcarpentier.github.io/react-native-country-picker-modal/) 🎉
- [snack example](https://snack.expo.io/@xcarpentier/bossy-marshmallows)

## Installation

```bash
$ yarn add react-native-country-picker-modal
```

## Basic Usage

For more complete example open [App.tsx](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/App.tsx)

```tsx
import React, { useState } from 'react'
import { View, Text, StyleSheet, PixelRatio, Switch } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import { CountryCode, Country } from './src/types'

const styles = StyleSheet.create({
  // ...
})

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>('FR')
  const [country, setCountry] = useState<Country>(null)
  const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(
    false,
  )
  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState<boolean>(false)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(false)
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to Country Picker !</Text>
      <Option
        title='With country name on button'
        value={withCountryNameButton}
        onValueChange={setWithCountryNameButton}
      />
      <Option title='With flag' value={withFlag} onValueChange={setWithFlag} />
      <Option
        title='With emoji'
        value={withEmoji}
        onValueChange={setWithEmoji}
      />
      <Option
        title='With filter'
        value={withFilter}
        onValueChange={setWithFilter}
      />
      <Option
        title='With calling code'
        value={withCallingCode}
        onValueChange={setWithCallingCode}
      />
      <Option
        title='With alpha filter code'
        value={withAlphaFilter}
        onValueChange={setWithAlphaFilter}
      />
      <CountryPicker
        {...{
          countryCode,
          withFilter,
          withFlag,
          withCountryNameButton,
          withAlphaFilter,
          withCallingCode,
          withEmoji,
          onSelect,
        }}
        visible
      />
      <Text style={styles.instructions}>Press on the flag to open modal</Text>
      {country !== null && (
        <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
      )}
    </View>
  )
}
```

## Props

- `countryCode`: [CountryCode](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L252)
- `region?`:[Region](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L272)
- `subregion?`: [Subregion](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L282)
- `countryCodes?`: [CountryCode](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L254)
- `theme?`: [Theme](https://github.com/xcarpentier/react-native-country-picker-modal/blob/7611d34fa35744dbec3fbcdd9b4401494b1ba8c4/src/CountryTheme.ts#L5)
- `translation?`: [TranslationLanguageCode](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L309)
- `modalProps?`: [ModalProps](https://facebook.github.io/react-native/docs/modal#props)
- `filterProps?`: [CountryFilterProps](https://facebook.github.io/react-native/docs/textinput#props)
- `flatListProps?`: [FlatListProps<Country>](https://facebook.github.io/react-native/docs/flatlist#props)
- `withAlphaFilter?`: boolean
- `withCallingCode?`: boolean
- `withCurrency?`: boolean
- `withEmoji?`: boolean
- `withCountryNameButton?`: boolean
- `withCurrencyButton?`: boolean
- `withCallingCodeButton?`: boolean
- `withFlagButton?`: boolean
- `withCloseButton?`: boolean
- `withFilter?`: boolean
- `withFlag?`: boolean
- `withModal?`: boolean
- `visible?`: boolean
- `containerButtonStyle?`: `StyleProp<ViewStyle>`
- `renderFlagButton?`(props: (FlagButton['props'])): ReactNode ([FlagButton props](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/FlagButton.tsx#L73))
- `renderCountryFilter?`(props: CountryFilter['props']): ReactNode ([CountryFilter props is TextInputProps](https://facebook.github.io/react-native/docs/textinput#props))
- `onSelect`(country: Country): void ([Country](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L263))
- `onOpen`(): void
- `onClose`(): void
- `closeButtonImage?`: [ImageSourcePropType](https://facebook.github.io/react-native/docs/image#props)
- `closeButtonStyle?`: StyleProp<ViewStyle>
- `closeButtonImageStyle?`: StyleProp<ImageStyle>
- `disableNativeModal?`: boolean (you have to wrap your all app with CountryModalProvider)
- `preferredCountries`: [CountryCode](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L254) preferred countries they appear first (`withAlphaFilter` must be false)

## Dark theme example

<p align="center">
    <img alt="react-native-country-picker-modal-dark" src="https://user-images.githubusercontent.com/2692166/40585272-094f817a-61b0-11e8-9668-abff0aeddb0e.png" width=150>
</p>

A simple example to display a `CountryPicker` component with a dark theme.

```tsx
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'

const MyDarkView = () => <CountryPicker theme={DARK_THEME} />
```

## Dependencies

- world-countries : https://www.npmjs.com/package/world-countries

## FAQ

### Is it supported and tested both on android and iOS?

YES

### Is the data that is populated inside the list saved offline once I install your package?

YES : It used the world-countries package and image is stored into json and base64.

## Tiers lib using this lib

- [react-native-phone-verification](https://github.com/joinspontaneous/react-native-phone-verification)

[> Your project?](https://github.com/xcarpentier/react-native-linkedin/issues/new)

## See also

- [react-native-linkedin](https://github.com/xcarpentier/react-native-linkedin)

## Contribution

- [@xcapentier](mailto:contact@xaviercarpentier.com) The main author.

## Questions

Feel free to [contact me](mailto:contact@xaviercarpentier.com) or [create an issue](https://github.com/xcarpentier/react-native-country-picker/issues/new)

> made with ♥

## Licence

[MIT](https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/LICENSE.md)

## Hire an expert!

Looking for a ReactNative freelance expert with more than 12 years experience? Contact me from my [website](https://xaviercarpentier.com)!
