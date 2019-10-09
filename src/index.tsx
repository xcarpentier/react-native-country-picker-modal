import React, { ReactNode } from 'react'
import { FlagButton } from './FlagButton'
import { TranslationLanguageCode, CountryCode, Country } from './types'
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { ThemeProvider, DEFAULT_THEME, Theme } from './CountryTheme'
import { CountryFilter, CountryFilterProps } from './CountryFilter'
import { ModalProps, FlatListProps } from 'react-native'
import { CountryPicker } from './CountryPicker'

interface Props {
  countryCode: CountryCode
  theme?: Theme
  translation?: TranslationLanguageCode
  modalProps?: ModalProps
  filterProps?: CountryFilterProps
  flatListProps?: FlatListProps<Country>
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFilter?: boolean
  withFlag?: boolean
  withModal?: boolean
  visible?: boolean
  renderFlagButton?(props: FlagButton['props']): ReactNode
  renderCountryFilter?(props: CountryFilter['props']): ReactNode
  onSelect(country: Country): void
  onOpen?(): void
  onClose?(): void
}

export default function main({ theme, translation, ...props }: Props) {
  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME, ...theme }}>
      <CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
        <CountryPicker {...props} />
      </CountryProvider>
    </ThemeProvider>
  )
}

main.defaultProps = {
  onSelect: () => {}
}

export { getCountries as getAllCountries, getCountryCallingCode as getCallingCode } from './CountryService'
export { CountryModal } from './CountryModal'
export { CountryFilter } from './CountryFilter'
export { CountryList } from './CountryList'
export { FlagButton } from './FlagButton'
export { HeaderModal } from './HeaderModal'
