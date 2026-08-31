import { createContext, useContext } from 'react'
import { type TranslationLanguageCode } from './types'
import {
  getCountriesAsync,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
  getCountryInfoAsync,
  getCountryNameAsync,
  getEmojiFlag,
  getImageFlagAsync,
  getLetters,
  search,
} from './CountryService'

export interface CountryContextParam {
  translation?: TranslationLanguageCode
  getCountryNameAsync: typeof getCountryNameAsync
  getImageFlagAsync: typeof getImageFlagAsync
  /** Synchronous since v3: the emoji is derived from the country code. */
  getEmojiFlag: typeof getEmojiFlag
  getCountriesAsync: typeof getCountriesAsync
  getLetters: typeof getLetters
  getCountryCallingCodeAsync: typeof getCountryCallingCodeAsync
  getCountryCurrencyAsync: typeof getCountryCurrencyAsync
  search: typeof search
  getCountryInfoAsync: typeof getCountryInfoAsync
}

export const DEFAULT_COUNTRY_CONTEXT: CountryContextParam = {
  translation: 'common',
  getCountryNameAsync,
  getImageFlagAsync,
  getEmojiFlag,
  getCountriesAsync,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
  search,
  getLetters,
  getCountryInfoAsync,
}

export const CountryContext = createContext<CountryContextParam>(
  DEFAULT_COUNTRY_CONTEXT,
)

/**
 * Renamed from `useContext` in v2, which shadowed React's own export at every
 * call site and made the imports genuinely confusing to read.
 */
export const useCountryContext = () => useContext(CountryContext)

export const { Provider: CountryProvider, Consumer: CountryConsumer } =
  CountryContext
