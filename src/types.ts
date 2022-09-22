export const CountryCodeList = [
  "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS",
  "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG",
  "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT",
  "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI",
  "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY",
  "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH",
  "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB",
  "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ",
  "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT",
  "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT",
  "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP",
  "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS",
  "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH",
  "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU",
  "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI",
  "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
  "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA",
  "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG",
  "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST",
  "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK",
  "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG",
  "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU",
  "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW",
] as const

export type CountryCode = typeof CountryCodeList[number]

export type CallingCode = string

export type CurrencyCode = string

export type TranslationLanguageCodeMap = {
  [key in TranslationLanguageCode]: string
}
export interface Country {
  region: Region
  subregion: Subregion
  currency: CurrencyCode[]
  callingCode: CallingCode[]
  flag: string
  name: TranslationLanguageCodeMap | string
  burrfree: string
  cca2: CountryCode
}
export const RegionList = [
  'Africa',
  'Americas',
  'Antarctic',
  'Asia',
  'Europe',
  'Oceania'
] as const
export type Region = typeof RegionList[number]

export const SubregionList = [
  'Southern Asia',
  'Southern Europe',
  'Northern Africa',
  'Polynesia',
  'Middle Africa',
  'Caribbean',
  'South America',
  'Western Asia',
  'Australia and New Zealand',
  'Western Europe',
  'Eastern Europe',
  'Central America',
  'Western Africa',
  'North America',
  'Southern Africa',
  'Eastern Africa',
  'South-Eastern Asia',
  'Eastern Asia',
  'Northern Europe',
  'Melanesia',
  'Micronesia',
  'Central Asia',
  'Central Europe'
] as const
export type Subregion = typeof SubregionList[number]

export const TranslationLanguageCodeList =  [
  'common', 'deburred', 'ces',
  'deu',    'fra',      'hrv',
  'ita',    'jpn',      'nld',
  'por',    'rus',      'slk',
  'spa',    'fin',      'est',
  'zho',    'pol',      'urd',
  'kor',    'isr',      'ara',
  'per',    'fas',      'eng',
  'cym'

] as const
export type TranslationLanguageCode = typeof TranslationLanguageCodeList[number]

export enum FlagType {
  FLAT = 'flat',
  EMOJI = 'emoji'
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// type guards
export function isCountryCode(str: string): str is CountryCode {
  return CountryCodeList.some((code) => code === str);
}
