import { type ReactNode } from 'react'
import { Text, type TextProps } from 'react-native'
import { useTheme } from './CountryTheme'

export const CountryText = (props: TextProps & { children: ReactNode }) => {
  const { fontFamily, fontSize, onBackgroundTextColor } = useTheme()
  return (
    <Text
      {...props}
      style={[
        { fontFamily, fontSize, color: onBackgroundTextColor },
        props.style,
      ]}
    />
  )
}
