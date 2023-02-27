/// <reference types="react" />
export declare const DEFAULT_THEME: {
    primaryColor: string;
    primaryColorVariant: string;
    backgroundColor: string;
    onBackgroundTextColor: string;
    fontSize: number;
    fontFamily: string;
    filterPlaceholderTextColor: string;
    activeOpacity: number;
    itemHeight: number;
    flagSize: number;
    flagSizeButton: number;
};
export declare const DARK_THEME: {
    primaryColor: string;
    primaryColorVariant: string;
    backgroundColor: string;
    onBackgroundTextColor: string;
    fontSize: number;
    fontFamily: string;
    filterPlaceholderTextColor: string;
    activeOpacity: number;
    itemHeight: number;
    flagSize: number;
    flagSizeButton: number;
};
export declare type Theme = Partial<typeof DEFAULT_THEME>;
declare const ThemeProvider: import("react").ComponentType<{
    theme?: Partial<{
        primaryColor: string;
        primaryColorVariant: string;
        backgroundColor: string;
        onBackgroundTextColor: string;
        fontSize: number;
        fontFamily: string;
        filterPlaceholderTextColor: string;
        activeOpacity: number;
        itemHeight: number;
        flagSize: number;
        flagSizeButton: number;
    }> | undefined;
}>, useTheme: (overrides?: import("@callstack/react-theme-provider").$DeepPartial<Partial<{
    primaryColor: string;
    primaryColorVariant: string;
    backgroundColor: string;
    onBackgroundTextColor: string;
    fontSize: number;
    fontFamily: string;
    filterPlaceholderTextColor: string;
    activeOpacity: number;
    itemHeight: number;
    flagSize: number;
    flagSizeButton: number;
}>> | undefined) => Partial<{
    primaryColor: string;
    primaryColorVariant: string;
    backgroundColor: string;
    onBackgroundTextColor: string;
    fontSize: number;
    fontFamily: string;
    filterPlaceholderTextColor: string;
    activeOpacity: number;
    itemHeight: number;
    flagSize: number;
    flagSizeButton: number;
}>;
export { ThemeProvider, useTheme };
