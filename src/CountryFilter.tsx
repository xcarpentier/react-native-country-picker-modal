import {
  Platform,
  StyleSheet,
  TextInput,
  type TextInputProps,
} from 'react-native'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  input: {
    height: 48,
    width: '70%',
    ...Platform.select({
      web: {
        outlineWidth: 0,
        outlineColor: 'transparent',
        outlineOffset: 0,
      },
    }),
  },
})

export type CountryFilterProps = TextInputProps

export const CountryFilter = ({
  autoFocus = false,
  placeholder = 'Enter country name',
  ...props
}: CountryFilterProps) => {
  const {
    filterPlaceholderTextColor,
    fontFamily,
    fontSize,
    keyboardAppearance,
    onBackgroundTextColor,
  } = useTheme()
  return (
    <TextInput
      testID='text-input-country-filter'
      autoCorrect={false}
      autoFocus={autoFocus}
      placeholder={placeholder}
      placeholderTextColor={filterPlaceholderTextColor}
      keyboardAppearance={keyboardAppearance}
      style={[
        styles.input,
        { fontFamily, fontSize, color: onBackgroundTextColor },
      ]}
      {...props}
    />
  )
}
