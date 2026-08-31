import { memo, useCallback } from 'react'
import {
  ActivityIndicator,
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useCountryContext } from './CountryContext'
import { type CountryCode } from './types'
import { useAsync } from './useAsync'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    marginRight: 10,
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  imageFlag: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    opacity: 0.8,
  },
})

export interface FlagProps {
  countryCode: CountryCode
  withEmoji?: boolean
  withFlagButton?: boolean
  flagSize: number
}

const ImageFlag = memo(
  ({ countryCode, flagSize }: Pick<FlagProps, 'countryCode' | 'flagSize'>) => {
    const { getImageFlagAsync } = useCountryContext()
    const load = useCallback(
      () => getImageFlagAsync(countryCode),
      [getImageFlagAsync, countryCode],
    )
    const { loading, result } = useAsync(load, [load])

    if (loading || !result) {
      return <ActivityIndicator size='small' />
    }
    return (
      <Image
        testID={`flag-image-${countryCode}`}
        resizeMode='contain'
        style={[
          styles.imageFlag,
          { borderColor: 'transparent', height: flagSize },
        ]}
        source={{ uri: result }}
      />
    )
  },
)
ImageFlag.displayName = 'ImageFlag'

const EmojiFlag = memo(
  ({ countryCode, flagSize }: Pick<FlagProps, 'countryCode' | 'flagSize'>) => {
    const { getEmojiFlag } = useCountryContext()
    // Derived synchronously since v3, so emoji flags no longer flash a spinner.
    return (
      <Text
        testID={`flag-emoji-${countryCode}`}
        style={[styles.emojiFlag, { fontSize: flagSize }]}
        allowFontScaling={false}
      >
        {getEmojiFlag(countryCode)}
      </Text>
    )
  },
)
EmojiFlag.displayName = 'EmojiFlag'

export const Flag = ({
  countryCode,
  withEmoji = true,
  withFlagButton = true,
  flagSize,
}: FlagProps) => {
  if (!withFlagButton) {
    return null
  }
  return (
    <View style={styles.container}>
      {withEmoji ? (
        <EmojiFlag {...{ countryCode, flagSize }} />
      ) : (
        <ImageFlag {...{ countryCode, flagSize }} />
      )}
    </View>
  )
}
