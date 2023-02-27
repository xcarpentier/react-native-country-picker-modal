import * as React from 'react';
export interface CountryModalContextParam {
    gate?: React.ReactNode;
    teleport?(element: React.ReactNode): void;
}
export declare const CountryModalContext: React.Context<CountryModalContextParam>;
interface CountryModalProvider {
    children: React.ReactNode;
}
export declare const CountryModalProvider: ({ children }: CountryModalProvider) => JSX.Element;
export {};
