#!/usr/bin/env node

const countries = require('world-countries')
const flags = require('./countryFlags')

const isEmoji = process.argv.includes('--emoji')
const isCca2 = process.argv.includes('--cca2')
const isRegion = process.argv.includes('--regions')
const isSubRegion = process.argv.includes('--subregions')

const getCountryNameAsyncs = (common, translations) =>
  Object.keys(translations)
    .filter((k) => k !== 'common')
    .map((key) => ({ [key]: translations[key].common }))
    .reduce(
      (prev, cur) => ({
        ...prev,
        [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]],
      }),
      {},
    )

const newcountries = countries
  .map(
    ({
      cca2,
      currency,
      callingCode,
      region,
      subregion,
      name: { common },
      translations,
    }) => ({
      [cca2]: {
        currency,
        callingCode,
        region,
        subregion,
        flag: isEmoji ? `flag-${cca2.toLowerCase()}` : flags[cca2],
        name: { common, ...getCountryNameAsyncs(common, translations) },
      },
    }),
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
      [Object.keys(cur)[0]]: cur[Object.keys(cur)[0]],
    }),
    {},
  )

if (isCca2) {
  console.log(JSON.stringify(Object.keys(newcountries)))
} else if (isRegion) {
  console.log(
    JSON.stringify(
      Object.values(newcountries)
        .map((country) => country.region)
        .reduce(
          (previousValue, currentValue) =>
            previousValue.includes(currentValue)
              ? previousValue
              : previousValue.concat(currentValue),
          [],
        ),
    ),
  )
} else if (isSubRegion) {
  console.log(
    JSON.stringify(
      Object.values(newcountries)
        .map((country) => country.subregion)
        .reduce(
          (previousValue, currentValue) =>
            previousValue.includes(currentValue)
              ? previousValue
              : previousValue.concat(currentValue),
          [],
        ),
    ),
  )
} else {
  console.log(JSON.stringify(newcountries))
}
