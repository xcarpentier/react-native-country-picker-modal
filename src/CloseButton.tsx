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

const ANDROID_CLOSE_IMAGE =
  require('./assets/images/close.android.png') as ImageSourcePropType
const DEFAULT_CLOSE_IMAGE =
  require('./assets/images/close.ios.png') as ImageSourcePropType

export const CloseButton = ({
  style,
  imageStyle,
  image,
  onPress,
}: CloseButtonProps) => {
  const { onBackgroundTextColor } = useTheme()
  const isAndroid = Platform.OS === 'android'
  const source =
    image ?? (isAndroid ? ANDROID_CLOSE_IMAGE : DEFAULT_CLOSE_IMAGE)

  const icon = (
    <Image
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
