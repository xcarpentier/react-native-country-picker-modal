import React, { useState } from 'react'
import { Text, StyleSheet, PixelRatio, Switch, Button, Pressable, ScrollView, TextInput, View } from 'react-native'
import CountryPicker, { CountryModalProvider, TranslationLanguageCodeList } from './src/'
import { CountryCode, Country } from './src/types'
import { Row } from './src/Row'
import { DARK_THEME } from './src/CountryTheme'

const styles = StyleSheet.create({
  mainBox:          { maxHeight: 2000, paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', flex: 1, },
  container:        { paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', },
  button:           { paddingVertical: 5, paddingHorizontal: 10, marginHorizontal: 4, backgroundColor: '#cfd4e7' },
  countryPickerBox: { maxHeight: '30%', paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#eee' },
  optionsBox:       { maxHeight: '30%', marginVertical: 10, borderColor: '#abc', borderWidth: 1 / PixelRatio.get() },
  dataBox:          { maxHeight: '25%', flex: 1, width: '90%', marginHorizontal: 5, borderWidth: 1 / PixelRatio.get() },
  textEntryBox:     { flex: 1, padding: 5, marginLeft: 20, flexDirection: 'row', justifyContent: 'flex-start' },
  buttonsBox:       { flexDirection: 'row', marginTop: 2 },
  //
  welcome:          { fontSize: 17, textAlign: 'center', marginHorizontal: 5, marginVertical: 10, },
  heading:          { fontSize: 17, textAlign: 'center', marginHorizontal: 5, marginVertical: 10, },
  instructions:     { fontSize: 10, textAlign: 'center', color: '#888', marginBottom: 5, paddingHorizontal: 15, },
  data:             { padding: 10, marginTop: 7, backgroundColor: '#ddd', borderColor: '#888', borderWidth: 1 / PixelRatio.get(), color: '#777' },
  //
  textEntryLabel:   { flex: 2, width: '25%' },
  textEntryInput:   { flex: 3, marginLeft: 2 },
  //
})

interface OptionProps {
  title: string
  value: boolean
  onValueChange(value: boolean): void
}
const Option = ({ value, onValueChange, title }: OptionProps) => (
  <Row fullWidth>
    <Text style={styles.instructions}>{title}</Text>
    <Switch {...{ value, onValueChange }} />
  </Row>
)

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>()
  const [country, setCountry] = useState<Country>(null)
  //
  const [withCountryNameButton, setWithCountryNameButton] = useState<boolean>(false)
  const [withCurrencyButton, setWithCurrencyButton] = useState<boolean>(false)
  const [withFlagButton, setWithFlagButton] = useState<boolean>(true)
  const [withCallingCodeButton, setWithCallingCodeButton] = useState<boolean>(false)
  const [withFlag, setWithFlag] = useState<boolean>(true)
  const [withEmoji, setWithEmoji] = useState<boolean>(true)
  const [withFilter, setWithFilter] = useState<boolean>(true)
  const [withLetterScroller, setWithLetterScroller] = useState<boolean>(true)
  const [withCallingCode, setWithCallingCode] = useState<boolean>(false)
  const [withCurrency, setWithCurrency] = useState<boolean>(false)
  const [withModal, setWithModal] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [withDependents, setWithDependents] = useState<boolean>(false)
  const [dark, setDark] = useState<boolean>(false)
  const [fontScaling, setFontScaling] = useState<boolean>(true)
  const [disableNativeModal, setDisableNativeModal] = useState<boolean>(false)

  const [preferredCountriesStr, setPreferredCountriesStr] = useState<string>('UA')
  const [excludeCountriesStr, setExcludeCountriesStr] = useState<string>('RU')
  const [translation, setTranslation] = useState<string>(null)

  const resetCountry = () => {
    setCountry(null)
    setCountryCode(null)
  }
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }
  const switchVisible = () => setVisible(!visible)

  const excludeCountries = excludeCountriesStr.toUpperCase().trim().split(/\W+/)
  const preferredCountries = preferredCountriesStr.toUpperCase().trim().split(/\W+/)

  return (
    <CountryModalProvider>
      <View style={styles.mainBox}>
        <Text style={styles.welcome}>Welcome to Country Picker !</Text>
        <Text style={styles.instructions}>Press on the flag/placeholder to open modal:</Text>

        <View style={styles.countryPickerBox}>
          <CountryPicker
            theme={dark ? DARK_THEME : {}}
            {...{
              allowFontScaling: fontScaling,
              countryCode,
              withFilter,
              excludeCountries,
              withFlag,
              withCurrencyButton,
              withCallingCodeButton,
              withCountryNameButton,
              withLetterScroller,
              withCallingCode,
              withCurrency,
              withEmoji,
              withModal,
              withFlagButton,
              withDependents,
              onSelect,
              disableNativeModal,
              preferredCountries,
              translation,
              modalProps: {
                visible,
              },
              onClose: () => setVisible(false),
              onOpen: () => setVisible(true),
              placeholder: '(-country-)',
            }}
            />
        </View>

        <View style={styles.optionsBox}>
          <ScrollView>
            <Text style={styles.heading}>Options:</Text>
            <View style={styles.textEntryBox}>
              <Text style={styles.textEntryLabel}>Preferred Countries: </Text>
              <TextInput
                style={styles.textEntryInput}
                value={preferredCountriesStr}
                onChangeText={setPreferredCountriesStr}
                autoCapitalize='characters'
              />
            </View>
            <View style={styles.textEntryBox}>
              <Text style={styles.textEntryLabel}>Exclude Countries: </Text>
              <TextInput
                style={styles.textEntryInput}
                value={excludeCountriesStr}
                onChangeText={setExcludeCountriesStr}
                autoCapitalize='characters'
              />
            </View>
            <View style={styles.textEntryBox}>
              <Text style={styles.textEntryLabel}>Translation:</Text>
              <TextInput style={styles.textEntryInput} autoCorrect={false} value={translation} onChangeText={setTranslation} autoCapitalize='none' />
            </View>
            <Text style={styles.instructions}>{TranslationLanguageCodeList.join(' / ')}</Text>
            <Text style={styles.instructions}>
              ex: {excludeCountries.join('|')} pr: {preferredCountries.join('|')}
            </Text>
            <Option title='Show country name on button' value={withCountryNameButton} onValueChange={setWithCountryNameButton} />
            <Option title='Show currency on button' value={withCurrencyButton} onValueChange={setWithCurrencyButton} />
            <Option title='Show calling code on button' value={withCallingCodeButton} onValueChange={setWithCallingCodeButton} />
            <Option title='Show flag on button' value={withFlagButton} onValueChange={setWithFlagButton} />
            <Option title='With font scaling' value={fontScaling} onValueChange={setFontScaling} />
            <Option title='Use emoji (not image) flags' value={withEmoji} onValueChange={setWithEmoji} />
            <Option title='Provide type-to-filter entry' value={withFilter} onValueChange={setWithFilter} />
            <Option title='Show flag in picker' value={withFlag} onValueChange={setWithFlag} />
            <Option title='Show calling code in picker' value={withCallingCode} onValueChange={setWithCallingCode} />
            <Option title='Show currency in picker' value={withCurrency} onValueChange={setWithCurrency} />
            <Option title='Show letter scroller on right' value={withLetterScroller} onValueChange={setWithLetterScroller} />
            <Option title='Include non-independent states' value={withDependents} onValueChange={setWithDependents} />
            <Option title='Without native modal' value={disableNativeModal} onValueChange={setDisableNativeModal} />
            <Option title='With modal' value={withModal} onValueChange={setWithModal} />
            <Option title='With dark theme' value={dark} onValueChange={setDark} />
          </ScrollView>
        </View>

        <View style={styles.dataBox}>
          <ScrollView>
            <Text style={styles.heading}>Result:</Text>
            <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
          </ScrollView>
        </View>

        <View style={styles.buttonsBox}>
          <Pressable onPress={resetCountry} style={styles.button}>
            <Text>Reset Country</Text>
          </Pressable>
          <Pressable onPress={switchVisible} style={styles.button}>
            <Text>Open Modal Picker</Text>
          </Pressable>
        </View>
      </View>
    </CountryModalProvider>
  )
}
