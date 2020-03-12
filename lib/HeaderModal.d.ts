import { ReactNode } from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle, ImageStyle } from 'react-native';
interface HeaderModalProps {
    withFilter?: boolean;
    withCloseButton?: boolean;
    closeButtonImage?: ImageSourcePropType;
    closeButtonStyle?: StyleProp<ViewStyle>;
    closeButtonImageStyle?: StyleProp<ImageStyle>;
    onClose(): void;
    renderFilter(props: HeaderModalProps): ReactNode;
}
export declare const HeaderModal: {
    (props: HeaderModalProps): JSX.Element;
    defaultProps: {
        withCloseButton: boolean;
    };
};
export {};
