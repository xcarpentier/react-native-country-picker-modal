import * as React from 'react'
import { TranslationLanguageCode } from './types'
import {
  getEmojiFlagAsync,
  getImageFlagAsync,
  getCountryNameAsync,
  getCountriesAsync,
  getLetters,
  getScrollerLetter,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
  getCountryInfoAsync,
  search,
} from './CountryService'

export interface CountryContextParam {
  translation?: TranslationLanguageCode
  getCountryNameAsync: typeof getCountryNameAsync
  getImageFlagAsync: typeof getImageFlagAsync
  getEmojiFlagAsync: typeof getEmojiFlagAsync
  getCountriesAsync: typeof getCountriesAsync
  getLetters: typeof getLetters
  getScrollerLetter: typeof getScrollerLetter
  getCountryCallingCodeAsync: typeof getCountryCallingCodeAsync
  getCountryCurrencyAsync: typeof getCountryCurrencyAsync
  search: typeof search
  getCountryInfoAsync: typeof getCountryInfoAsync
}
export const DEFAULT_COUNTRY_CONTEXT = {
  translation: 'common' as TranslationLanguageCode,
  getCountryNameAsync,
  getImageFlagAsync,
  getEmojiFlagAsync,
  getCountriesAsync,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
  search,
  getLetters,
  getScrollerLetter,
  getCountryInfoAsync,
}
export const CountryContext = React.createContext<CountryContextParam>(
  DEFAULT_COUNTRY_CONTEXT,
)

export const useContext = () => React.useContext(CountryContext)

export const {
  Provider: CountryProvider,
  Consumer: CountryConsumer,
} = CountryContext
