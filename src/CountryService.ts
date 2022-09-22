import {
  CountryCode,
  Country,
  TranslationLanguageCode,
  TranslationLanguageCodeMap,
  FlagType,
  CountryCodeList,
  Region,
  Subregion,
} from './types'
import Fuse from 'fuse.js'

const imageJsonUrl =
  'https://xcarpentier.github.io/react-native-country-picker-modal/countries/'

type CountryMap = { [key in CountryCode]: Country }

interface DataCountry {
  emojiCountries?: CountryMap
  imageCountries?: CountryMap
}
const localData: DataCountry = {
  emojiCountries: undefined,
  imageCountries: undefined,
}

export const loadDataAsync = ((data: DataCountry) => (
  dataType: FlagType = FlagType.EMOJI,
): Promise<CountryMap> => {
  return new Promise((resolve, reject) => {
    switch (dataType) {
      case FlagType.FLAT:
        if (!data.imageCountries) {
          fetch(imageJsonUrl)
            .then((response: Response) => response.json())
            .then((remoteData: any) => {
              data.imageCountries = remoteData
              resolve(data.imageCountries!)
            })
            .catch(reject)
        } else {
          resolve(data.imageCountries!)
        }
        break
      default:
        if (!data.emojiCountries) {
          data.emojiCountries = require('./assets/data/countries-emoji.json')
          resolve(data.emojiCountries!)
        } else {
          resolve(data.emojiCountries!)
        }
        break
    }
  })
})(localData)

export const getEmojiFlagAsync = async (countryCode: CountryCode = 'FR') => {
  const countries = await loadDataAsync()
  if (!countries) {
    throw new Error('Unable to find emoji because emojiCountries is undefined')
  }
  if (!countries[countryCode]) {
    throw new Error(`Country code ${countryCode} is unknown`)
  }
  return countries[countryCode].flag
}

export const getImageFlagAsync = async (countryCode: CountryCode = 'FR') => {
  const countries = await loadDataAsync(FlagType.FLAT)
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  if (!countries[countryCode]) {
    throw new Error(`Country code ${countryCode} is unknown`)
  }
  return countries[countryCode].flag
}

export const getCountryNameAsync = async (
  countryCode: CountryCode = 'FR',
  translation: TranslationLanguageCode = 'common',
) => {
  const countries = await loadDataAsync()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  if (!countries[countryCode]) {
    throw new Error(`Country code ${countryCode} is unknown`)
  }

  return countries[countryCode].name
    ? (countries[countryCode].name as TranslationLanguageCodeMap)[translation]
    : (countries[countryCode].name as TranslationLanguageCodeMap)['common']
}

export const getCountryCallingCodeAsync = async (countryCode: CountryCode) => {
  const countries = await loadDataAsync()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].callingCode[0]
}

export const getCountryCurrencyAsync = async (countryCode: CountryCode) => {
  const countries = await loadDataAsync()
  if (!countries) {
    throw new Error('Unable to find image because imageCountries is undefined')
  }
  return countries[countryCode].currency[0]
}

const isCountryPresent = (countries: { [key in CountryCode]: Country }) => ((
  countryCode: CountryCode,
) => (!!countries[countryCode]))

const isRegion = (region?: Region) => (country: Country) =>
  region ? country.region === region : true

const isSubregion = (subregion?: Subregion) => (country: Country) =>
  subregion ? country.subregion === subregion : true

const isIncluded = (countryCodes?: CountryCode[]) => (country: Country) =>
  countryCodes && countryCodes.length > 0
    ? countryCodes.includes(country.cca2)
    : true

const isExcluded = (excludeCountries?: CountryCode[]) => (country: Country) =>
  excludeCountries && excludeCountries.length > 0
    ? !excludeCountries.includes(country.cca2)
    : true

const isDependent = (withDependents?: boolean) => {
  if (withDependents) { return () => true }
  return (country: Country) => (country.independent)
}

