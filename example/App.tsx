import { useState, type ReactNode } from 'react'
import {
  Button,
  PixelRatio,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
  type ViewProps,
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import CountryPicker, {
  DARK_THEME,
  DEFAULT_THEME,
  type Country,
  type CountryCode,
} from 'react-native-country-picker-modal'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DEFAULT_THEME.backgroundColor,
    // react-native's SafeAreaView applies no insets on Android, so under the
    // edge-to-edge window the heading would sit under the status bar.
    paddingTop:
      Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 0) : 0,
  },
  screenDark: {
    backgroundColor: '#181818',
  },
  container: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 17,
    textAlign: 'center',
    margin: 5,
    color: DEFAULT_THEME.onBackgroundTextColor,
  },
  welcomeDark: {
    color: DARK_THEME.onBackgroundTextColor,
  },
  instructions: {
    fontSize: 14,
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
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ true: 'teal' }}
      thumbColor={'white'}
    />
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

  const onSelect = (selected: Country) => {
    setCountryCode(selected.cca2)
    setCountry(selected)
  }

  return (
    <SafeAreaView style={[styles.screen, dark && styles.screenDark]}>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.welcome, dark && styles.welcomeDark]}>
          Welcome to Country Picker!
        </Text>

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
        <Option
          title='With flag'
          value={withFlag}
          onValueChange={setWithFlag}
        />
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
          excludeCountries={['FR']}
          preferredCountries={['US', 'GB']}
          visible={visible}
          onSelect={onSelect}
          onClose={() => setVisible(false)}
          onOpen={() => setVisible(true)}
        />

        <View style={{ paddingVertical: 20, rowGap: 10 }}>
          <Text style={styles.instructions}>
            Press on the flag to open modal
          </Text>
          <Button
            title='Open modal from outside using visible prop'
            onPress={() => setVisible((v) => !v)}
          />
          {country ? (
            <Text style={styles.data}>{JSON.stringify(country, null, 2)}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
