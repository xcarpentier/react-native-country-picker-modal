import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Dimensions,
  FlatList,
  PixelRatio,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  type FlatListProps,
  type ListRenderItemInfo,
} from 'react-native'
import { useCountryContext } from './CountryContext'
import { CountryText } from './CountryText'
import { useTheme } from './CountryTheme'
import { Flag } from './Flag'
import { type Country } from './types'

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
      accessibilityRole='button'
      onPress={() => scrollTo(letter)}
      activeOpacity={activeOpacity}
    >
      <View style={styles.letter}>
        <CountryText style={[styles.letterText, { fontSize: fontSize * 0.8 }]}>
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

const CountryItem = ({
  country,
  onSelect,
  withFlag = true,
  withEmoji,
  withCallingCode = false,
  withCurrency,
}: CountryItemProps) => {
  const { activeOpacity, itemHeight, flagSize } = useTheme()

  const extraContent: string[] = []
  if (withCallingCode && country.callingCode?.length) {
    extraContent.push(`+${country.callingCode.join('|')}`)
  }
  if (withCurrency && country.currency?.length) {
    extraContent.push(country.currency.join('|'))
  }
  const countryName =
    typeof country.name === 'string' ? country.name : country.name.common

  return (
    <TouchableOpacity
      testID={`country-selector-${country.cca2}`}
      accessibilityRole='button'
      onPress={() => onSelect(country)}
      activeOpacity={activeOpacity}
    >
      <View style={[styles.itemCountry, { height: itemHeight }]}>
        {withFlag && (
          <Flag
            countryCode={country.cca2}
            withEmoji={withEmoji}
            flagSize={flagSize}
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

const MemoCountryItem = memo(CountryItem)
MemoCountryItem.displayName = 'CountryItem'

const ItemSeparatorComponent = () => {
  const { primaryColorVariant } = useTheme()
  return (
    <View style={[styles.sep, { borderBottomColor: primaryColorVariant }]} />
  )
}

export interface CountryListProps {
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

export const CountryList = ({
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
}: CountryListProps) => {
  const flatListRef = useRef<FlatList<Country>>(null)
  // Only read by onScrollToIndexFailed, never rendered: a ref avoids an
  // unnecessary re-render on every letter tap.
  const lastLetter = useRef('')
  const { itemHeight, backgroundColor } = useTheme()
  const { search, getLetters } = useCountryContext()

  const letters = useMemo(() => getLetters(data), [getLetters, data])
  const results = useMemo(() => search(filter, data), [search, filter, data])

  const indexLetter = useMemo(
    () => data.map((country) => (country.name as string).slice(0, 1)).join(''),
    [data],
  )

  const scrollTo = useCallback(
    (nextLetter: string, animated = true) => {
      const index = indexLetter.indexOf(nextLetter)
      if (index < 0) {
        return
      }
      lastLetter.current = nextLetter
      flatListRef.current?.scrollToIndex({ animated, index })
    },
    [indexLetter],
  )

  const onScrollToIndexFailed = useCallback(() => {
    flatListRef.current?.scrollToEnd()
    scrollTo(lastLetter.current)
  }, [scrollTo])

  useEffect(() => {
    if (data.length > 0 && filterFocus && !filter) {
      scrollTo(letters[0], false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFocus])

  const initialNumToRender = Math.round(
    Dimensions.get('window').height / (itemHeight || 1),
  )

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        ref={flatListRef}
        testID='list-countries'
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustContentInsets={false}
        scrollEventThrottle={1}
        data={results}
        keyExtractor={(item) => item.cca2}
        getItemLayout={(_, index) => ({
          length: itemHeight + borderBottomWidth,
          offset: (itemHeight + borderBottomWidth) * index,
          index,
        })}
        renderItem={({ item }: ListRenderItemInfo<Country>) => (
          <MemoCountryItem
            country={item}
            withEmoji={withEmoji}
            withFlag={withFlag}
            withCallingCode={withCallingCode}
            withCurrency={withCurrency}
            onSelect={onSelect}
          />
        )}
        onScrollToIndexFailed={onScrollToIndexFailed}
        ItemSeparatorComponent={ItemSeparatorComponent}
        initialNumToRender={initialNumToRender}
        {...flatListProps}
      />
      {withAlphaFilter && (
        <ScrollView
          scrollEnabled={false}
          contentContainerStyle={styles.letters}
          keyboardShouldPersistTaps='always'
        >
          {letters.map((item) => (
            <Letter key={item} letter={item} scrollTo={scrollTo} />
          ))}
        </ScrollView>
      )}
    </View>
  )
}
