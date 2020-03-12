import React from 'react';
import { TextInput, StyleSheet, Platform } from 'react-native';
import { useTheme } from './CountryTheme';
const styles = StyleSheet.create({
    input: {
        height: 48,
        width: '70%',
        ...Platform.select({
            web: {
                outlineWidth: 0,
                outlineColor: 'transparent',
                outlineOffset: 0,
            },
        }),
    },
});
export const CountryFilter = ({ style, ...props }) => {
    const { filterPlaceholderTextColor, fontFamily, fontSize, onBackgroundTextColor, } = useTheme();
    return (React.createElement(TextInput, Object.assign({ testID: 'text-input-country-filter', autoCorrect: false, placeholderTextColor: filterPlaceholderTextColor, style: [
            styles.input,
            { fontFamily, fontSize, color: onBackgroundTextColor },
            style,
        ] }, props)));
};
CountryFilter.defaultProps = {
    autoFocus: false,
    placeholder: 'Filter',
};
//# sourceMappingURL=CountryFilter.js.map