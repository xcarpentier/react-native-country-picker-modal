import React from 'react';
import { View, StyleSheet, } from 'react-native';
import CloseButton from './CloseButton';
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export const HeaderModal = (props) => {
    const { withFilter, withCloseButton, closeButtonImage, closeButtonStyle, closeButtonImageStyle, onClose, renderFilter, isRTL, ...rest } = props;
    return (React.createElement(View, Object.assign({ style: [styles.container, { direction: isRTL ? 'rtl' : 'ltr' }] }, rest),
        withCloseButton && (React.createElement(CloseButton, { image: closeButtonImage, style: closeButtonStyle, imageStyle: closeButtonImageStyle, onPress: onClose })),
        withFilter && renderFilter(props)));
};
HeaderModal.defaultProps = {
    withCloseButton: true,
};
//# sourceMappingURL=HeaderModal.js.map