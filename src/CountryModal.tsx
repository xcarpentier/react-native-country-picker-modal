import * as React from 'react'
import { ModalProps, SafeAreaView, StyleSheet, Modal as NativeModal } from 'react-native'
import Modal from './Modal'
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
  return disableNativeModal ? <Modal {...props}>{content}</Modal> : <NativeModal {...props}>{content}</NativeModal>
  }
  return content
}

CountryModal.defaultProps = {
  animationType: 'slide',
  animated: true,
  withModal: true
}
