import { createTheming } from '@callstack/react-theme-provider';
import { Platform } from 'react-native';
import { getHeightPercent } from './ratio';
export const DEFAULT_THEME = {
    primaryColor: '#ccc',
    primaryColorVariant: '#eee',
    backgroundColor: '#ffffff',
    onBackgroundTextColor: '#000000',
    fontSize: 16,
    fontFamily: Platform.select({
        ios: 'System',
        android: 'Roboto',
        web: 'Arial'
    }),
    filterPlaceholderTextColor: '#aaa',
    activeOpacity: 0.5,
    itemHeight: getHeightPercent(7),
    flagSize: Platform.select({ android: 20, default: 30 }),
    flagSizeButton: Platform.select({ android: 20, default: 30 })
};
export const DARK_THEME = {
    ...DEFAULT_THEME,
    primaryColor: '#222',
    primaryColorVariant: '#444',
    backgroundColor: '#000',
    onBackgroundTextColor: '#fff'
};
const { ThemeProvider, useTheme } = createTheming(DEFAULT_THEME);
export { ThemeProvider, useTheme };
//# sourceMappingURL=CountryTheme.js.map