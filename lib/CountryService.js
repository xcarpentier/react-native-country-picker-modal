import { FlagType, CountryCodeList, } from './types';
import Fuse from 'fuse.js';
const imageJsonUrl = 'https://xcarpentier.github.io/react-native-country-picker-modal/countries/';
const localData = {
    emojiCountries: undefined,
    imageCountries: undefined,
};
export const loadDataAsync = ((data) => (dataType = FlagType.EMOJI) => {
    return new Promise((resolve, reject) => {
        switch (dataType) {
            case FlagType.FLAT:
                if (!data.imageCountries) {
                    fetch(imageJsonUrl)
                        .then((response) => response.json())
                        .then((remoteData) => {
                        data.imageCountries = remoteData;
                        resolve(data.imageCountries);
                    })
                        .catch(reject);
                }
                else {
                    resolve(data.imageCountries);
                }
                break;
            default:
                if (!data.emojiCountries) {
                    data.emojiCountries = require('./assets/data/countries-emoji.json');
                    resolve(data.emojiCountries);
                }
                else {
                    resolve(data.emojiCountries);
                }
                break;
        }
    });
})(localData);
export const getEmojiFlagAsync = async (countryCode = 'FR') => {
    const countries = await loadDataAsync();
    if (!countries) {
        throw new Error('Unable to find emoji because emojiCountries is undefined');
    }
    return countries[countryCode].flag;
};
export const getImageFlagAsync = async (countryCode = 'FR') => {
    const countries = await loadDataAsync(FlagType.FLAT);
    if (!countries) {
        throw new Error('Unable to find image because imageCountries is undefined');
    }
    return countries[countryCode].flag;
};
export const getCountryNameAsync = async (countryCode = 'FR', translation = 'common') => {
    const countries = await loadDataAsync();
    if (!countries) {
        throw new Error('Unable to find image because imageCountries is undefined');
    }
    return countries[countryCode].name
        ? countries[countryCode].name[translation]
        : countries[countryCode].name['common'];
};
export const getCountryCallingCodeAsync = async (countryCode) => {
    const countries = await loadDataAsync();
    if (!countries) {
        throw new Error('Unable to find image because imageCountries is undefined');
    }
    return countries[countryCode].callingCode[0];
};
export const getCountryCurrencyAsync = async (countryCode) => {
    const countries = await loadDataAsync();
    if (!countries) {
        throw new Error('Unable to find image because imageCountries is undefined');
    }
    return countries[countryCode].currency[0];
};
const isCountryPresent = (countries) => (countryCode) => !!countries[countryCode];
const isRegion = (region) => (country) => region ? country.region === region : true;
const isSubregion = (subregion) => (country) => subregion ? country.subregion === subregion : true;
const isIncluded = (countryCodes) => (country) => countryCodes && countryCodes.length > 0
    ? countryCodes.includes(country.cca2)
    : true;
const isExcluded = (excludeCountries) => (country) => excludeCountries && excludeCountries.length > 0
    ? !excludeCountries.includes(country.cca2)
    : true;
export const getCountriesAsync = async (flagType, translation = 'common', region, subregion, countryCodes, excludeCountries, preferredCountries, withAlphaFilter) => {
    const countriesRaw = await loadDataAsync(flagType);
    if (!countriesRaw) {
        return [];
    }
    if (preferredCountries && !withAlphaFilter) {
        const newCountryCodeList = [...preferredCountries, ...CountryCodeList.filter(code => !preferredCountries.includes(code))];
        const countries = newCountryCodeList.filter(isCountryPresent(countriesRaw))
            .map((cca2) => ({
            cca2,
            ...{
                ...countriesRaw[cca2],
                name: countriesRaw[cca2].name[translation] ||
                    countriesRaw[cca2].name['common'],
            },
        }))
            .filter(isRegion(region))
            .filter(isSubregion(subregion))
            .filter(isIncluded(countryCodes))
            .filter(isExcluded(excludeCountries));
        return countries;
    }
    else {
        const countries = CountryCodeList.filter(isCountryPresent(countriesRaw))
            .map((cca2) => ({
            cca2,
            ...{
                ...countriesRaw[cca2],
                name: countriesRaw[cca2].name[translation] ||
                    countriesRaw[cca2].name['common'],
            },
        }))
            .filter(isRegion(region))
            .filter(isSubregion(subregion))
            .filter(isIncluded(countryCodes))
            .filter(isExcluded(excludeCountries))
            .sort((country1, country2) => country1.name.localeCompare(country2.name));
        return countries;
    }
};
const DEFAULT_FUSE_OPTION = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name', 'cca2', 'callingCode'],
};
let fuse;
export const search = (filter = '', data = [], options = DEFAULT_FUSE_OPTION) => {
    if (data.length === 0) {
        return [];
    }
    if (!fuse) {
        fuse = new Fuse(data, options);
    }
    if (filter && filter !== '') {
        const result = fuse.search(filter);
        return result;
    }
    else {
        return data;
    }
};
const uniq = (arr) => Array.from(new Set(arr));
export const getLetters = (countries) => {
    return uniq(countries
        .map((country) => country.name.substr(0, 1).toLocaleUpperCase())
        .sort((l1, l2) => l1.localeCompare(l2)));
};
export const getCountryInfoAsync = async ({ countryCode, translation, }) => {
    const countryName = await getCountryNameAsync(countryCode, translation || 'common');
    const currency = await getCountryCurrencyAsync(countryCode);
    const callingCode = await getCountryCallingCodeAsync(countryCode);
    return { countryName, currency, callingCode };
};
//# sourceMappingURL=CountryService.js.map