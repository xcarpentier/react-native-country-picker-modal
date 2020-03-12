/// <reference types="react" />
import { StyleProp, ViewStyle, ImageSourcePropType, ImageStyle } from 'react-native';
import PropTypes from 'prop-types';
interface CloseButtonProps {
    style?: StyleProp<ViewStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    image?: ImageSourcePropType;
    onPress?(): void;
}
declare const _default: {
    (props: CloseButtonProps): JSX.Element;
    prototype: {
        onPress: PropTypes.Requireable<(...args: any[]) => any>;
        image: PropTypes.Requireable<any>;
    };
};
export default _default;
