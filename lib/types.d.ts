export declare const CountryCodeList: readonly ["AF", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BA", "BW", "BV", "BR", "IO", "VG", "BN", "BG", "BF", "BI", "KH", "CM", "CA", "CV", "BQ", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CD", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "CI", "JM", "JP", "JE", "JO", "KZ", "KE", "XK", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "KP", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "CG", "RO", "RU", "RW", "RE", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "KR", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "ST", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "VI", "UY", "UZ", "VU", "VA", "VE", "VN", "WF", "EH", "YE", "ZM", "ZW", "KI", "HK", "AX"];
export declare type CountryCode = typeof CountryCodeList[number];
export declare type CallingCode = string;
export declare type CurrencyCode = string;
export declare type TranslationLanguageCodeMap = {
    [key in TranslationLanguageCode]: string;
};
export interface Country {
    region: Region;
    subregion: Subregion;
    currency: CurrencyCode[];
    callingCode: CallingCode[];
    flag: string;
    name: TranslationLanguageCodeMap | string;
    cca2: CountryCode;
}
export declare const RegionList: readonly ["Africa", "Americas", "Antarctic", "Asia", "Europe", "Oceania"];
export declare type Region = typeof RegionList[number];
export declare const SubregionList: readonly ["Southern Asia", "Southern Europe", "Northern Africa", "Polynesia", "Middle Africa", "Caribbean", "South America", "Western Asia", "Australia and New Zealand", "Western Europe", "Eastern Europe", "Central America", "Western Africa", "North America", "Southern Africa", "Eastern Africa", "South-Eastern Asia", "Eastern Asia", "Northern Europe", "Melanesia", "Micronesia", "Central Asia", "Central Europe"];
export declare type Subregion = typeof SubregionList[number];
export declare const TranslationLanguageCodeList: readonly ["common", "cym", "deu", "fra", "hrv", "ita", "jpn", "nld", "por", "rus", "spa", "svk", "fin", "zho", "isr"];
export declare type TranslationLanguageCode = typeof TranslationLanguageCodeList[number];
export declare enum FlagType {
    FLAT = "flat",
    EMOJI = "emoji"
}
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare function isCountryCode(str: string): str is CountryCode;
