#!/usr/bin/env node

const countries = require('world-countries')
const flags = require('./countryFlags')
const deburr = require('./deburr')
const moreTranslations = require('../data/countries-more-translations.json')

const isEmoji = process.argv.includes('--emoji')
const isCca2 = process.argv.includes('--cca2')
const isRegion = process.argv.includes('--regions')
const isSubRegion = process.argv.includes('--subregions')

const getCountryNameAsyncs = (common, translations) =>
  Object.keys(translations)
    .filter(k => (k !== 'common'))
    .map(key => ({ [key]: translations[key].common }))
    .reduce(
      (prev, cur) => ({
        ...prev,
        [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]]
      }),
      {}
    )

function uniq(arr) { return [...new Set(arr)].sort() }

const TranslationLanguageCodes = {}

function bagsort(bag) {
  const pairs = Object.entries(bag).sort(([kk1], [kk2]) => (kk1.localeCompare(kk2)))
  return Object.fromEntries(pairs)
}

const newcountries = countries
  .map(
    (info) => {
      const {
        cca2,
        idd,
        region,
        subregion,
        name: { common, official, native },
        translations,
        currencies,
        altSpellings,
        latlng,
        flag,
        independent,
        ..._rest
      } = info
      const callingCodeRoot = idd.root.replace(/^\+/, '')
      const callingCodes = (cca2 === 'US') ? ['1'] : idd.suffixes.map((suff) => (callingCodeRoot + suff)).sort()
      const natives = {}
      Object.keys(native).forEach((lang) => { natives[lang] = native[lang].common })
      const deburred = deburr(common)
      const translatedNames = {
        ...moreTranslations[cca2].name, ...natives, ...getCountryNameAsyncs(common, translations), common,
      }
      const names = { common, deburred, ...bagsort(translatedNames) }
      if (names.per && (! names.fas)) { names.fas = names.per }
      if (! names.eng) { names.eng = names.common }
      const altsearch = uniq([...altSpellings, ...altSpellings.map(deburr), ...Object.values(names).map(deburr)])
        .filter((str) => /\w\w\w/.test(str))
      Object.keys(names).forEach((lang) => { TranslationLanguageCodes[lang] = 1 + (TranslationLanguageCodes[lang] || 0) })
      // if (/^T/.test(cca2)) { console.warn(info, natives, native, names) }
      return {
        [cca2]: {
          code: cca2,
          common: names.common,
          official,
          native,
          latlng,
          flagchar: flag,
          currency: Object.keys(currencies || []).sort(),
          callingCode: callingCodes,
          region,
          subregion,
          independent,
          flag: isEmoji ? `flag-${cca2.toLowerCase()}` : flags[cca2],
          altSpellings,
          name: names,
          altsearch,
        }
      }
    }
  )
  .sort((a, b) => {
    if (a[Object.keys(a)[0]].name.common === b[Object.keys(b)[0]].name.common) {
      return 0
    } else if (
      a[Object.keys(a)[0]].name.common < b[Object.keys(b)[0]].name.common
    ) {
      return -1
    }
    return 1
  })
  .reduce(
    (prev, cur) => ({
      ...prev,
      [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]]
    }),
    {}
  )

// console.warn(TranslationLanguageCodes)
const WellTranslated = Object.fromEntries(Object.entries(TranslationLanguageCodes).filter(([lang, ct]) => (ct > 50)))
console.warn('export const TranslationLanguageCodeList = ', Object.keys(WellTranslated), 'as const')

if (isCca2) {
  console.log(JSON.stringify(Object.keys(newcountries)))
} else if (isRegion) {
  console.log(
    JSON.stringify(
      Object.values(newcountries)
        .map(country => country.region)
        .reduce(
          (previousValue, currentValue) =>
            previousValue.includes(currentValue)
              ? previousValue
              : previousValue.concat(currentValue),
          []
        )
    )
  )
} else if (isSubRegion) {
  console.log(
    JSON.stringify(
      Object.values(newcountries)
        .map(country => country.subregion)
        .reduce(
          (previousValue, currentValue) =>
            previousValue.includes(currentValue)
              ? previousValue
              : previousValue.concat(currentValue),
          []
        )
    )
  )
} else {
  console.log(JSON.stringify(newcountries))
}
