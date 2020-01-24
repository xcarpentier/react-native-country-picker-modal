import * as React from 'react'
import { ModalProps, SafeAreaView, StyleSheet, Platform } from 'react-native'
import AnimatedModal from './AnimatedModal'
import Modal from './Modal';
import { useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export const CountryModal = ({
  children,
  withModal,
  disableNativeModal,
  ...props
}: ModalProps & { children: React.ReactNode; withModal?: boolean }) => {
  const { backgroundColor } = useTheme()
  const content = (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {children}
    </SafeAreaView>
  )
  if (withModal) {
    if (Platform.OS === 'web') {
      return <Modal {...props}>{content}</Modal>
    }
    return disableNativeModal ? <AnimatedModal {...props}>{content}</AnimatedModal> : <Modal {...props}>{content}</Modal>
  }
  return content
}

CountryModal.defaultProps = {
  animationType: 'slide',
  animated: true,
  withModal: true
}
