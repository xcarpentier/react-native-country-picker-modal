/// <reference types="react" />
import { CountryCode } from './types';
interface FlagType {
    countryCode: CountryCode;
    withEmoji?: boolean;
    withFlagButton?: boolean;
    flagSize: number;
    isRTL?: boolean;
}
export declare const Flag: {
    ({ countryCode, withEmoji, withFlagButton, flagSize, isRTL, }: FlagType): JSX.Element | null;
    defaultProps: {
        withEmoji: boolean;
        withFlagButton: boolean;
    };
};
export {};
