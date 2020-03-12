import { Dimensions, Platform } from 'react-native';
const { height } = Dimensions.get('window');
const ANDROID_MINUS_HEIGHT = 24;
const DEFAULT_HEIGHT = Platform.OS === 'android' ? height - ANDROID_MINUS_HEIGHT : height;
export const getHeightPercent = (percentage) => Math.round(DEFAULT_HEIGHT * (percentage / 100));
//# sourceMappingURL=ratio.js.map