export const getCountriesAsync = async (
  flagType: FlagType,
  translation?: TranslationLanguageCode,
  region?: Region,
  subregion?: Subregion,
  countryCodes?: CountryCode[],
  excludeCountries?: CountryCode[],
  preferredCountries: CountryCode[] = [],
  withDependents?: boolean,
): Promise<Country[]> => {
  const countriesRaw = await loadDataAsync(flagType)
  if (!countriesRaw) {
    return []
  }

  const preferred = new Set(preferredCountries || [])
  const countries = CountryCodeList.filter(isCountryPresent(countriesRaw))
    .map((cca2: CountryCode) => {
      const country  = { ...countriesRaw[cca2] }
      const names    = country.name as TranslationLanguageCodeMap
      const deburred = names.deburred
      // name is the explicit translation, falling back to the common name
      const name     = names[translation || 'common']   || names.common
      // for the scroller index, either the explicit language or the plain-alpha version
      const burrfree = names[translation || 'deburred'] || deburred
      return {
        // @ts-ignore (force name to be first key)
        name,
        ...country,
        // @ts-ignore
        name,
        cca2,
        names,
        burrfree,
        deburred,
      }
    })
    .filter(isRegion(region))
    .filter(isSubregion(subregion))
    .filter(isIncluded(countryCodes))
    .filter(isExcluded(excludeCountries))
    .filter(isDependent(withDependents))
    .sort((country1: Country, country2: Country) => {
      const preferred1 = preferred.has(country1.cca2)
      if (preferred1 !== preferred.has(country2.cca2)) {
        return preferred1 ? -1 : 1
      }
      return (country1.name as string).localeCompare(country2.name as string)
    })
  return countries
}

const DEFAULT_FUSE_OPTION = {
  shouldSort: false,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  isCaseSensitive: false,
  keys: ['name', 'cca2', 'callingCode', 'deburred', 'altsearc'],
}
let fuse: Fuse<Country>
export const search = (
  filter: string = '',
  data: Country[] = [],
  // options: any = {},
) => {
  const searchtext = (filter || '').replace(/[\p{Punctuation}\p{Separator}]+/gu, '')
  if (data.length === 0) {
    return []
  }
  if (! searchtext) { return data }
  if (!fuse) {
    const fuseConfig = { ...DEFAULT_FUSE_OPTION }
    // if (options.extendedSearch) { fuseConfig.keys = [...fuseConfig.keys, 'altsearch'] }
    fuse = new Fuse<Country>(data, fuseConfig)
  }
  const result = fuse.search(searchtext)
  return result.map(({ item }) => item)
}
const uniq = (arr: any[]) => Array.from(new Set(arr))

export const getScrollerLetter = (country: Country, preferredCountries: CountryCode[]) => {
  if (preferredCountries.includes(country.cca2)) { return '!' }
  return (country.burrfree as string).substr(0, 1).toLocaleUpperCase()
}

const MAX_SCROLLER_LENGTH = 30

export const getLetters = (countries: Country[], preferredCountries: CountryCode[]) => {
  const allLetters = uniq(
    countries
      .map((country: Country) => getScrollerLetter(country, preferredCountries))
      .sort((l1: string, l2: string) => l1.localeCompare(l2)),
  )
  const total = allLetters.length
  if (total <= MAX_SCROLLER_LENGTH) { return allLetters }
  const letters: string[] = []
  allLetters.forEach((letter, ii) => {
    const idx = Math.floor(MAX_SCROLLER_LENGTH * (ii / total))
    if (idx >= letters.length) { letters.push(letter) }
  })
  return letters
}

export interface CountryInfo {
  countryName: string
  currency: string
  callingCode: string
}
export const getCountryInfoAsync = async ({
  countryCode,
  translation,
}: {
  countryCode: CountryCode
  translation?: TranslationLanguageCode
}): Promise<CountryInfo> => {
  const countryName = await getCountryNameAsync(
    countryCode,
    translation || 'common',
  )
  const currency = await getCountryCurrencyAsync(countryCode)
  const callingCode = await getCountryCallingCodeAsync(countryCode)
  return { countryName, currency, callingCode }
}
