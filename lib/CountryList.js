import React, { useRef, memo, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity, PixelRatio, Dimensions, } from 'react-native';
import { useTheme } from './CountryTheme';
import { Flag } from './Flag';
import { useContext } from './CountryContext';
import { CountryText } from './CountryText';
const borderBottomWidth = 2 / PixelRatio.get();
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    letters: {
        marginRight: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        height: 23,
        width: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {
        textAlign: 'center',
    },
    itemCountry: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    itemCountryName: {
        width: '90%',
    },
    list: {
        flex: 1,
    },
    sep: {
        borderBottomWidth,
        width: '100%',
    },
});
const Letter = ({ letter, scrollTo }) => {
    const { fontSize, activeOpacity } = useTheme();
    return (React.createElement(TouchableOpacity, Object.assign({ testID: `letter-${letter}`, key: letter, onPress: () => scrollTo(letter) }, { activeOpacity }),
        React.createElement(View, { style: styles.letter },
            React.createElement(CountryText, { style: [styles.letterText, { fontSize: fontSize * 0.8 }] }, letter))));
};
const CountryItem = (props) => {
    const { activeOpacity, itemHeight, flagSize } = useTheme();
    const { country, onSelect, withFlag, withEmoji, withCallingCode, withCurrency, } = props;
    const extraContent = [];
    if (withCallingCode &&
        country.callingCode &&
        country.callingCode.length > 0) {
        extraContent.push(`+${country.callingCode.join('|')}`);
    }
    if (withCurrency && country.currency && country.currency.length > 0) {
        extraContent.push(country.currency.join('|'));
    }
    return (React.createElement(TouchableOpacity, Object.assign({ key: country.cca2, testID: `country-selector-${country.cca2}`, onPress: () => onSelect(country) }, { activeOpacity }),
        React.createElement(View, { style: [styles.itemCountry, { height: itemHeight }] },
            withFlag && (React.createElement(Flag, Object.assign({}, { withEmoji, countryCode: country.cca2, flagSize: flagSize }))),
            React.createElement(View, { style: styles.itemCountryName },
                React.createElement(CountryText, { numberOfLines: 2, ellipsizeMode: 'tail' },
                    country.name,
                    extraContent.length > 0 && ` (${extraContent.join(', ')})`)))));
};
CountryItem.defaultProps = {
    withFlag: true,
    withCallingCode: false,
};
const MemoCountryItem = memo(CountryItem);
const renderItem = (props) => ({ item: country, }) => (React.createElement(MemoCountryItem, Object.assign({}, { country, ...props })));
const keyExtractor = (item) => item.cca2;
const ItemSeparatorComponent = () => {
    const { primaryColorVariant } = useTheme();
    return (React.createElement(View, { style: [styles.sep, { borderBottomColor: primaryColorVariant }] }));
};
const { height } = Dimensions.get('window');
export const CountryList = (props) => {
    const { data, withAlphaFilter, withEmoji, withFlag, withCallingCode, withCurrency, onSelect, filter, flatListProps, filterFocus, } = props;
    const flatListRef = useRef(null);
    const [letter, setLetter] = useState('');
    const { itemHeight, backgroundColor } = useTheme();
    const indexLetter = data
        .map((country) => country.name.substr(0, 1))
        .join('');
    const scrollTo = (letter, animated = true) => {
        const index = indexLetter.indexOf(letter);
        setLetter(letter);
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated, index });
        }
    };
    const onScrollToIndexFailed = (_info) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd();
            scrollTo(letter);
        }
    };
    const { search, getLetters } = useContext();
    const letters = getLetters(data);
    useEffect(() => {
        if (data && data.length > 0 && filterFocus && !filter) {
            scrollTo(letters[0], false);
        }
    }, [filterFocus]);
    const initialNumToRender = Math.round(height / (itemHeight || 1));
    return (React.createElement(View, { style: [styles.container, { backgroundColor }] },
        React.createElement(FlatList, Object.assign({ onScrollToIndexFailed: true, ref: flatListRef, testID: 'list-countries', keyboardShouldPersistTaps: 'handled', automaticallyAdjustContentInsets: false, scrollEventThrottle: 1, getItemLayout: (_data, index) => ({
                length: itemHeight + borderBottomWidth,
                offset: (itemHeight + borderBottomWidth) * index,
                index,
            }), renderItem: renderItem({
                withEmoji,
                withFlag,
                withCallingCode,
                withCurrency,
                onSelect,
            }) }, {
            data: search(filter, data),
            keyExtractor,
            onScrollToIndexFailed,
            ItemSeparatorComponent,
            initialNumToRender,
        }, flatListProps)),
        withAlphaFilter && (React.createElement(ScrollView, { contentContainerStyle: styles.letters, keyboardShouldPersistTaps: 'always' }, letters.map((letter) => (React.createElement(Letter, Object.assign({ key: letter }, { letter, scrollTo }))))))));
};
CountryList.defaultProps = {
    filterFocus: undefined,
};
//# sourceMappingURL=CountryList.js.map