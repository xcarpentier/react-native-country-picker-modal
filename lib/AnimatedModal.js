import * as React from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
const { height } = Dimensions.get('window');
const duration = 300;
const useNativeDriver = true;
export const AnimatedModal = ({ children, visible }) => {
    const translateY = new Animated.Value(height);
    const showModal = Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver,
    }).start;
    const hideModal = Animated.timing(translateY, {
        toValue: height,
        duration,
        useNativeDriver,
    }).start;
    React.useEffect(() => {
        if (visible) {
            showModal();
        }
        else {
            hideModal();
        }
    }, [visible]);
    return (React.createElement(Animated.View, { style: {
            ...StyleSheet.absoluteFillObject,
            transform: [{ translateY }],
            zIndex: 99,
        } }, children));
};
AnimatedModal.defaultProps = {
    visible: false,
};
//# sourceMappingURL=AnimatedModal.js.map