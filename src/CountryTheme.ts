import { createTheming } from '@callstack/react-theme-provider'
import { Platform, ColorValue } from 'react-native'
import { getHeightPercent } from './ratio'

export const DEFAULT_THEME: Theme = {
  primaryColor: '#ccc',
  primaryColorVariant: '#eee',
  backgroundColor: '#ffffff',
  onBackgroundTextColor: '#000000',
  fontSize: 16,
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'Arial'
  }),
  filterPlaceholderTextColor: '#aaa',
  activeOpacity: 0.5,
  itemHeight: getHeightPercent(7),
  flagSize: Platform.select({ android: 20, default: 30 }),
  flagSizeButton: Platform.select({ android: 20, default: 30 }),
  itemTextAlign: 'auto',
  itemTextAlignVertical: 'auto',
  filterTextAlign: 'auto',
  filterTextAlignVertical: 'auto',
}
export const DARK_THEME: Theme  = {
  ...DEFAULT_THEME,
  primaryColor: '#222',
  primaryColorVariant: '#444',
  backgroundColor: '#000',
  onBackgroundTextColor: '#fff'
}

export type TextAlignment = 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
export type Theme = Partial<{
  primaryColor: ColorValue,
  primaryColorVariant: ColorValue,
  backgroundColor: ColorValue,
  onBackgroundTextColor: ColorValue,
  fontSize: number,
  fontFamily: string,
  filterPlaceholderTextColor: ColorValue,
  activeOpacity: number,
  itemHeight: number,
  flagSize: number,
  flagSizeButton: number,
  itemTextAlign: TextAlignment,
  itemTextAlignVertical: TextAlignment,
  filterTextAlign: TextAlignment,
  filterTextAlignVertical: TextAlignment,
}>

const { ThemeProvider, useTheme } = createTheming<Theme>(DEFAULT_THEME)

export { ThemeProvider, useTheme }
