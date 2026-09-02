import { memo, useEffect, useState, type ReactNode } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextProps,
  type ViewStyle,
} from 'react-native'
import { useCountryContext } from './CountryContext'
import { CountryText } from './CountryText'
import { useTheme } from './CountryTheme'
import { Flag } from './Flag'
import { type CountryCode } from './types'

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

export interface FlagButtonProps {
  allowFontScaling?: boolean
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

type FlagWithSomethingProps = Pick<
  FlagButtonProps,
  | 'countryCode'
  | 'withEmoji'
  | 'withCountryNameButton'
  | 'withCurrencyButton'
  | 'withCallingCodeButton'
  | 'withFlagButton'
  | 'placeholder'
  | 'allowFontScaling'
> & { flagSize: number }

const FlagText = (props: TextProps & { children: ReactNode }) => (
  <CountryText {...props} style={styles.something} />
)

const FlagWithSomething = memo(
  ({
    allowFontScaling,
    countryCode,
    withEmoji = true,
    withCountryNameButton = false,
    withCurrencyButton = false,
    withCallingCodeButton = false,
    withFlagButton = true,
    flagSize,
    placeholder,
  }: FlagWithSomethingProps) => {
    const { translation, getCountryInfoAsync } = useCountryContext()
    const [countryInfo, setCountryInfo] = useState({
      countryName: '',
      currency: '',
      callingCode: '',
    })
    const { countryName, currency, callingCode } = countryInfo

    useEffect(() => {
      if (!countryCode) {
        return
      }
      let cancelled = false
      getCountryInfoAsync({ countryCode, translation })
        .then((info) => {
          if (!cancelled) setCountryInfo(info)
        })
        .catch(console.warn)
      return () => {
        cancelled = true
      }
    }, [getCountryInfoAsync, countryCode, translation])

    return (
      <View style={styles.flagWithSomethingContainer}>
        {countryCode ? (
          <Flag
            countryCode={countryCode}
            withEmoji={withEmoji}
            withFlagButton={withFlagButton}
            flagSize={flagSize}
          />
        ) : (
          <FlagText allowFontScaling={allowFontScaling}>{placeholder}</FlagText>
        )}

        {withCountryNameButton && countryName ? (
          <FlagText allowFontScaling={allowFontScaling}>
            {`${countryName} `}
          </FlagText>
        ) : null}
        {withCurrencyButton && currency ? (
          <FlagText allowFontScaling={allowFontScaling}>
            {`(${currency}) `}
          </FlagText>
        ) : null}
        {withCallingCodeButton && callingCode ? (
          <FlagText allowFontScaling={allowFontScaling}>
            {`+${callingCode}`}
          </FlagText>
        ) : null}
      </View>
    )
  },
)
FlagWithSomething.displayName = 'FlagWithSomething'

export const FlagButton = ({
  allowFontScaling,
  withEmoji = true,
  withCountryNameButton = false,
  withCallingCodeButton = false,
  withCurrencyButton = false,
  withFlagButton = true,
  countryCode,
  containerButtonStyle,
  onOpen,
  placeholder,
}: FlagButtonProps) => {
  const { flagSizeButton } = useTheme()
  return (
    <TouchableOpacity
      testID='country-picker-button'
      accessibilityRole='button'
      activeOpacity={0.7}
      onPress={onOpen}
    >
      <View
        style={[
          styles.container,
          withEmoji ? styles.containerWithEmoji : styles.containerWithoutEmoji,
          containerButtonStyle,
        ]}
      >
        <FlagWithSomething
          allowFontScaling={allowFontScaling}
          countryCode={countryCode}
          withEmoji={withEmoji}
          withCountryNameButton={withCountryNameButton}
          withCallingCodeButton={withCallingCodeButton}
          withCurrencyButton={withCurrencyButton}
          withFlagButton={withFlagButton}
          flagSize={flagSizeButton}
          placeholder={placeholder}
        />
      </View>
    </TouchableOpacity>
  )
}
