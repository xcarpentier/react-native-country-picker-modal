import * as React from 'react';
interface Props {
    visible?: boolean;
    children: React.ReactNode;
}
export declare const AnimatedModal: {
    ({ children, visible }: Props): JSX.Element;
    defaultProps: {
        visible: boolean;
    };
};
export {};
