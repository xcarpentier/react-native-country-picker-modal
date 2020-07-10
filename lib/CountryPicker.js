import React, { useState, useEffect } from 'react';
import { CountryModal } from './CountryModal';
import { HeaderModal } from './HeaderModal';
import { FlagType } from './types';
import { CountryFilter } from './CountryFilter';
import { FlagButton } from './FlagButton';
import { useContext } from './CountryContext';
import { CountryList } from './CountryList';
const renderFlagButton = (props) => props.renderFlagButton ? (props.renderFlagButton(props)) : (React.createElement(FlagButton, Object.assign({}, props)));
const renderFilter = (props) => props.renderCountryFilter ? (props.renderCountryFilter(props)) : (React.createElement(CountryFilter, Object.assign({}, props)));
export const CountryPicker = (props) => {
    const { countryCode, region, subregion, countryCodes, renderFlagButton: renderButton, renderCountryFilter, filterProps, modalProps, flatListProps, onSelect, withEmoji, withFilter, withCloseButton, withCountryNameButton, withCallingCodeButton, withCurrencyButton, containerButtonStyle, withAlphaFilter, withCallingCode, withCurrency, withFlag, withModal, disableNativeModal, withFlagButton, onClose: handleClose, onOpen: handleOpen, closeButtonImage, closeButtonStyle, closeButtonImageStyle, excludeCountries, placeholder, preferredCountries } = props;
    const [state, setState] = useState({
        visible: props.visible || false,
        countries: [],
        filter: '',
        filterFocus: false,
    });
    const { translation, getCountriesAsync } = useContext();
    const { visible, filter, countries, filterFocus } = state;
    useEffect(() => {
        if (state.visible !== props.visible) {
            setState({ ...state, visible: props.visible || false });
        }
    }, [props.visible]);
    const onOpen = () => {
        setState({ ...state, visible: true });
        if (handleOpen) {
            handleOpen();
        }
    };
    const onClose = () => {
        setState({ ...state, filter: '', visible: false });
        if (handleClose) {
            handleClose();
        }
    };
    const setFilter = (filter) => setState({ ...state, filter });
    const setCountries = (countries) => setState({ ...state, countries });
    const onSelectClose = (country) => {
        onSelect(country);
        onClose();
    };
    const onFocus = () => setState({ ...state, filterFocus: true });
    const onBlur = () => setState({ ...state, filterFocus: false });
    const flagProp = {
        countryCode,
        withEmoji,
        withCountryNameButton,
        withCallingCodeButton,
        withCurrencyButton,
        withFlagButton,
        renderFlagButton: renderButton,
        onOpen,
        containerButtonStyle,
        placeholder,
    };
    useEffect(() => {
        getCountriesAsync(withEmoji ? FlagType.EMOJI : FlagType.FLAT, translation, region, subregion, countryCodes, excludeCountries, preferredCountries, withAlphaFilter)
            .then(setCountries)
            .catch(console.warn);
    }, [translation, withEmoji]);
    return (React.createElement(React.Fragment, null,
        withModal && renderFlagButton(flagProp),
        React.createElement(CountryModal, Object.assign({}, { visible, withModal, disableNativeModal, ...modalProps }, { onRequestClose: onClose, onDismiss: onClose }),
            React.createElement(HeaderModal, Object.assign({}, {
                withFilter,
                onClose,
                closeButtonImage,
                closeButtonImageStyle,
                closeButtonStyle,
                withCloseButton,
            }, { renderFilter: (props) => renderFilter({
                    ...props,
                    renderCountryFilter,
                    onChangeText: setFilter,
                    value: filter,
                    onFocus,
                    onBlur,
                    ...filterProps,
                }) })),
            React.createElement(CountryList, Object.assign({}, {
                onSelect: onSelectClose,
                data: countries,
                letters: [],
                withAlphaFilter: withAlphaFilter && filter === '',
                withCallingCode,
                withCurrency,
                withFlag,
                withEmoji,
                filter,
                filterFocus,
                flatListProps,
            })))));
};
CountryPicker.defaultProps = {
    withModal: true,
    withAlphaFilter: false,
    withCallingCode: false,
    placeholder: 'Select Country',
};
//# sourceMappingURL=CountryPicker.js.map