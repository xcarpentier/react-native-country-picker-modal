import { CountryCode } from './types';
interface FlagType {
    countryCode: CountryCode;
    withEmoji?: boolean;
    withFlagButton?: boolean;
    flagSize: number;
}
export declare const Flag: {
    ({ countryCode, withEmoji, withFlagButton, flagSize, }: FlagType): JSX.Element | null;
    defaultProps: {
        withEmoji: boolean;
        withFlagButton: boolean;
    };
};
export {};
