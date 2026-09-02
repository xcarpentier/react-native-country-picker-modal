import {
  getCountriesAsync,
  getCountryCallingCodeAsync,
  getCountryCurrencyAsync,
  getCountryInfoAsync,
  getCountryNameAsync,
  getEmojiFlag,
  getLetters,
  search,
} from '../src/CountryService'
import {
  CountryCodeList,
  FlagType,
  TranslationLanguageCodeList,
  type Country,
} from '../src/types'
import rawCountriesEmoji from '../data/countries-emoji.json'
import { getEmojiCountries } from '../src/countryData'

const countriesFor = (codes: string[]) =>
  getCountriesAsync(
    FlagType.EMOJI,
    'common',
    undefined,
    undefined,
    codes as never,
  )

describe('getEmojiFlag', () => {
  it('derives the flag from the country code', () => {
    expect(getEmojiFlag('FR')).toBe('🇫🇷')
    expect(getEmojiFlag('US')).toBe('🇺🇸')
    expect(getEmojiFlag('GB')).toBe('🇬🇧')
  })

  it('produces a distinct two-codepoint flag for every known country', () => {
    const flags = CountryCodeList.map(getEmojiFlag)
    expect(flags).toHaveLength(CountryCodeList.length)
    expect(new Set(flags).size).toBe(CountryCodeList.length)
    for (const flag of flags) {
      expect([...flag]).toHaveLength(2)
    }
  })
})

describe('getCountriesAsync', () => {
  it('translates names and sorts alphabetically', async () => {
    const countries = await countriesFor(['US', 'FR', 'GB'])
    expect(countries.map((c) => c.cca2)).toEqual(['FR', 'GB', 'US'])
  })

  it('returns calling code and currency for a country', async () => {
    expect(await getCountryCallingCodeAsync('FR')).toBe('33')
    expect(await getCountryCurrencyAsync('FR')).toBe('EUR')
    expect(await getCountryNameAsync('FR', 'common')).toBe('France')
  })

  it('falls back to the common name for an unknown translation', async () => {
    // 'xxx' is not a translation key present in the data.
    const name = await getCountryNameAsync('FR', 'xxx' as never)
    expect(name).toBe('France')
  })

  it('resolves country info in one call', async () => {
    expect(await getCountryInfoAsync({ countryCode: 'US' })).toEqual({
      countryName: 'United States',
      currency: 'USD',
      callingCode: '1',
    })
  })

  it('throws a country-specific message for an unknown code', async () => {
    // v2 threw "Unable to find image because imageCountries is undefined"
    // from the name/calling-code/currency lookups regardless of the cause.
    await expect(getCountryCallingCodeAsync('ZZ' as never)).rejects.toThrow(
      'Unknown country code: ZZ',
    )
  })
})

describe('getLetters', () => {
  it('returns sorted unique initials', async () => {
    // GB's common name is "United Kingdom", so it shares the "U" of
    // "United States" and is de-duplicated away.
    const countries = await countriesFor(['US', 'FR', 'GB'])
    expect(getLetters(countries)).toEqual(['F', 'U'])
  })
})

describe('search', () => {
  it('returns every country when the filter is empty', async () => {
    const countries = await countriesFor(['US', 'FR', 'GB'])
    expect(search('', countries)).toHaveLength(3)
  })

  it('returns matching countries, not Fuse match metadata', async () => {
    const countries = await countriesFor(['US', 'FR', 'GB'])
    const results = search('Fran', countries)
    expect(results.map((c) => c.cca2)).toEqual(['FR'])
    // Fuse 7 wraps hits in { item, refIndex }; callers must get Country objects.
    expect(results[0]).toHaveProperty('callingCode')
  })

  it('matches on calling code and country code as well as name', async () => {
    const countries = await countriesFor(['US', 'FR', 'GB'])
    expect(search('GB', countries).map((c) => c.cca2)).toContain('GB')
  })

  // Regression test for the v2 bug: the Fuse index was a module-level
  // singleton built from the first dataset it ever saw, so searching a
  // different dataset kept returning results from the original one.
  it('re-indexes when the dataset changes', async () => {
    const first = await countriesFor(['US', 'FR', 'GB'])
    expect(search('Fran', first).map((c) => c.cca2)).toEqual(['FR'])

    const second = await countriesFor(['DE', 'IT', 'ES'])
    expect(search('Fran', second)).toEqual([])
    expect(search('Ital', second).map((c) => c.cca2)).toEqual(['IT'])
  })

  it('returns an empty array for an empty dataset', () => {
    expect(search('anything', [] as Country[])).toEqual([])
  })
})

describe('type lists match the bundled data', () => {
  const data = getEmojiCountries() as unknown as Record<
    string,
    { name: Record<string, string> }
  >

  it('declares every country present in the data', () => {
    expect([...CountryCodeList].sort()).toEqual(Object.keys(data).sort())
  })

  // v2 declared `svk` and `isr`, which are absent from the data, and omitted
  // ces/est/kor/pol/slk/urd, which are present. Selecting a declared-but-
  // absent translation silently fell back to English.
  it('declares exactly the translations the data provides', () => {
    const inData = new Set<string>()
    for (const country of Object.values(data)) {
      for (const key of Object.keys(country.name)) inData.add(key)
    }
    expect([...TranslationLanguageCodeList].sort()).toEqual([...inData].sort())
  })

  it('provides the common name for every country', () => {
    const missing = Object.entries(data)
      .filter(([, country]) => !country.name.common)
      .map(([code]) => code)
    expect(missing).toEqual([])
  })
})

describe('the bundled dataset decodes losslessly', () => {
  // The shipped asset is stored column-wise to keep the package small: the
  // translation keys, region and subregion live in lookup tables instead of
  // being repeated for all 250 countries (see src/countryData.ts). This is the
  // guard that compacting it dropped nothing -- the decoded map has to equal
  // the readable source in data/, which is the file a maintainer edits.
  it('reproduces the readable source exactly', () => {
    expect(getEmojiCountries()).toEqual(rawCountriesEmoji)
  })

  it('derives each flag key from the country code', () => {
    const countries = getEmojiCountries()
    expect(countries.FR.flag).toBe('flag-fr')
    for (const [cca2, country] of Object.entries(countries)) {
      expect(country.flag).toBe(`flag-${cca2.toLowerCase()}`)
    }
  })
})
