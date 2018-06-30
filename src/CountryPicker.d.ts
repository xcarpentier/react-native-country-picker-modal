import { StyleProp, ViewStyle, ImageProps } from 'react-native';
import * as React from 'react';
import countries from '../data/countries.json';

/**
 * Country metadata stored in this library to display and query `<CountryPicker
 * />`
 */
export type Country = (typeof countries)[CCA2Code];
/**
 * Country code, as specified in ISO 3166-1 alpha-2 (ie. `FR`, `US`, etc.)
 */
export type CCA2Code = keyof typeof countries;
/**
 * Calling code for a given country. For example: `United States (+1)`
 */
export type CallingCode = string;
/**
 * Currency code for a country, as specified in ISO 4217. For example, US
 * Dollars are `USD`
 */
export type CurrencyCode = string;
/**
 * Language codes for available translations in this library
 */
export type TranslationLanguageCode = keyof Country['name'];

export enum FlagType {
  FLAT = 'flat',
  EMOJI = 'emoji'
}
export enum AnimationType {
  SLIDE = 'slide',
  FADE = 'fade',
  NONE = 'none'
}

export interface CountryPickerProps {
  /**
   * Country code, as specified in ISO 3166-1 alpha-2 (ie. `FR`, `US`, etc.)
   */
  cca2: CCA2Code;
  /**
   * The handler when a country is selected
   */
  onChange: (value: Country) => void;
  /**
   * Override any style specified in the component (see source code)
   */
  styles?: StyleProp<ViewStyle>;
  /**
   * If set to true, Country Picker List will show calling code after country name. For example: `United States (+1)`
   */
  showCallingCode?: boolean;
  /**
   * The handler when the close button is clicked
   */
  onClose?: () => void;
  /**
   * List of custom CCA2 countries to render in the list. Use getAllCountries to filter what you need if you want to pass in a custom list
   */
  countryList?: CCA2Code[];
  /**
   * The language display for the name of the country
   */
  translation?: TranslationLanguageCode;
  /**
   * If true, the CountryPicker will have a close button
   */
  closeable?: boolean;
  /**
   * If true, the CountryPicker will have search bar
   */
  filterable?: boolean;
  /**
   * List of custom CCA2 countries you don't want to render
   */
  excludeCountries?: CCA2Code[];
  /**
   * The search bar placeholder
   */
  filterPlaceholder?: string;
  /**
   * Whether or not the search bar should be autofocused
   */
  autoFocusFilter?: boolean;
  /**
   * Whether or not the Country Picker onPress is disabled
   */
  disabled?: boolean;
  /**
   * The search bar placeholder text color
   */
  filterPlaceholderTextColor?: string;
  /**
   * Custom close button Image
   */
  closeButtonImage?: ImageProps['source'];
  /**
   * If true, the CountryPicker will render the modal over a transparent background
   */
  transparent?: boolean;
  /**
   * The handler that controls how the modal animates
   */
  animationType?: AnimationType;
  /**
   * If set, overwrites the default OS based flag type.
   */
  flagType?: FlagType;
  /**
   * If set to true, prevents the alphabet filter rendering
   */
  hideAlphabetFilter?: boolean;
  /**
   * If 'filterable={true}' and renderFilter function is provided, render custom filter component.*
   */
  renderFilter?: (
    args: {
      value: string;
      onChange: CountryPickerProps['onChange'];
      onClose: CountryPickerProps['onClose'];
    }
  ) => React.ReactNode;
}

export default class CountryPicker extends React.Component<CountryPickerProps> {
  openModal: () => void;
}

export function getAllCountries(): Country[];
