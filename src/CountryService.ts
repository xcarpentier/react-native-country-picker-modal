import Fuse, { type IFuseOptions } from 'fuse.js'
import countriesEmoji from './assets/data/countries-emoji.json'
import {
  CountryCodeList,
  FlagType,
  type Country,
  type CountryCode,
  type Region,
  type Subregion,
  type TranslationLanguageCode,
  type TranslationLanguageCodeMap,
} from './types'

const DEFAULT_IMAGE_JSON_URL =
  'https://xcarpentier.github.io/react-native-country-picker-modal/countries/'

type CountryMap = Record<CountryCode, Country>

let imageJsonUrl = DEFAULT_IMAGE_JSON_URL

/**
 * Override where flat (image) flags are fetched from. Image flags are not
 * bundled with the package because of their size, so by default they are
 * downloaded on first use. Point this at your own host to avoid depending on
 * a third-party origin at runtime.
 */
export const setImageFlagsUrl = (url: string) => {
  imageJsonUrl = url
  imageCountries = undefined
}

let emojiCountries: CountryMap | undefined
let imageCountries: CountryMap | undefined
let imageCountriesRequest: Promise<CountryMap> | undefined

const loadDataAsync = async (
  dataType: FlagType = FlagType.EMOJI,
): Promise<CountryMap> => {
  if (dataType === FlagType.FLAT) {
    if (imageCountries) {
      return imageCountries
    }
    // De-duplicate concurrent callers so a list of 250 rows triggers one fetch.
    imageCountriesRequest ??= fetch(imageJsonUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Unable to fetch image flags from ${imageJsonUrl}: ${response.status} ${response.statusText}`,
          )
        }
        return (await response.json()) as CountryMap
      })
      .then((data) => {
        imageCountries = data
        return data
      })
      .finally(() => {
        imageCountriesRequest = undefined
      })
    return imageCountriesRequest
  }

  // Statically imported rather than require()d: the ESM build would otherwise
  // ship a bare require() that is undefined outside a CommonJS scope. Emoji is
  // the default flag type, so this data is needed in almost every usage anyway.
  emojiCountries ??= countriesEmoji as unknown as CountryMap
  return emojiCountries
}

const CCA2_FIRST_LETTER = 'A'.charCodeAt(0)
const REGIONAL_INDICATOR_A = 0x1f1e6

/**
 * Derives the flag emoji from the ISO 3166-1 alpha-2 code by mapping each
 * letter onto its Regional Indicator Symbol, e.g. `FR` -> 🇫🇷.
 *
 * This replaces the `node-emoji` dependency used in v2: every one of the 250
 * bundled countries has a code of exactly two A-Z letters, so the mapping is
 * total and needs no lookup table.
 */
export const getEmojiFlag = (countryCode: CountryCode = 'FR'): string =>
  String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map(
      (letter) =>
        REGIONAL_INDICATOR_A + letter.charCodeAt(0) - CCA2_FIRST_LETTER,
    ),
  )

const requireCountry = (countries: CountryMap, countryCode: CountryCode) => {
  const country = countries[countryCode]
  if (!country) {
    throw new Error(`Unknown country code: ${countryCode}`)
  }
  return country
}

export const getImageFlagAsync = async (countryCode: CountryCode = 'FR') => {
  const countries = await loadDataAsync(FlagType.FLAT)
  return requireCountry(countries, countryCode).flag
}

export const getCountryNameAsync = async (
  countryCode: CountryCode = 'FR',
  translation: TranslationLanguageCode = 'common',
) => {
  const countries = await loadDataAsync()
  const name = requireCountry(countries, countryCode)
    .name as TranslationLanguageCodeMap
  return name[translation] ?? name.common
}

export const getCountryCallingCodeAsync = async (countryCode: CountryCode) => {
  const countries = await loadDataAsync()
  return requireCountry(countries, countryCode).callingCode[0]
}

export const getCountryCurrencyAsync = async (countryCode: CountryCode) => {
  const countries = await loadDataAsync()
  return requireCountry(countries, countryCode).currency[0]
}

const isCountryPresent =
  (countries: CountryMap) => (countryCode: CountryCode) =>
    !!countries[countryCode]

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

const translateCountry =
  (countries: CountryMap, translation: TranslationLanguageCode) =>
  (cca2: CountryCode): Country => {
    const country = countries[cca2]
    const name = country.name as TranslationLanguageCodeMap
    return { ...country, name: name[translation] || name.common, cca2 }
  }

export const getCountriesAsync = async (
  flagType: FlagType,
  translation: TranslationLanguageCode = 'common',
  region?: Region,
  subregion?: Subregion,
  countryCodes?: CountryCode[],
  excludeCountries?: CountryCode[],
  preferredCountries?: CountryCode[],
  withAlphaFilter?: boolean,
): Promise<Country[]> => {
  const countriesRaw = await loadDataAsync(flagType)
  if (!countriesRaw) {
    return []
  }

  const usePreferredOrder =
    preferredCountries && preferredCountries.length > 0 && !withAlphaFilter

  const orderedCodes = usePreferredOrder
    ? [
        ...preferredCountries,
        ...CountryCodeList.filter((code) => !preferredCountries.includes(code)),
      ]
    : CountryCodeList

  const countries = orderedCodes
    .filter(isCountryPresent(countriesRaw))
    .map(translateCountry(countriesRaw, translation))
    .filter(isRegion(region))
    .filter(isSubregion(subregion))
    .filter(isIncluded(countryCodes))
    .filter(isExcluded(excludeCountries))

  return usePreferredOrder
    ? countries
    : countries.sort((a, b) =>
        (a.name as string).localeCompare(b.name as string),
      )
}

const DEFAULT_FUSE_OPTION: IFuseOptions<Country> = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  minMatchCharLength: 1,
  keys: ['name', 'cca2', 'callingCode'],
}

// v2 cached a single Fuse index built from the first dataset it ever saw, so
// changing translation or the country list kept searching stale data. The
// index is now rebuilt whenever the dataset identity changes.
let fuse: Fuse<Country> | undefined
let indexedData: Country[] | undefined

export const search = (
  filter = '',
  data: Country[] = [],
  options: IFuseOptions<Country> = DEFAULT_FUSE_OPTION,
): Country[] => {
  if (data.length === 0) {
    return []
  }
  if (!fuse || indexedData !== data) {
    fuse = new Fuse(data, options)
    indexedData = data
  }
  if (!filter) {
    return data
  }
  // Fuse 7 returns match metadata rather than the items themselves.
  return fuse.search(filter).map(({ item }) => item)
}

const uniq = (arr: string[]) => Array.from(new Set(arr))

export const getLetters = (countries: Country[]) =>
  uniq(
    countries
      .map((country) =>
        (country.name as string).slice(0, 1).toLocaleUpperCase(),
      )
      .sort((a, b) => a.localeCompare(b)),
  )

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
  const [countryName, currency, callingCode] = await Promise.all([
    getCountryNameAsync(countryCode, translation ?? 'common'),
    getCountryCurrencyAsync(countryCode),
    getCountryCallingCodeAsync(countryCode),
  ])
  return { countryName, currency, callingCode }
}
