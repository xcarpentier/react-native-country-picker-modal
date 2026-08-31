import { type ReactNode } from 'react'
import {
  type FlatListProps,
  type ImageSourcePropType,
  type ImageStyle,
  type ModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { type CountryFilterProps } from './CountryFilter'
import { CountryPicker } from './CountryPicker'
import { ThemeProvider, type Theme } from './CountryTheme'
import { type FlagButtonProps } from './FlagButton'
import {
  type Country,
  type CountryCode,
  type Region,
  type Subregion,
  type TranslationLanguageCode,
} from './types'

export interface CountryPickerModalProps {
  allowFontScaling?: boolean
  countryCode?: CountryCode
  region?: Region
  subregion?: Subregion
  countryCodes?: CountryCode[]
  excludeCountries?: CountryCode[]
  preferredCountries?: CountryCode[]
  theme?: Theme
  translation?: TranslationLanguageCode
  modalProps?: ModalProps
  filterProps?: CountryFilterProps
  flatListProps?: FlatListProps<Country>
  placeholder?: string
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withCloseButton?: boolean
  withFlagButton?: boolean
  withFilter?: boolean
  withFlag?: boolean
  withModal?: boolean
  disableNativeModal?: boolean
  visible?: boolean
  containerButtonStyle?: StyleProp<ViewStyle>
  closeButtonImage?: ImageSourcePropType
  closeButtonStyle?: StyleProp<ViewStyle>
  closeButtonImageStyle?: StyleProp<ImageStyle>
  renderFlagButton?(props: FlagButtonProps): ReactNode
  renderCountryFilter?(props: CountryFilterProps): ReactNode
  onSelect(country: Country): void
  onOpen?(): void
  onClose?(): void
}

const CountryPickerModal = ({
  theme,
  translation,
  withEmoji = true,
  onSelect = () => undefined,
  ...props
}: CountryPickerModalProps) => (
  <ThemeProvider theme={theme}>
    <CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
      <CountryPicker {...props} withEmoji={withEmoji} onSelect={onSelect} />
    </CountryProvider>
  </ThemeProvider>
)

export default CountryPickerModal

export {
  getCountriesAsync as getAllCountries,
  getCountryCallingCodeAsync as getCallingCode,
  getCountryCurrencyAsync as getCurrency,
  getCountryInfoAsync as getCountryInfo,
  getCountryNameAsync as getCountryName,
  getEmojiFlag,
  getImageFlagAsync as getImageFlag,
  setImageFlagsUrl,
} from './CountryService'

export { CountryFilter, type CountryFilterProps } from './CountryFilter'
export { CountryList, type CountryListProps } from './CountryList'
export { CountryModal, type CountryModalProps } from './CountryModal'
export {
  CountryModalProvider,
  type CountryModalProviderProps,
} from './CountryModalProvider'
export { CountryPicker, type CountryPickerProps } from './CountryPicker'
export {
  DARK_THEME,
  DEFAULT_THEME,
  ThemeProvider,
  useTheme,
  type ResolvedTheme,
  type Theme,
} from './CountryTheme'
export { Flag, type FlagProps } from './Flag'
export { FlagButton, type FlagButtonProps } from './FlagButton'
export { HeaderModal, type HeaderModalProps } from './HeaderModal'
export * from './types'
