import * as React from 'react';
export declare const CountryModal: {
    ({ children, withModal, disableNativeModal, ...props }: import("react-native").ModalBaseProps & import("react-native").ModalPropsIOS & import("react-native").ModalPropsAndroid & {
        children: React.ReactNode;
        withModal?: boolean | undefined;
        disableNativeModal?: boolean | undefined;
    }): JSX.Element | null;
    defaultProps: {
        animationType: string;
        animated: boolean;
        withModal: boolean;
        disableNativeModal: boolean;
    };
};
