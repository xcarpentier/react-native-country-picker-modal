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
import { CountryCodeList, FlagType, type Country } from '../src/types'

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
