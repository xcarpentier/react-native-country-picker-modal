import {
  Image,
  Platform,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
})

export interface CloseButtonProps {
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  image?: ImageSourcePropType
  onPress?(): void
}

// One icon for every platform. The two previous assets were the same glyph
// anyway; the iOS one just carried so much internal padding that it rendered
// as a ~9px hairline inside the 25px frame. Consumers who want a different
// mark still pass `closeButtonImage`.
const DEFAULT_CLOSE_IMAGE =
  require('./assets/images/close.png') as ImageSourcePropType

export const CloseButton = ({
  style,
  imageStyle,
  image,
  onPress,
}: CloseButtonProps) => {
  const { onBackgroundTextColor } = useTheme()
  // Still platform specific: Android uses a ripple, iOS an opacity fade.
  const isAndroid = Platform.OS === 'android'
  const source = image ?? DEFAULT_CLOSE_IMAGE

  const icon = (
    <Image
      testID='close-button-image'
      source={source}
      style={[
        styles.imageStyle,
        imageStyle,
        { tintColor: onBackgroundTextColor },
      ]}
    />
  )

  return (
    <View style={[styles.container, style]}>
      {isAndroid ? (
        <TouchableNativeFeedback
          testID='close-button'
          accessibilityRole='button'
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={onPress}
        >
          <View>{icon}</View>
        </TouchableNativeFeedback>
      ) : (
        <TouchableOpacity
          testID='close-button'
          accessibilityRole='button'
          onPress={onPress}
        >
          {icon}
        </TouchableOpacity>
      )}
    </View>
  )
}

export default CloseButton
