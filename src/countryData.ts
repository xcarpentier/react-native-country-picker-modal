import encodedData from './assets/data/countries-emoji.json'
import {
  type Country,
  type CountryCode,
  type Region,
  type Subregion,
  type TranslationLanguageCodeMap,
} from './types'

export type CountryMap = Record<CountryCode, Country>

/**
 * A country stored positionally: currency, calling code, an index into the
 * region table, an index into the subregion table, and the translated names
 * indexed by the language table. Trailing absent translations are omitted, so
 * this array is often shorter than the language table.
 */
type EncodedCountry = [
  currency: string[],
  callingCode: string[],
  region: number,
  subregion: number,
  names: (string | null)[],
]

interface EncodedData {
  languages: string[]
  regions: string[]
  subregions: string[]
  countries: Record<string, EncodedCountry>
}

/**
 * Rehydrates the bundled dataset into the `Country` shape the rest of the
 * library works with.
 *
 * The asset on disk is stored column-wise -- the 19 translation keys, the
 * region and the subregion live in lookup tables rather than being repeated
 * for each of the 250 countries. That removes ~49 kB from the shipped file,
 * and because the asset is copied into both the CommonJS and ESM builds the
 * saving lands twice. Run `yarn data:encode` to regenerate it from
 * `data/countries-emoji.json`.
 */
const decodeCountries = ({
  languages,
  regions,
  subregions,
  countries,
}: EncodedData): CountryMap =>
  Object.fromEntries(
    Object.entries(countries).map(
      ([cca2, [currency, callingCode, region, subregion, names]]) => [
        cca2,
        {
          currency,
          callingCode,
          region: regions[region] as Region,
          subregion: subregions[subregion] as Subregion,
          // Every country's flag key is exactly its lowercased cca2, so it is
          // derived here instead of being stored 250 times.
          flag: `flag-${cca2.toLowerCase()}`,
          name: Object.fromEntries(
            names.flatMap((name, index) =>
              name === null ? [] : [[languages[index], name]],
            ),
          ) as TranslationLanguageCodeMap,
        },
      ],
    ),
  ) as CountryMap

let emojiCountries: CountryMap | undefined

/**
 * The decoded emoji dataset. Decoding is deferred to first use and then
 * cached, so importing the library does not pay for it.
 */
export const getEmojiCountries = (): CountryMap =>
  (emojiCountries ??= decodeCountries(encodedData as unknown as EncodedData))
