import React from 'react';
import { TranslationLanguageCode } from './types';
import { Theme } from './CountryTheme';
import { CountryPickerProps } from './CountryPicker';
export interface Props extends CountryPickerProps {
    theme?: Theme;
    translation?: TranslationLanguageCode;
}
declare const Main: React.FunctionComponent<Props>;
export default Main;
export { getCountriesAsync as getAllCountries, getCountryCallingCodeAsync as getCallingCode, } from './CountryService';
export { CountryModal } from './CountryModal';
export { DARK_THEME, DEFAULT_THEME } from './CountryTheme';
export { CountryFilter } from './CountryFilter';
export { CountryList } from './CountryList';
export { FlagButton } from './FlagButton';
export { Flag } from './Flag';
export { HeaderModal } from './HeaderModal';
export { CountryModalProvider } from './CountryModalProvider';
export * from './types';
