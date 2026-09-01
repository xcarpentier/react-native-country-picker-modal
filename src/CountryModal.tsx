import { useContext, useEffect, type ReactNode } from 'react'
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
  type ModalProps,
} from 'react-native'
import { AnimatedModal } from './AnimatedModal'
import { CountryProvider, useCountryContext } from './CountryContext'
import { CountryModalContext } from './CountryModalProvider'
import { ThemeProvider, useTheme } from './CountryTheme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
})

export interface ModalInsets {
  top?: number
  bottom?: number
}

export type CountryModalProps = ModalProps & {
  children: ReactNode
  withModal?: boolean
  disableNativeModal?: boolean
  modalInsets?: ModalInsets
}

export const CountryModal = ({
  children,
  withModal = true,
  disableNativeModal = false,
  animationType = 'slide',
  visible,
  onRequestClose,
  modalInsets,
  ...props
}: CountryModalProps) => {
  const theme = useTheme()
  const countryContext = useCountryContext()
  const {
    backdropColor,
    backgroundColor,
    desktopBreakpoint,
    dialogBorderRadius,
    dialogMaxHeight,
    dialogMaxWidth,
  } = theme
  const { teleport } = useContext(CountryModalContext)
  const { width } = useWindowDimensions()

  // Only web gets the dialog treatment: a native modal is already the right
  // shape on a phone, and a tablet in landscape is not a desktop.
  const isDesktopWeb = Platform.OS === 'web' && width >= desktopBreakpoint

  // Modal types onRequestClose as an event handler, but every caller here
  // treats it as a plain "the user asked to close" signal.
  const requestClose = onRequestClose as (() => void) | undefined

  // Escape is what closes a dialog on the web; on native the hardware back
  // button already routes through onRequestClose.
  useEffect(() => {
    if (Platform.OS !== 'web' || !visible || !requestClose) {
      return
    }
    const doc = globalThis.document
    if (!doc) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        requestClose()
      }
    }
    doc.addEventListener('keydown', onKeyDown)
    return () => doc.removeEventListener('keydown', onKeyDown)
  }, [visible, requestClose])

  // react-native's SafeAreaView is `Platform.select({ ios: ..., default: View })`
  // -- on Android it is a plain View that applies no insets at all. Under the
  // edge-to-edge window Android 15+ enforces, that left the header drawing
  // underneath the status bar, so Android gets explicit padding instead.
  // The navigation bar is handled by the system (see the Modal below), so the
  // bottom inset defaults to 0; apps using react-native-safe-area-context can
  // pass exact values through `modalInsets`.
  const content =
    Platform.OS === 'android' ? (
      <View
        testID='country-modal-content'
        style={[
          styles.container,
          {
            backgroundColor,
            paddingTop: modalInsets?.top ?? StatusBar.currentHeight ?? 0,
            paddingBottom: modalInsets?.bottom ?? 0,
          },
        ]}
      >
        {children}
      </View>
    ) : (
      <SafeAreaView
        testID='country-modal-content'
        style={[styles.container, { backgroundColor }]}
      >
        {children}
      </SafeAreaView>
    )

  // react-native-web supports Modal natively now, so the old Modal.web.tsx
  // shim (which imported the whole react-native module by mistake) is gone,
  // and on web the native Modal is used even when disableNativeModal is set.
  // Teleporting is therefore only correct in the cases that render nothing
  // here; otherwise the modal was rendered twice, once live and once stale.
  const usesTeleport = withModal && disableNativeModal && Platform.OS !== 'web'

  // No dependency array on purpose: the gate has to receive the current
  // element after every render, or it keeps showing a stale copy and the
  // filter input appears dead. This cannot loop, because the gate store only
  // re-renders the gate, never this component.
  useEffect(() => {
    if (usesTeleport && teleport) {
      // The gate renders inside CountryModalProvider, which sits *above* the
      // ThemeProvider and CountryProvider that wrap the picker. React resolves
      // context at the render position, so without re-providing them here the
      // teleported modal falls back to DEFAULT_THEME and the default country
      // context -- a dark theme lost its text and list colours, and a custom
      // `translation` was ignored.
      teleport(
        <ThemeProvider theme={theme}>
          <CountryProvider value={countryContext}>
            <AnimatedModal visible={visible}>{content}</AnimatedModal>
          </CountryProvider>
        </ThemeProvider>,
      )
    }
  })

  // Clearing is keyed separately so it never runs between two content pushes;
  // emptying the gate on every render would unmount the modal and cost the
  // filter input its focus on each keystroke.
  useEffect(() => {
    if (!teleport) {
      return
    }
    if (!usesTeleport) {
      teleport(null)
      return
    }
    return () => teleport(null)
  }, [usesTeleport, teleport])

  if (!withModal) {
    return content
  }
  if (usesTeleport) {
    return null
  }

  if (isDesktopWeb) {
    return (
      <Modal
        // Sliding a centred dialog up from the bottom looks wrong; only the
        // default is swapped, an explicit animationType still wins.
        animationType={animationType === 'slide' ? 'fade' : animationType}
        transparent
        visible={visible}
        onRequestClose={onRequestClose}
        {...props}
      >
        <View style={[styles.backdrop, { backgroundColor: backdropColor }]}>
          {/*
            Sits behind the dialog and fills the backdrop, so a click anywhere
            outside the card closes the picker. It is deliberately not the
            parent of the dialog: a press on a row would otherwise bubble out
            to it and close the modal on every selection.
          */}
          <Pressable
            testID='country-modal-backdrop'
            accessibilityRole='button'
            accessibilityLabel='Close country picker'
            style={StyleSheet.absoluteFill}
            onPress={requestClose}
          />
          <View
            style={[
              styles.dialog,
              {
                backgroundColor,
                borderRadius: dialogBorderRadius,
                maxHeight: dialogMaxHeight,
                maxWidth: dialogMaxWidth,
              },
            ]}
          >
            {children}
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal
      animationType={animationType}
      visible={visible}
      // Android only. RN's dialog sets fitsSystemWindows on its content frame
      // whenever statusBarTranslucent is false, and calls disableEdgeToEdge on
      // the dialog window -- so while the app window is edge-to-edge the modal
      // is not. The content was pushed down by the status bar height yet still
      // laid out full-screen tall, which slid the search bar down the screen
      // and dropped the bottom of the list off it. Going translucent keeps the
      // dialog consistent with the app window, and `content` above restores the
      // top inset. navigationBarTranslucent stays false on purpose: that leaves
      // the system inseting the dialog above the navigation bar, which is the
      // one inset core react-native cannot measure for us.
      statusBarTranslucent
      onRequestClose={onRequestClose}
      {...props}
    >
      {content}
    </Modal>
  )
}
