/**
 * The teleported modal (disableNativeModal) positions itself with a translateY
 * animation, so "did it actually arrive on screen" is a behaviour worth
 * pinning: when it does not, the modal sits a full screen height down and only
 * its header peeks above the bottom edge.
 */
import { render, screen, act, fireEvent } from '@testing-library/react-native'
import { Platform } from 'react-native'
import CountryPicker, { CountryModalProvider } from '../src/'

const THREE = ['US', 'FR', 'GB'] as const

const offsets = () => {
  const found: number[] = []
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return
    const n = node as { props?: { style?: unknown }; children?: unknown[] }
    const style = Array.isArray(n.props?.style)
      ? Object.assign({}, ...n.props.style.filter(Boolean))
      : n.props?.style
    const transform = (style as { transform?: { translateY?: number }[] })
      ?.transform
    const translateY = transform?.find((t) => t.translateY !== undefined)
    if (translateY?.translateY !== undefined) found.push(translateY.translateY)
    ;(n.children ?? []).forEach(walk)
  }
  walk(screen.toJSON())
  return found
}

const picker = (visible: boolean) => (
  <CountryModalProvider>
    <CountryPicker
      countryCode={'US'}
      countryCodes={[...THREE]}
      visible={visible}
      withFilter
      disableNativeModal
      onSelect={() => {}}
    />
  </CountryModalProvider>
)

const settle = async () => {
  await act(async () => {
    jest.advanceTimersByTime(1000)
  })
}

describe.each(['android', 'ios'] as const)('teleported modal on %s', (os) => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', os)
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  // Regression: with useNativeDriver the JS-side value stayed frozen at the
  // starting offset, and because the gate is handed fresh content on every
  // render, each re-render reasserted that stale offset over the native
  // animation. The modal never arrived -- it sat one screen height down.
  it('slides fully on screen when opened', async () => {
    const view = await render(picker(false))
    await view.rerender(picker(true))
    await settle()
    expect(offsets()).toContain(0)
  })

  it('stays on screen while the filter is being typed into', async () => {
    const view = await render(picker(false))
    await view.rerender(picker(true))
    await settle()
    for (const text of ['F', 'Fr', 'Fra']) {
      await fireEvent.changeText(
        screen.getByTestId('text-input-country-filter'),
        text,
      )
    }
    await settle()
    expect(offsets()).toContain(0)
  })

  // The opening slide is interrupted here (the rerender restarts the effect
  // mid-flight). Position is visibility for this modal, so being interrupted
  // must never leave it parked below the screen.
  it('still arrives on screen when the opening slide is interrupted', async () => {
    const view = await render(picker(false))
    await view.rerender(picker(true))
    await act(async () => {
      jest.advanceTimersByTime(50)
    })
    await view.rerender(picker(true))
    await settle()
    expect(offsets()).toContain(0)
  })

  it('slides back off screen when closed', async () => {
    const view = await render(picker(false))
    await view.rerender(picker(true))
    await settle()
    await view.rerender(picker(false))
    await settle()
    expect(offsets().some((y) => y > 0)).toBe(true)
  })
})
