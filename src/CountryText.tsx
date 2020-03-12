import React, { ReactNode } from 'react'
import { TextProps, Text, I18nManager } from 'react-native'
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
          direction: I18nManager.isRTL ? 'rtl' : 'ltr',
        },
        style,
      ]}
    />
  )
}
