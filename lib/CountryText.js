import React from 'react';
import { Text, I18nManager } from 'react-native';
import { useTheme } from './CountryTheme';
export const CountryText = (props) => {
    const { fontFamily, fontSize, primaryColor } = useTheme();
    const { style, ...rest } = props;
    return (React.createElement(Text, Object.assign({}, rest, { style: [
            {
                fontFamily,
                fontSize,
                color: primaryColor,
                direction: I18nManager.isRTL ? 'rtl' : 'ltr',
            },
            style,
        ] })));
};
//# sourceMappingURL=CountryText.js.map