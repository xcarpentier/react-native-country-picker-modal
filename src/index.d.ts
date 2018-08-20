import { StyleProp, ViewStyle, ImageProps } from 'react-native';
import * as React from 'react';

/**
 * Country metadata stored in this library to display and query
 * `<CountryPicker />`
 */
export interface Country {
  currency: CurrencyCode;
  callingCode: CallingCode;
  flag: string;
  name: { [key in TranslationLanguageCode]: string };
}

/**
 * Country code, as specified in ISO 3166-1 alpha-2 (ie. `FR`, `US`, etc.)
 */
export type CCA2Code =
  | 'AF'
  | 'AL'
  | 'DZ'
  | 'AS'
  | 'AD'
  | 'AO'
  | 'AI'
  | 'AQ'
  | 'AG'
  | 'AR'
  | 'AM'
  | 'AW'
  | 'AU'
  | 'AT'
  | 'AZ'
  | 'BS'
  | 'BH'
  | 'BD'
  | 'BB'
  | 'BY'
  | 'BE'
  | 'BZ'
  | 'BJ'
  | 'BM'
  | 'BT'
  | 'BO'
  | 'BA'
  | 'BW'
  | 'BV'
  | 'BR'
  | 'IO'
  | 'VG'
  | 'BN'
  | 'BG'
  | 'BF'
  | 'BI'
  | 'KH'
  | 'CM'
  | 'CA'
  | 'CV'
  | 'KY'
  | 'CF'
  | 'TD'
  | 'CL'
  | 'CN'
  | 'CX'
  | 'CC'
  | 'CO'
  | 'KM'
  | 'CK'
  | 'CR'
  | 'HR'
  | 'CU'
  | 'CW'
  | 'CY'
  | 'CZ'
  | 'CD'
  | 'DK'
  | 'DJ'
  | 'DM'
  | 'DO'
  | 'EC'
  | 'EG'
  | 'SV'
  | 'GQ'
  | 'ER'
  | 'EE'
  | 'ET'
  | 'FK'
  | 'FO'
  | 'FJ'
  | 'FI'
  | 'FR'
  | 'GF'
  | 'PF'
  | 'TF'
  | 'GA'
  | 'GM'
  | 'GE'
  | 'DE'
  | 'GH'
  | 'GI'
  | 'GR'
  | 'GL'
  | 'GD'
  | 'GP'
  | 'GU'
  | 'GT'
  | 'GG'
  | 'GN'
  | 'GW'
  | 'GY'
  | 'HT'
  | 'HM'
  | 'HN'
  | 'HK'
  | 'HU'
  | 'IS'
  | 'IN'
  | 'ID'
  | 'IR'
  | 'IQ'
  | 'IE'
  | 'IM'
  | 'IL'
  | 'IT'
  | 'CI'
  | 'JM'
  | 'JP'
  | 'JE'
  | 'JO'
  | 'KZ'
  | 'KE'
  | 'KI'
  | 'XK'
  | 'KW'
  | 'KG'
  | 'LA'
  | 'LV'
  | 'LB'
  | 'LS'
  | 'LR'
  | 'LY'
  | 'LI'
  | 'LT'
  | 'LU'
  | 'MO'
  | 'MK'
  | 'MG'
  | 'MW'
  | 'MY'
  | 'MV'
  | 'ML'
  | 'MT'
  | 'MH'
  | 'MQ'
  | 'MR'
  | 'MU'
  | 'YT'
  | 'MX'
  | 'FM'
  | 'MD'
  | 'MC'
  | 'MN'
  | 'ME'
  | 'MS'
  | 'MA'
  | 'MZ'
  | 'MM'
  | 'NA'
  | 'NR'
  | 'NP'
  | 'NL'
  | 'NC'
  | 'NZ'
  | 'NI'
  | 'NE'
  | 'NG'
  | 'NU'
  | 'NF'
  | 'KP'
  | 'MP'
  | 'NO'
  | 'OM'
  | 'PK'
  | 'PW'
  | 'PS'
  | 'PA'
  | 'PG'
  | 'PY'
  | 'PE'
  | 'PH'
  | 'PN'
  | 'PL'
  | 'PT'
  | 'PR'
  | 'QA'
  | 'CG'
  | 'RO'
  | 'RU'
  | 'RW'
  | 'RE'
  | 'BL'
  | 'KN'
  | 'LC'
  | 'MF'
  | 'PM'
  | 'VC'
  | 'WS'
  | 'SM'
  | 'SA'
  | 'SN'
  | 'RS'
  | 'SC'
  | 'SL'
  | 'SG'
  | 'SX'
  | 'SK'
  | 'SI'
  | 'SB'
  | 'SO'
  | 'ZA'
  | 'GS'
  | 'KR'
  | 'SS'
  | 'ES'
  | 'LK'
  | 'SD'
  | 'SR'
  | 'SJ'
  | 'SZ'
  | 'SE'
  | 'CH'
  | 'SY'
  | 'ST'
  | 'TW'
  | 'TJ'
  | 'TZ'
  | 'TH'
  | 'TL'
  | 'TG'
  | 'TK'
  | 'TO'
  | 'TT'
  | 'TN'
  | 'TR'
  | 'TM'
  | 'TC'
  | 'TV'
  | 'UG'
  | 'UA'
  | 'AE'
  | 'GB'
  | 'US'
  | 'UM'
  | 'VI'
  | 'UY'
  | 'UZ'
  | 'VU'
  | 'VA'
  | 'VE'
  | 'VN'
  | 'WF'
  | 'EH'
  | 'YE'
  | 'ZM'
  | 'ZW'
  | 'AX';
/**
 * Calling code for a given country. For example, the entry for United States is
 * `1` (referring to "+1`")
 */
export type CallingCode = string;
/**
 * Currency code for a country, as specified in ISO 4217. For example, the entry
 * for United States is `USD` (referring to US Dollars)
 */
export type CurrencyCode = string;
/**
 * Language codes for available translations in this library
 */
export type TranslationLanguageCode =
  | 'common'
  | 'cym'
  | 'deu'
  | 'fra'
  | 'hrv'
  | 'ita'
  | 'jpn'
  | 'nld'
  | 'por'
  | 'rus'
  | 'spa'
  | 'svk'
  | 'fin'
  | 'zho'
  | 'isr';

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
