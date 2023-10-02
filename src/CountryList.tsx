import React, { useRef, memo, useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ListRenderItemInfo,
  PixelRatio,
  FlatListProps,
  Dimensions,
} from 'react-native'
import { useTheme } from './CountryTheme'
import { Country, Omit } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'
import { CountryText } from './CountryText'

const borderBottomWidth = 2 / PixelRatio.get()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  letters: {
    flex: 1,
    marginRight: 10,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  letter: {
    height: 23,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    textAlign: 'center',
  },
  itemCountry: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  itemCountryName: {
    width: '90%',
  },
  list: {
    flex: 1,
  },
  sep: {
    borderBottomWidth,
    width: '100%',
  },
})

interface LetterProps {
  letter: string
  scrollTo(letter: string): void
}
const Letter = ({ letter, scrollTo }: LetterProps) => {
  const { fontSize, activeOpacity } = useTheme()

  return (
    <TouchableOpacity
      testID={`letter-${letter}`}
      key={letter}
      onPress={() => scrollTo(letter)}
      {...{ activeOpacity }}
    >
      <View style={styles.letter}>
        <CountryText style={[styles.letterText, { fontSize: fontSize! * 0.8 }]}>
          {letter}
        </CountryText>
      </View>
    </TouchableOpacity>
  )
}

interface CountryItemProps {
  country: Country
  withFlag?: boolean
  withEmoji?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  onSelect(country: Country): void
}
const CountryItem = (props: CountryItemProps) => {
  const { activeOpacity, itemHeight, flagSize } = useTheme()
  const {
    country,
    onSelect,
    withFlag,
    withEmoji,
    withCallingCode,
    withCurrency,
  } = props
  const extraContent: string[] = []
  if (
    withCallingCode &&
    country.callingCode &&
    country.callingCode.length > 0
  ) {
    extraContent.push(`+${country.callingCode.join('|')}`)
  }
  if (withCurrency && country.currency && country.currency.length > 0) {
    extraContent.push(country.currency.join('|'))
  }
  const countryName =
    typeof country.name === 'string' ? country.name : country.name.common

  return (
    <TouchableOpacity
      key={country.cca2}
      testID={`country-selector-${country.cca2}`}
      onPress={() => onSelect(country)}
      {...{ activeOpacity }}
    >
      <View style={[styles.itemCountry, { height: itemHeight }]}>
        {withFlag && (
          <Flag
            {...{ withEmoji, countryCode: country.cca2, flagSize: flagSize! }}
          />
        )}
        <View style={styles.itemCountryName}>
          <CountryText numberOfLines={2} ellipsizeMode='tail'>
            {countryName}
            {extraContent.length > 0 && ` (${extraContent.join(', ')})`}
          </CountryText>
        </View>
      </View>
    </TouchableOpacity>
  )
}
CountryItem.defaultProps = {
  withFlag: true,
  withCallingCode: false,
}
const MemoCountryItem = memo<CountryItemProps>(CountryItem)

const renderItem =
  (props: Omit<CountryItemProps, 'country'>) =>
  ({ item: country }: ListRenderItemInfo<Country>) => (
    <MemoCountryItem {...{ country, ...props }} />
  )

interface CountryListProps {
  data: Country[]
  filter?: string
  filterFocus?: boolean
  withFlag?: boolean
  withEmoji?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  flatListProps?: FlatListProps<Country>
  onSelect(country: Country): void
}

const ItemSeparatorComponent = () => {
  const { primaryColorVariant } = useTheme()
  return (
    <View style={[styles.sep, { borderBottomColor: primaryColorVariant }]} />
  )
}

const { height } = Dimensions.get('window')

export const CountryList = (props: CountryListProps) => {
  const {
    data,
    withAlphaFilter,
    withEmoji,
    withFlag,
    withCallingCode,
    withCurrency,
    onSelect,
    filter,
    flatListProps,
    filterFocus,
  } = props

  const flatListRef = useRef<FlatList<Country>>(null)
  const [letter, setLetter] = useState<string>('')
  const { itemHeight, backgroundColor } = useTheme()
  const indexLetter = data
    .map((country: Country) => (country.name as string).substr(0, 1))
    .join('')

  const scrollTo = (letter: string, animated: boolean = true) => {
    const index = indexLetter.indexOf(letter)
    setLetter(letter)
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ animated, index })
    }
  }
  const onScrollToIndexFailed = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd()
      scrollTo(letter)
    }
  }
  const { search, getLetters } = useContext()
  const letters = getLetters(data)
  useEffect(() => {
    if (data && data.length > 0 && filterFocus && !filter) {
      scrollTo(letters[0], false)
    }
  }, [filterFocus])

  const initialNumToRender = Math.round(height / (itemHeight || 1))
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        ref={flatListRef}
        testID='list-countries'
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={1}
        getItemLayout={(_data: any, index) => ({
          length: itemHeight! + borderBottomWidth,
          offset: (itemHeight! + borderBottomWidth) * index,
          index,
        })}
        renderItem={renderItem({
          withEmoji,
          withFlag,
          withCallingCode,
          withCurrency,
          onSelect,
        })}
        {...{
          data: search(filter, data),
          keyExtractor: (item: Country) => item?.cca2,
          onScrollToIndexFailed,
          ItemSeparatorComponent,
          initialNumToRender,
        }}
        {...flatListProps}
      />
      {withAlphaFilter && (
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.letters}
          keyboardShouldPersistTaps='always'
        >
          {letters.map((letter) => (
            <Letter key={letter} {...{ letter, scrollTo }} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}

CountryList.defaultProps = {
  filterFocus: undefined,
}
