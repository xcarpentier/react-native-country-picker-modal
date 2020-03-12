import React from 'react';
import { Text } from 'react-native';
import { useTheme } from './CountryTheme';
export const CountryText = (props) => {
    const { fontFamily, fontSize, primaryColor } = useTheme();
    const { style, ...rest } = props;
    return (React.createElement(Text, Object.assign({}, rest, { style: [
            {
                fontFamily,
                fontSize,
                color: primaryColor,
            },
            style,
        ] })));
};
//# sourceMappingURL=CountryText.js.map