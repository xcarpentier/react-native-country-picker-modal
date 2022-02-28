import React from 'react'
import {
  TranslationLanguageCode,
} from './types'
import { CountryProvider, DEFAULT_COUNTRY_CONTEXT } from './CountryContext'
import { ThemeProvider, DEFAULT_THEME, Theme } from './CountryTheme'
import { CountryPicker, CountryPickerProps } from './CountryPicker'

interface Props extends CountryPickerProps {
  theme?: Theme
  translation?: TranslationLanguageCode
}

const Main = ({ theme, translation, ...props }: Props) => {
  return (
    <ThemeProvider theme={{ ...DEFAULT_THEME, ...theme }}>
      <CountryProvider value={{ ...DEFAULT_COUNTRY_CONTEXT, translation }}>
        <CountryPicker {...props} />
      </CountryProvider>
    </ThemeProvider>
  )
}

Main.defaultProps = {
  onSelect: () => {},
  withEmoji: true,
}

export default Main
export {
  getCountriesAsync as getAllCountries,
  getCountryCallingCodeAsync as getCallingCode,
} from './CountryService'
export { CountryModal } from './CountryModal'
export { DARK_THEME, DEFAULT_THEME } from './CountryTheme'
export { CountryFilter } from './CountryFilter'
export { CountryList } from './CountryList'
export { FlagButton } from './FlagButton'
export { Flag } from './Flag'
export { HeaderModal } from './HeaderModal'
export { CountryModalProvider } from './CountryModalProvider'
export * from './types'
