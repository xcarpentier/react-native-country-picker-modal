import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Dimensions,
  FlatList,
  PixelRatio,
  Pressable,
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
// The alpha filter is a single column of letters; each hit target is this wide
// and the column is capped to match, so it cannot stretch and steal width from
// the country list beside it.
const letterColumnWidth = 20
const letterHeight = 23

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // The scroll view itself. react-native-web gives every ScrollView
  // `flexGrow: 1, flexShrink: 1` in its own base style, which a native
  // ScrollView does not have -- so on web this column grew to half the row and
  // squeezed the country list, while iOS and Android sized it to its content.
  // Pinning the box here is what keeps the three platforms in agreement.
  lettersColumn: {
    flexGrow: 0,
    flexShrink: 0,
    width: letterColumnWidth,
    marginRight: 10,
  },
  // The content inside it. flexGrow rather than flex, because flex compiles to
  // `flex-basis: 0%` on web and collapses the column the letters spread across.
  letters: {
    flexGrow: 1,
    maxWidth: letterColumnWidth,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  letter: {
    height: letterHeight,
    width: letterColumnWidth,
    // A full alphabet needs 26 * 23 = 598px, more than the ~592px a 640px web
    // dialog leaves below the header, so the column overflowed and the last
    // letter was clipped against the rounded corner. Shrinking closes that gap
    // instead; on a full-screen phone there is slack and this never engages.
    flexShrink: 1,
    minHeight: 0,
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
    // The sizing lives on the touchable rather than an inner View because the
    // touchable is the actual flex child of the column -- flexShrink on a
    // wrapper inside it would never engage.
    <TouchableOpacity
      testID={`letter-${letter}`}
      accessibilityRole='button'
      onPress={() => scrollTo(letter)}
      activeOpacity={activeOpacity}
      style={styles.letter}
    >
      <CountryText style={[styles.letterText, { fontSize: fontSize * 0.8 }]}>
        {letter}
      </CountryText>
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
  const { activeOpacity, itemHeight, flagSize, primaryColorVariant } =
    useTheme()
  // onHoverIn/onHoverOut only ever fire on platforms with a pointer, so this
  // stays inert on a touch device.
  const [hovered, setHovered] = useState(false)

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
    <Pressable
      testID={`country-selector-${country.cca2}`}
      accessibilityRole='button'
      onPress={() => onSelect(country)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.itemCountry,
        { height: itemHeight },
        hovered && { backgroundColor: primaryColorVariant },
        pressed && { opacity: activeOpacity },
      ]}
    >
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
    </Pressable>
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
          testID='alpha-filter-letters'
          scrollEnabled={false}
          style={styles.lettersColumn}
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
