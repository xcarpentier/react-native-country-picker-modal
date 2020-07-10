import React, { useState, useEffect, memo } from 'react';
import { TouchableOpacity, StyleSheet, View, } from 'react-native';
import { Flag } from './Flag';
import { useContext } from './CountryContext';
import { CountryText } from './CountryText';
import { useTheme } from './CountryTheme';
const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    containerWithEmoji: {
        marginTop: 0,
    },
    containerWithoutEmoji: {
        marginTop: 5,
    },
    flagWithSomethingContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    something: { fontSize: 16 },
});
const FlagText = (props) => (React.createElement(CountryText, Object.assign({}, props, { style: styles.something })));
const FlagWithSomething = memo(({ countryCode, withEmoji, withCountryNameButton, withCurrencyButton, withCallingCodeButton, withFlagButton, flagSize, placeholder, }) => {
    const { translation, getCountryInfoAsync } = useContext();
    const [state, setState] = useState({
        countryName: '',
        currency: '',
        callingCode: '',
    });
    const { countryName, currency, callingCode } = state;
    useEffect(() => {
        if (countryCode) {
            getCountryInfoAsync({ countryCode, translation })
                .then(setState)
                .catch(console.warn);
        }
    }, [
        countryCode,
        withCountryNameButton,
        withCurrencyButton,
        withCallingCodeButton,
    ]);
    return (React.createElement(View, { style: styles.flagWithSomethingContainer },
        countryCode ? (React.createElement(Flag, Object.assign({}, { withEmoji, countryCode, withFlagButton, flagSize: flagSize }))) : (React.createElement(FlagText, null, placeholder)),
        withCountryNameButton && countryName ? (React.createElement(FlagText, null, countryName + ' ')) : null,
        withCurrencyButton && currency ? (React.createElement(FlagText, null, `(${currency}) `)) : null,
        withCallingCodeButton && callingCode ? (React.createElement(FlagText, null, `+${callingCode}`)) : null));
});
export const FlagButton = ({ withEmoji, withCountryNameButton, withCallingCodeButton, withCurrencyButton, withFlagButton, countryCode, containerButtonStyle, onOpen, placeholder, }) => {
    const { flagSizeButton: flagSize } = useTheme();
    return (React.createElement(TouchableOpacity, { activeOpacity: 0.7, onPress: onOpen },
        React.createElement(View, { style: [
                styles.container,
                withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji,
                containerButtonStyle,
            ] },
            React.createElement(FlagWithSomething, Object.assign({}, {
                countryCode,
                withEmoji,
                withCountryNameButton,
                withCallingCodeButton,
                withCurrencyButton,
                withFlagButton,
                flagSize: flagSize,
                placeholder,
            })))));
};
FlagButton.defaultProps = {
    withEmoji: true,
    withCountryNameButton: false,
    withCallingCodeButton: false,
    withCurrencyButton: false,
    withFlagButton: true,
};
//# sourceMappingURL=FlagButton.js.map