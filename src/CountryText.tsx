import React, { ReactNode } from 'react'
import { TextProps, Text } from 'react-native'
import { useTheme } from './CountryTheme'

export const CountryText = (props: TextProps & { children: ReactNode }) => {
  const { fontFamily, fontSize, primaryColor } = useTheme()
  const { style, ...rest } = props
  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily,
          fontSize,
          color: primaryColor,
          textAlign: 'left',
        },
        style,
      ]}
    />
  )
}
