import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { Platform } from 'react-native'
import { getHeightPercent } from './ratio'

export const DEFAULT_THEME = {
  primaryColor: '#ccc',
  primaryColorVariant: '#eee',
  backgroundColor: '#ffffff',
  onBackgroundTextColor: '#000000',
  fontSize: 16,
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'Arial',
  }),
  filterPlaceholderTextColor: '#aaa',
  activeOpacity: 0.5,
  itemHeight: getHeightPercent(7),
  flagSize: Platform.select({ android: 20, default: 30 }),
  flagSizeButton: Platform.select({ android: 20, default: 30 }),
}

export const DARK_THEME = {
  ...DEFAULT_THEME,
  primaryColor: '#222',
  primaryColorVariant: '#444',
  backgroundColor: '#000',
  onBackgroundTextColor: '#fff',
}

/** A fully resolved theme: every value is present. */
export type ResolvedTheme = typeof DEFAULT_THEME

/** A user supplied theme: every value is optional and merged over the default. */
export type Theme = Partial<ResolvedTheme>

const ThemeContext = createContext<ResolvedTheme>(DEFAULT_THEME)

export interface ThemeProviderProps {
  theme?: Theme
  children: ReactNode
}

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => {
  const value = useMemo(() => ({ ...DEFAULT_THEME, ...theme }), [theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Returns the resolved theme. Unlike v2 this is never partial, so callers no
 * longer need non-null assertions on `fontSize`, `flagSize` or `itemHeight`.
 */
export const useTheme = (): ResolvedTheme => useContext(ThemeContext)
