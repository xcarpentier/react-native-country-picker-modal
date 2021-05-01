import React, { useCallback, useMemo } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Country, TranslationLanguageCode } from './types'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modal: {
    marginHorizontal: 20,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  titleContainer: {
    padding: 18,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  codeContainer: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  codeButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  codeText: { fontSize: 16, textAlign: 'center' },
})

interface CallingCodePickerProps {
  title?: string
  country?: Country
  translation?: TranslationLanguageCode
  style?: {
    container?: StyleProp<ViewStyle>
    modal?: StyleProp<ViewStyle>
    titleContainer?: StyleProp<ViewStyle>
    titleText?: StyleProp<TextStyle>
    codeContainer?: StyleProp<ViewStyle>
    codeText?: StyleProp<TextStyle>
  }
  onSelect?(country: Country): void
}

export const CallingCodePicker = (props: CallingCodePickerProps) => {
  const { title, country, translation, style, onSelect } = props
  const { fontFamily } = useTheme()

  const handlePress = useCallback(
    (code: string) => {
      if (onSelect && country) {
        onSelect({
          ...country,
          callingCode: [
            code,
            ...country.callingCode.filter(_code => _code !== code),
          ],
        })
      }
    },
    [onSelect],
  )

  const countryName: string = useMemo(() => {
    if (!country) {
      return ''
    }
    if (typeof country.name === 'object') {
      return translation ? country.name[translation] : ''
    }
    return country.name
  }, [country, translation])

  const parsedTitle: string = useMemo(() => {
    if (!country) {
      return ''
    }
    if (title) {
      return title.replace(/<country_name>/g, countryName)
    }
    return `Select a Calling Code for\n${countryName}`
  }, [country, title, countryName])

  if (!country) {
    return null
  }

  return (
    <>
      <View style={[styles.container, style && style.container]}>
        <View style={[styles.modal, style && style.modal]}>
          <View style={[styles.titleContainer, style && style.titleContainer]}>
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={[styles.title, { fontFamily }, style && style.titleText]}
            >
              {parsedTitle}
            </Text>
          </View>
          {country.callingCode.map(code => (
            <View
              style={[styles.codeContainer, style && style.codeContainer]}
              key={code}
            >
              <TouchableOpacity
                style={[styles.codeButton]}
                onPress={() => handlePress(code)}
              >
                <Text style={[styles.codeText, style && style.codeText]}>
                  +{code}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </>
  )
}
