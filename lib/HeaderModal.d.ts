import { ReactNode } from 'react';
import { ImageSourcePropType, StyleProp, ViewStyle, ImageStyle, ViewProps } from 'react-native';
interface HeaderModalProps extends ViewProps {
    withFilter?: boolean;
    withCloseButton?: boolean;
    closeButtonImage?: ImageSourcePropType;
    closeButtonStyle?: StyleProp<ViewStyle>;
    closeButtonImageStyle?: StyleProp<ImageStyle>;
    onClose(): void;
    renderFilter(props: HeaderModalProps): ReactNode;
    isRTL?: boolean;
}
export declare const HeaderModal: {
    (props: HeaderModalProps): JSX.Element;
    defaultProps: {
        withCloseButton: boolean;
    };
};
export {};
