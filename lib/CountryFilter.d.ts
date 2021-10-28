/// <reference types="react" />
import { TextInputProps } from 'react-native';
export declare type CountryFilterProps = TextInputProps;
export declare const CountryFilter: {
    (props: CountryFilterProps): JSX.Element;
    defaultProps: {
        autoFocus: boolean;
        placeholder: string;
    };
};
