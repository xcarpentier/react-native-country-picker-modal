/**
 * The desktop layout is platform gated, so these tests force Platform.OS to
 * 'web' and drive the viewport width across the theme's breakpoint.
 */
import { render, screen, fireEvent, act } from '@testing-library/react-native'
import { Platform, useWindowDimensions } from 'react-native'
import CountryPicker, { DEFAULT_THEME } from '../src/'

jest.mock('react-native/Libraries/Utilities/useWindowDimensions')

const mockedDimensions = jest.mocked(useWindowDimensions)

const setViewport = (width: number) =>
  mockedDimensions.mockReturnValue({
    width,
    height: 900,
    scale: 1,
    fontScale: 1,
  })

const THREE = ['US', 'FR', 'GB'] as const

const renderPicker = async (onClose: () => void) =>
  render(
    <CountryPicker
      countryCode={'US'}
      countryCodes={[...THREE]}
      visible
      withFilter
      onSelect={() => {}}
      onClose={onClose}
    />,
  )

describe('desktop web layout', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders a centred dialog above the breakpoint', async () => {
    setViewport(1440)
    await renderPicker(() => {})
    await screen.findByTestId('country-selector-US')
    expect(screen.getByTestId('country-modal-backdrop')).toBeTruthy()
  })

  it('keeps the full screen sheet below the breakpoint', async () => {
    setViewport(DEFAULT_THEME.desktopBreakpoint - 1)
    await renderPicker(() => {})
    await screen.findByTestId('country-selector-US')
    expect(screen.queryByTestId('country-modal-backdrop')).toBeNull()
  })

  it('closes when the backdrop is clicked', async () => {
    setViewport(1440)
    const onClose = jest.fn()
    await renderPicker(onClose)
    await screen.findByTestId('country-selector-US')
    await fireEvent.press(screen.getByTestId('country-modal-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  // The backdrop must not be an ancestor of the dialog, or a press on a row
  // would bubble out to it and close the picker on every selection.
  it('does not close when a row inside the dialog is clicked', async () => {
    setViewport(1440)
    const onClose = jest.fn()
    await renderPicker(onClose)
    await fireEvent.press(await screen.findByTestId('country-selector-FR'))
    expect(onClose).toHaveBeenCalledTimes(1) // from selecting, not the backdrop
  })

  // The react-native jest preset runs in node, where there is no document --
  // which is exactly the condition the component guards against on native and
  // during SSR. A minimal stub stands in so the listener itself can be tested.
  describe('escape key', () => {
    type Handler = (event: { key: string }) => void
    let handlers: Handler[]

    beforeEach(() => {
      handlers = []
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: {
          addEventListener: (_type: string, handler: Handler) =>
            handlers.push(handler),
          removeEventListener: (_type: string, handler: Handler) => {
            handlers = handlers.filter((h) => h !== handler)
          },
        },
      })
    })

    afterEach(() => {
      // @ts-expect-error deleting the stub restores the node environment
      delete globalThis.document
    })

    const press = async (key: string) => {
      await act(async () => handlers.forEach((handler) => handler({ key })))
    }

    it('closes on Escape', async () => {
      setViewport(1440)
      const onClose = jest.fn()
      await renderPicker(onClose)
      await screen.findByTestId('country-selector-US')
      await press('Escape')
      expect(onClose).toHaveBeenCalled()
    })

    it('ignores other keys', async () => {
      setViewport(1440)
      const onClose = jest.fn()
      await renderPicker(onClose)
      await screen.findByTestId('country-selector-US')
      await press('a')
      expect(onClose).not.toHaveBeenCalled()
    })

    it('removes the listener when unmounted', async () => {
      setViewport(1440)
      const view = await renderPicker(() => {})
      await screen.findByTestId('country-selector-US')
      expect(handlers).toHaveLength(1)
      await act(async () => view.unmount())
      expect(handlers).toHaveLength(0)
    })
  })
})
