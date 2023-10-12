import React, { ReactNode } from 'react'
import { TextProps, Text } from 'react-native'
import { useTheme } from './CountryTheme'

export const CountryText = (props: TextProps & { children: ReactNode }) => {
  const { fontFamily, fontSize, onBackgroundTextColor,
    itemTextAlign, itemTextAlignVertical,
  } = useTheme()
  return (
    <Text
      {...props}
      style={{
        fontFamily,
        fontSize,
        color: onBackgroundTextColor,
        textAlign: itemTextAlign,
        textAlignVertical: itemTextAlignVertical,
      }}
    />
  )
}
