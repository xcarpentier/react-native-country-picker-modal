import { useContext, useEffect, type ReactNode } from 'react'
import {
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  type ModalProps,
} from 'react-native'
import { AnimatedModal } from './AnimatedModal'
import { CountryModalContext } from './CountryModalProvider'
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export type CountryModalProps = ModalProps & {
  children: ReactNode
  withModal?: boolean
  disableNativeModal?: boolean
}

export const CountryModal = ({
  children,
  withModal = true,
  disableNativeModal = false,
  animationType = 'slide',
  visible,
  ...props
}: CountryModalProps) => {
  const { backgroundColor } = useTheme()
  const { teleport } = useContext(CountryModalContext)

  const content = (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {children}
    </SafeAreaView>
  )

  useEffect(() => {
    // v2 only teleported once, keyed on disableNativeModal, so the portalled
    // modal never learned about visibility changes and could not slide away.
    if (disableNativeModal && teleport) {
      teleport(<AnimatedModal visible={visible}>{content}</AnimatedModal>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableNativeModal, visible])

  if (!withModal) {
    return content
  }
  // react-native-web supports Modal natively now, so the old Modal.web.tsx
  // shim (which imported the whole react-native module by mistake) is gone.
  if (disableNativeModal && Platform.OS !== 'web') {
    return null
  }
  return (
    <Modal animationType={animationType} visible={visible} {...props}>
      {content}
    </Modal>
  )
}
