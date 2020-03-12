import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CountryCode } from './types';
export interface FlagButtonProps {
    withEmoji?: boolean;
    withCountryNameButton?: boolean;
    withCurrencyButton?: boolean;
    withCallingCodeButton?: boolean;
    withFlagButton?: boolean;
    containerButtonStyle?: StyleProp<ViewStyle>;
    countryCode?: CountryCode;
    placeholder?: string;
    onOpen?(): void;
}
export declare const FlagButton: React.FunctionComponent<FlagButtonProps>;
