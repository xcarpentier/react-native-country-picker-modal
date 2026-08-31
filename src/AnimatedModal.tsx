import { useEffect, useState, type ReactNode } from 'react'
import { Animated, Dimensions, StyleSheet } from 'react-native'

const DURATION = 300
const USE_NATIVE_DRIVER = true

export interface AnimatedModalProps {
  visible?: boolean
  children: ReactNode
}

export const AnimatedModal = ({
  children,
  visible = false,
}: AnimatedModalProps) => {
  const { height } = Dimensions.get('window')
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
    animation.start()
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
