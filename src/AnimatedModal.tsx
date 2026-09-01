import { useEffect, useState, type ReactNode } from 'react'
import { Animated, StyleSheet, useWindowDimensions } from 'react-native'

const DURATION = 300
// Deliberately the JS driver. Under the native driver the JS-side value stays
// frozen at whatever it was when the animation started, and this modal now
// re-renders on every keystroke in the filter, because the gate is handed fresh
// content each render. Each of those re-renders reasserted the stale offset
// over the native animation, so the modal stayed parked a full screen height
// down: on Android you saw the search bar near the bottom of the screen with
// the list below the viewport. A 300ms translate on the JS thread is cheap, and
// this path only runs when disableNativeModal is set.
const USE_NATIVE_DRIVER = false

export interface AnimatedModalProps {
  visible?: boolean
  children: ReactNode
}

export const AnimatedModal = ({
  children,
  visible = false,
}: AnimatedModalProps) => {
  // Reactive, unlike Dimensions.get('window'): on Android the window height
  // changes as the system bars and keyboard come and go, and a stale value here
  // is what the modal slides back to when it closes.
  const { height } = useWindowDimensions()
  // v2 created a fresh Animated.Value on every render, so any parent re-render
  // restarted the slide from off-screen. Lazy state keeps one value for the
  // lifetime of the component without reading a ref during render.
  const [translateY] = useState(() => new Animated.Value(height))

  useEffect(() => {
    const animation = Animated.timing(translateY, {
      toValue: visible ? 0 : height,
      duration: DURATION,
      useNativeDriver: USE_NATIVE_DRIVER,
    })
    animation.start(({ finished }) => {
      // In this modal the offset *is* the visibility: parked at `height` it is
      // entirely below the screen. So an interrupted opening slide must not be
      // left wherever it stopped, or the modal is simply never seen. Closing
      // needs no such guard -- the next effect animates it away regardless.
      if (!finished && visible) {
        translateY.setValue(0)
      }
    })
    return () => animation.stop()
  }, [visible, height, translateY])

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ translateY }], zIndex: 99 },
      ]}
    >
      {children}
    </Animated.View>
  )
}
