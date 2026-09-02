#!/usr/bin/env node

/**
 * Encodes the readable emoji dataset in `data/` into the compact form that is
 * actually bundled with the package.
 *
 * The readable file repeats the same 19 translation keys, plus a `region` and
 * `subregion` string, for all 250 countries. Hoisting those into lookup tables
 * and storing each country as a positional array removes ~49 kB of duplicated
 * key names, taking the shipped asset from 125 kB to 74 kB. Because the file is
 * duplicated into both the CommonJS and ESM builds, that saving lands twice.
 *
 * `flag` is dropped entirely: for every country it is exactly
 * `'flag-' + cca2.toLowerCase()`, so the decoder recreates it for free.
 *
 * Run with `yarn data:encode` after editing `data/countries-emoji.json`.
 */

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const SOURCE = path.join(root, 'data', 'countries-emoji.json')
const OUTPUT = path.join(root, 'src', 'assets', 'data', 'countries-emoji.json')

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'))

const encode = (countries) => {
  const entries = Object.entries(countries)

  // Ordered by first appearance so the output is stable across runs.
  const collect = (pick) => [...new Set(entries.flatMap(pick))]
  const languages = collect(([, country]) => Object.keys(country.name))
  const regions = collect(([, country]) => country.region)
  const subregions = collect(([, country]) => country.subregion)

  return {
    languages,
    regions,
    subregions,
    countries: Object.fromEntries(
      entries.map(([cca2, country]) => {
        // Trailing absent translations are trimmed; the decoder treats a short
        // row as "no translation" for the remaining languages.
        const names = languages.map(
          (language) => country.name[language] ?? null,
        )
        while (names.length > 0 && names[names.length - 1] === null) {
          names.pop()
        }
        return [
          cca2,
          [
            country.currency,
            country.callingCode,
            regions.indexOf(country.region),
            subregions.indexOf(country.subregion),
            names,
          ],
        ]
      }),
    ),
  }
}

/**
 * Mirrors `decodeCountries` in `src/countryData.ts`. Kept here as an
 * independent implementation so the round-trip check below is a real test of
 * the format rather than of a shared helper.
 */
const decode = ({ languages, regions, subregions, countries }) =>
  Object.fromEntries(
    Object.entries(countries).map(
      ([cca2, [currency, callingCode, region, subregion, names]]) => [
        cca2,
        {
          currency,
          callingCode,
          region: regions[region],
          subregion: subregions[subregion],
          flag: `flag-${cca2.toLowerCase()}`,
          name: Object.fromEntries(
            names.flatMap((name, index) =>
              name === null ? [] : [[languages[index], name]],
            ),
          ),
        },
      ],
    ),
  )

/**
 * Sorts object keys recursively so the comparison below ignores insertion
 * order. A handful of countries list their translations in a different order
 * than the rest (SZ, for instance, has `zho` before `pol`), and the encoding
 * necessarily normalises that. Order is not part of the contract -- callers
 * only ever index `name` by language code -- but every key and value still has
 * to survive, which is what this comparison checks.
 */
const canonical = (value) => {
  if (Array.isArray(value)) {
    return value.map(canonical)
  }
  if (value === null || typeof value !== 'object') {
    return value
  }
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, canonical(value[key])]),
  )
}

const source = readJson(SOURCE)
const encoded = encode(source)

// A silently lossy encode would ship wrong country data, so refuse to write
// unless decoding reproduces every key and value of the input.
if (
  JSON.stringify(canonical(decode(encoded))) !==
  JSON.stringify(canonical(source))
) {
  console.error(
    `Round-trip check failed: decoding the encoded data did not reproduce ${path.relative(root, SOURCE)}.`,
  )
  process.exit(1)
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
fs.writeFileSync(OUTPUT, JSON.stringify(encoded), {
  encoding: 'utf8',
  flag: 'w',
})

const kb = (file) => Math.round(fs.statSync(file).size / 1024)
console.log(
  `Encoded ${Object.keys(source).length} countries: ${kb(SOURCE)} kB -> ${kb(OUTPUT)} kB`,
)
