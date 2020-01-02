import React, { useState, useEffect, ReactNode, memo } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextProps,
} from 'react-native'
import { CountryCode } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'
import { CountryText } from './CountryText'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  containerWithEmoji: {
    marginTop: 0,
  },
  containerWithoutEmoji: {
    marginTop: 5,
  },
  flagWithSomethingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  something: { fontSize: 16 },
})

type FlagWithSomethingProp = Pick<
  FlagButtonProps,
  | 'countryCode'
  | 'withEmoji'
  | 'withCountryNameButton'
  | 'withCurrencyButton'
  | 'withCallingCodeButton'
  | 'withFlagButton'
  | 'placeholder'
> & { flagSize: number }

const FlagText = (props: TextProps & { children: ReactNode }) => (
  <CountryText {...props} style={styles.something} />
)

const FlagWithSomething = memo(
  ({
    countryCode,
    withEmoji,
    withCountryNameButton,
    withCurrencyButton,
    withCallingCodeButton,
    withFlagButton,
    flagSize,
    placeholder,
  }: FlagWithSomethingProp) => {
    const { translation, getCountryInfoAsync } = useContext()
    const [state, setState] = useState({
      countryName: '',
      currency: '',
      callingCode: '',
    })
    const { countryName, currency, callingCode } = state
    useEffect(() => {
      if (countryCode) {
        getCountryInfoAsync({ countryCode, translation })
          .then(setState)
          .catch(console.warn)
      }
    }, [
      countryCode,
      withCountryNameButton,
      withCurrencyButton,
      withCallingCodeButton,
    ])

    return (
      <View style={styles.flagWithSomethingContainer}>
        {countryCode ? (
          <Flag
            {...{ withEmoji, countryCode, withFlagButton, flagSize: flagSize! }}
          />
        ) : (
          <FlagText>{placeholder}</FlagText>
        )}

        {withCountryNameButton && countryName ? (
          <FlagText>{countryName + ' '}</FlagText>
        ) : null}
        {withCurrencyButton && currency ? (
          <FlagText>{`(${currency}) `}</FlagText>
        ) : null}
        {withCallingCodeButton && callingCode ? (
          <FlagText>{`+${callingCode}`}</FlagText>
        ) : null}
      </View>
    )
  },
)

export interface FlagButtonProps {
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFlagButton?: boolean
  containerButtonStyle?: StyleProp<ViewStyle>
  countryCode?: CountryCode
  placeholder: string
  onOpen?(): void
}

export const FlagButton = ({
  withEmoji,
  withCountryNameButton,
  withCallingCodeButton,
  withCurrencyButton,
  withFlagButton,
  countryCode,
  containerButtonStyle,
  onOpen,
  placeholder,
}: FlagButtonProps) => {
  const { flagSizeButton: flagSize } = useTheme()
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
      <View
        style={[
          styles.container,
          withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji,
          containerButtonStyle,
        ]}
      >
        <FlagWithSomething
          {...{
            countryCode,
            withEmoji,
            withCountryNameButton,
            withCallingCodeButton,
            withCurrencyButton,
            withFlagButton,
            flagSize: flagSize!,
            placeholder,
          }}
        />
      </View>
    </TouchableOpacity>
  )
}

FlagButton.defaultProps = {
  withEmoji: true,
  withCountryNameButton: false,
  withCallingCodeButton: false,
  withCurrencyButton: false,
  withFlagButton: true,
}
