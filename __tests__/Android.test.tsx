/**
 * Android edge-to-edge behaviour. react-native's SafeAreaView applies no insets
 * on Android, and RN's dialog opts out of edge-to-edge unless told otherwise,
 * so both have to be handled here rather than by the platform.
 */
import { render, screen } from '@testing-library/react-native'
import { Platform, StatusBar } from 'react-native'
import CountryPicker from '../src/'

const THREE = ['US', 'FR', 'GB'] as const

const flatten = (style: unknown): Record<string, unknown> =>
  Array.isArray(style)
    ? Object.assign({}, ...style.map(flatten))
    : style && typeof style === 'object'
      ? (style as Record<string, unknown>)
      : {}

const renderPicker = async (props: Record<string, unknown> = {}) =>
  render(
    <CountryPicker
      countryCode={'US'}
      countryCodes={[...THREE]}
      visible
      withFilter
      onSelect={() => {}}
      {...props}
    />,
  )

const modalProps = () => {
  const found: { props: Record<string, unknown> }[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { type?: string; children?: unknown[] }
    if (n.type === 'Modal')
      found.push(node as { props: Record<string, unknown> })
    ;(n.children ?? []).forEach(walk)
  }
  walk(screen.toJSON())
  return found[0]?.props
}

const contentStyle = () =>
  flatten(screen.getByTestId('country-modal-content').props.style)

describe('android', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'android')
    jest.replaceProperty(StatusBar, 'currentHeight', 24)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  // Regression: RN's dialog sets fitsSystemWindows and disables edge-to-edge
  // when statusBarTranslucent is false, which pushed the content down by the
  // status bar height while leaving it full-screen tall -- the search bar slid
  // down and the bottom of the list fell off the screen.
  it('makes the dialog status bar translucent', async () => {
    await renderPicker()
    await screen.findByTestId('country-selector-US')
    expect(modalProps()?.statusBarTranslucent).toBe(true)
  })

  // Left false on purpose: it keeps the system inseting the dialog above the
  // navigation bar, the one inset core react-native cannot measure.
  it('leaves the navigation bar opaque', async () => {
    await renderPicker()
    await screen.findByTestId('country-selector-US')
    expect(modalProps()?.navigationBarTranslucent).toBeFalsy()
  })

  it('pads the content by the status bar height', async () => {
    await renderPicker()
    await screen.findByTestId('country-selector-US')
    expect(contentStyle().paddingTop).toBe(24)
  })

  it('survives a missing StatusBar.currentHeight', async () => {
    jest.replaceProperty(StatusBar, 'currentHeight', undefined)
    await renderPicker()
    await screen.findByTestId('country-selector-US')
    expect(contentStyle().paddingTop).toBe(0)
  })

  it('lets modalInsets override the measured insets', async () => {
    await renderPicker({ modalInsets: { top: 48, bottom: 16 } })
    await screen.findByTestId('country-selector-US')
    expect(contentStyle().paddingTop).toBe(48)
    expect(contentStyle().paddingBottom).toBe(16)
  })

  it('still lets modalProps override the translucency', async () => {
    await renderPicker({ modalProps: { statusBarTranslucent: false } })
    await screen.findByTestId('country-selector-US')
    expect(modalProps()?.statusBarTranslucent).toBe(false)
  })
})

describe('ios', () => {
  beforeEach(() => jest.replaceProperty(Platform, 'OS', 'ios'))
  afterEach(() => jest.restoreAllMocks())

  // iOS gets real insets from RCTSafeAreaView, so it must not be given the
  // manual Android padding on top of them.
  it('does not apply manual padding', async () => {
    await renderPicker()
    await screen.findByTestId('country-selector-US')
    expect(contentStyle().paddingTop).toBeUndefined()
  })
})
