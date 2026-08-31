import { useState, type ReactNode } from 'react'
import {
  Button,
  PixelRatio,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type ViewProps,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CountryPicker, {
  CountryModalProvider,
  DARK_THEME,
  type Country,
  type CountryCode,
} from 'react-native-country-picker-modal'

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 17,
    textAlign: 'center',
    margin: 5,
  },
  instructions: {
    fontSize: 10,
    textAlign: 'center',
    color: '#888',
    marginBottom: 0,
  },
  data: {
    maxWidth: 250,
    padding: 10,
    marginTop: 7,
    backgroundColor: '#ddd',
    borderColor: '#888',
    borderWidth: 1 / PixelRatio.get(),
    color: '#777',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 50,
  },
})

const Row = (props: ViewProps & { children?: ReactNode }) => (
  <View {...props} style={[styles.row, props.style]} />
)

interface OptionProps {
  title: string
  value: boolean
  onValueChange(value: boolean): void
}

const Option = ({ value, onValueChange, title }: OptionProps) => (
  <Row>
    <Text style={styles.instructions}>{title}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </Row>
)

export default function App() {
  const [countryCode, setCountryCode] = useState<CountryCode>('US')
  const [country, setCountry] = useState<Country | undefined>()
  const [withCountryNameButton, setWithCountryNameButton] = useState(false)
  const [withCurrencyButton, setWithCurrencyButton] = useState(false)
  const [withFlagButton, setWithFlagButton] = useState(true)
  const [withCallingCodeButton, setWithCallingCodeButton] = useState(false)
  const [withFlag, setWithFlag] = useState(true)
  const [withEmoji, setWithEmoji] = useState(true)
  const [withFilter, setWithFilter] = useState(true)
  const [withAlphaFilter, setWithAlphaFilter] = useState(false)
  const [withCallingCode, setWithCallingCode] = useState(false)
  const [withCurrency, setWithCurrency] = useState(false)
  const [withModal, setWithModal] = useState(true)
  const [visible, setVisible] = useState(false)
  const [dark, setDark] = useState(false)
  const [allowFontScaling, setAllowFontScaling] = useState(true)
  const [disableNativeModal, setDisableNativeModal] = useState(false)

  const onSelect = (selected: Country) => {
    setCountryCode(selected.cca2)
    setCountry(selected)
  }

  return (
    <CountryModalProvider>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Welcome to Country Picker!</Text>

        <Option
          title='With country name on button'
          value={withCountryNameButton}
          onValueChange={setWithCountryNameButton}
        />
        <Option
          title='With currency on button'
          value={withCurrencyButton}
          onValueChange={setWithCurrencyButton}
        />
        <Option
          title='With calling code on button'
          value={withCallingCodeButton}
          onValueChange={setWithCallingCodeButton}
        />
        <Option title='With flag' value={withFlag} onValueChange={setWithFlag} />
        <Option
          title='With font scaling'
          value={allowFontScaling}
          onValueChange={setAllowFontScaling}
        />
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
          title='With currency'
          value={withCurrency}
          onValueChange={setWithCurrency}
        />
        <Option
          title='With alpha filter'
          value={withAlphaFilter}
          onValueChange={setWithAlphaFilter}
        />
        <Option
          title='Without native modal'
          value={disableNativeModal}
          onValueChange={setDisableNativeModal}
        />
        <Option
          title='With modal'
          value={withModal}
          onValueChange={setWithModal}
        />
        <Option title='With dark theme' value={dark} onValueChange={setDark} />
        <Option
          title='With flag button'
          value={withFlagButton}
          onValueChange={setWithFlagButton}
        />

        <CountryPicker
          theme={dark ? DARK_THEME : undefined}
          countryCode={countryCode}
          allowFontScaling={allowFontScaling}
          withFilter={withFilter}
          withFlag={withFlag}
          withCurrencyButton={withCurrencyButton}
          withCallingCodeButton={withCallingCodeButton}
          withCountryNameButton={withCountryNameButton}
          withAlphaFilter={withAlphaFilter}
          withCallingCode={withCallingCode}
          withCurrency={withCurrency}
          withEmoji={withEmoji}
          withModal={withModal}
          withFlagButton={withFlagButton}
          disableNativeModal={disableNativeModal}
          excludeCountries={['FR']}
          preferredCountries={['US', 'GB']}
          visible={visible}
          onSelect={onSelect}
          onClose={() => setVisible(false)}
          onOpen={() => setVisible(true)}
        />

        <Text style={styles.instructions}>Press on the flag to open modal</Text>
        <Button
          title='Open modal from outside using visible prop'
          onPress={() => setVisible((v) => !v)}
        />
        {country ? (
          <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
        ) : null}
      </ScrollView>
    </CountryModalProvider>
  )
}
