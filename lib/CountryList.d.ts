/// <reference types="react" />
import { FlatListProps } from 'react-native';
import { Country } from './types';
interface CountryListProps {
    data: Country[];
    filter?: string;
    filterFocus?: boolean;
    withFlag?: boolean;
    withEmoji?: boolean;
    withAlphaFilter?: boolean;
    withCallingCode?: boolean;
    withCurrency?: boolean;
    flatListProps?: FlatListProps<Country>;
    onSelect(country: Country): void;
}
export declare const CountryList: {
    (props: CountryListProps): JSX.Element;
    defaultProps: {
        filterFocus: undefined;
    };
};
export {};
