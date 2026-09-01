import React, { useRef, memo, useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
} from 'react-native'
import { LegendList, LegendListRenderItemProps } from '@legendapp/list/react-native'
import type { LegendListRef } from '@legendapp/list/react-native'
import { useTheme } from './CountryTheme'
import { Country } from './types'
import { Flag } from './Flag'
import { useContext } from './CountryContext'
import { CountryText } from './CountryText'

const borderBottomWidth = 2 / PixelRatio.get()
const ALPHA_FILTER_WIDTH = 35

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listWithAlphaFilter: {
    paddingRight: ALPHA_FILTER_WIDTH,
  },
  lettersContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: ALPHA_FILTER_WIDTH,
  },
  letters: {
    flex: 1,
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
        <CountryText style={[styles.letterText, { fontSize: (fontSize ?? 16) * 0.8 }]}>
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
    withFlag = true,
    withEmoji,
    withCallingCode = false,
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
            {...{ withEmoji, countryCode: country.cca2, flagSize: flagSize ?? 30 }}
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
const MemoCountryItem = memo<CountryItemProps>(CountryItem)

interface CountryListProps {
  data: Country[]
  filter?: string
  filterFocus?: boolean
  withFlag?: boolean
  withEmoji?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  onSelect(country: Country): void
}

const ItemSeparatorComponent = () => {
  const { primaryColorVariant } = useTheme()
  return (
    <View style={[styles.sep, { borderBottomColor: primaryColorVariant }]} />
  )
}

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
    filterFocus = undefined,
  } = props

  const listRef = useRef<LegendListRef>(null)
  const [, setLetter] = useState<string>('')
  const { itemHeight, backgroundColor } = useTheme()
  const indexLetter = data
    .map((country: Country) => (country.name as string).substring(0, 1))
    .join('')

  const scrollTo = (letter: string, animated: boolean = true) => {
    const index = indexLetter.indexOf(letter)
    setLetter(letter)
    if (listRef.current) {
      // v3 made scrollToIndex async; nothing awaits this UI scroll.
      void listRef.current.scrollToIndex({ animated, index })
    }
  }

  const { search, getLetters } = useContext()
  const letters = getLetters(data)
  useEffect(() => {
    if (data && data.length > 0 && filterFocus && !filter) {
      scrollTo(letters[0], false)
    }
  }, [filterFocus])

  const renderItem =
    ({ item }: LegendListRenderItemProps<Country>) => (
      <MemoCountryItem
        country={item}
        withEmoji={withEmoji}
        withFlag={withFlag}
        withCallingCode={withCallingCode}
        withCurrency={withCurrency}
        onSelect={onSelect}
      />
    )

  const filteredData = search(filter, data)

  const keyExtractor = (item: Country) => item?.cca2

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <LegendList
        ref={listRef}
        testID='list-countries'
        style={[styles.list, withAlphaFilter && styles.listWithAlphaFilter]}
        keyboardShouldPersistTaps='handled'
        scrollEventThrottle={1}
        renderItem={renderItem}
        data={filteredData}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={ItemSeparatorComponent}
        estimatedItemSize={(itemHeight ?? 50) + borderBottomWidth}
        recycleItems
      />
      {withAlphaFilter && (
        <ScrollView
          scrollEnabled={false}
          style={styles.lettersContainer}
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
