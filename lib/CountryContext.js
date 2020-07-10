import * as React from 'react';
import { getEmojiFlagAsync, getImageFlagAsync, getCountryNameAsync, getCountriesAsync, getLetters, getCountryCallingCodeAsync, getCountryCurrencyAsync, getCountryInfoAsync, search, } from './CountryService';
export const DEFAULT_COUNTRY_CONTEXT = {
    translation: 'common',
    getCountryNameAsync,
    getImageFlagAsync,
    getEmojiFlagAsync,
    getCountriesAsync,
    getCountryCallingCodeAsync,
    getCountryCurrencyAsync,
    search,
    getLetters,
    getCountryInfoAsync,
};
export const CountryContext = React.createContext(DEFAULT_COUNTRY_CONTEXT);
export const useContext = () => React.useContext(CountryContext);
export const { Provider: CountryProvider, Consumer: CountryConsumer, } = CountryContext;
//# sourceMappingURL=CountryContext.js.map