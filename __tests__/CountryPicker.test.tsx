import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native'
import { useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import CountryPicker, {
  CountryFilter,
  CountryModalProvider,
  DARK_THEME,
  type CountryFilterProps,
} from '../src/'
import { type Country } from '../src/types'

// These tests characterise the behaviour of the component as shipped in v2.
// They must stay green across the v3 modernisation; a failure here means the
// upgrade changed observable behaviour.

const THREE = ['US', 'FR', 'GB'] as const

const renderListOnly = (props: Record<string, unknown> = {}) =>
  // RNTL 14 made render/fireEvent async to support React 19's async act().
  render(
    <CountryPicker
      countryCode={'US'}
      countryCodes={[...THREE]}
      withModal={false}
      onSelect={() => {}}
      {...props}
    />,
  )

const rowOrder = () =>
  screen
    .getAllByTestId(/^country-selector-/)
    .map((n) => String(n.props.testID).replace('country-selector-', ''))

describe('country list', () => {
  it('renders a row per country', async () => {
    await renderListOnly()
    await screen.findByTestId('country-selector-US')
    expect(rowOrder().sort()).toEqual(['FR', 'GB', 'US'])
  })

  // Guards the `Flag.defaultProps = { withFlagButton: true }` trap: with
  // withModal={false} there is no FlagButton, so an emoji here can only come
  // from a list row. Under React 19 without a real default this renders null.
  it('renders a flag inside each list row', async () => {
    await renderListOnly({ withFlag: true })
    expect(await screen.findByText('🇺🇸')).toBeTruthy()
    expect(screen.getByText('🇫🇷')).toBeTruthy()
    expect(screen.getByText('🇬🇧')).toBeTruthy()
  })

  it('sorts alphabetically by translated name', async () => {
    await renderListOnly()
    await screen.findByTestId('country-selector-US')
    expect(rowOrder()).toEqual(['FR', 'GB', 'US'])
  })

  it('puts preferred countries first when alpha filter is off', async () => {
    await renderListOnly({ preferredCountries: ['GB'], withAlphaFilter: false })
    await screen.findByTestId('country-selector-GB')
    expect(rowOrder()[0]).toBe('GB')
  })

  it('honours excludeCountries', async () => {
    await renderListOnly({ excludeCountries: ['FR'] })
    await screen.findByTestId('country-selector-US')
    expect(rowOrder()).not.toContain('FR')
  })

  it('shows calling code and currency when asked', async () => {
    await renderListOnly({ withCallingCode: true, withCurrency: true })
    await screen.findByTestId('country-selector-US')
    expect(screen.getByText(/\+1/)).toBeTruthy()
    expect(screen.getByText(/USD/)).toBeTruthy()
  })

  it('passes the selected country to onSelect', async () => {
    const onSelect = jest.fn()
    await renderListOnly({ onSelect })
    await fireEvent.press(await screen.findByTestId('country-selector-FR'))
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))
    const country = onSelect.mock.calls[0][0] as Country
    expect(country.cca2).toBe('FR')
    expect(country.callingCode).toEqual(['33'])
    expect(country.currency).toEqual(['EUR'])
  })
})

describe('translation', () => {
  it('renders localised country names', async () => {
    await renderListOnly({ translation: 'fra' })
    expect(await screen.findByText(/Royaume-Uni|United Kingdom/)).toBeTruthy()
  })
})

describe('flag button', () => {
  it('renders the placeholder when no country is selected', async () => {
    await render(
      <CountryPicker
        countryCode={undefined as never}
        placeholder='Pick one'
        onSelect={() => {}}
      />,
    )
    expect(await screen.findByText('Pick one')).toBeTruthy()
  })

  it('renders the flag for the selected country', async () => {
    await render(<CountryPicker countryCode={'FR'} onSelect={() => {}} />)
    expect(await screen.findByText('🇫🇷')).toBeTruthy()
  })

  it('opens the modal when pressed', async () => {
    const onOpen = jest.fn()
    await render(
      <CountryPicker countryCode={'FR'} onOpen={onOpen} onSelect={() => {}} />,
    )
    await fireEvent.press(await screen.findByText('🇫🇷'))
    await waitFor(() => expect(onOpen).toHaveBeenCalled())
  })
})

describe('filter', () => {
  it('narrows the list to matching countries', async () => {
    await renderListOnly({ withFilter: true })
    await screen.findByTestId('country-selector-US')
    await fireEvent.changeText(
      screen.getByTestId('text-input-country-filter'),
      'Fran',
    )
    await waitFor(() => expect(rowOrder()).toEqual(['FR']))
  })
})

describe('alpha filter', () => {
  it('renders a letter index', async () => {
    await renderListOnly({ withAlphaFilter: true })
    await screen.findByTestId('country-selector-US')
    expect(screen.getByTestId('letter-F')).toBeTruthy()
    expect(screen.getByTestId('letter-U')).toBeTruthy()
  })

  const columnStyles = () => {
    const column = screen.getByTestId('alpha-filter-letters')
    const merge = (style: unknown) =>
      Object.assign({}, ...[style].flat()) as Record<string, unknown>
    return {
      box: merge(column.props.style),
      content: merge(column.props.contentContainerStyle),
    }
  }

  // The column sits in a row beside the country list; without a cap its
  // flex: 1 lets it stretch and take width away from the names.
  it('caps the letter column at 20 wide', async () => {
    await renderListOnly({ withAlphaFilter: true })
    await screen.findByTestId('country-selector-US')
    expect(columnStyles().content.maxWidth).toBe(20)
  })

  // Regression: capping only the content container left the scroll view itself
  // free to grow. react-native-web puts flexGrow: 1 on every ScrollView, so on
  // web the column took half the row while iOS and Android sized it to its
  // content -- the same code looked right on native and wrong on web.
  it('pins the scroll view box so web cannot stretch it', async () => {
    await renderListOnly({ withAlphaFilter: true })
    await screen.findByTestId('country-selector-US')
    const { box } = columnStyles()
    expect(box.width).toBe(20)
    expect(box.flexGrow).toBe(0)
    expect(box.flexShrink).toBe(0)
  })

  // 26 letters at 23px need 598px, more than a 640px web dialog leaves below
  // the header, so fixed-height letters overflowed and the last one was
  // clipped against the card's rounded corner.
  it('lets the letters shrink rather than overflow a short column', async () => {
    await renderListOnly({ withAlphaFilter: true })
    await screen.findByTestId('country-selector-US')
    const letter = Object.assign(
      {},
      ...[screen.getByTestId('letter-U').props.style].flat(),
    )
    expect(letter.flexShrink).toBe(1)
    expect(letter.minHeight).toBe(0)
  })

  // flex: 1 compiles to flex-basis: 0% on web, which collapses the column the
  // letters are meant to spread down.
  it('grows the letter content without a zero basis', async () => {
    await renderListOnly({ withAlphaFilter: true })
    await screen.findByTestId('country-selector-US')
    const { content } = columnStyles()
    expect(content.flexGrow).toBe(1)
    expect(content.flex).toBeUndefined()
  })
})

describe('dark theme', () => {
  const flatten = (style: unknown): Record<string, unknown> =>
    Array.isArray(style)
      ? Object.assign({}, ...style.map(flatten))
      : style && typeof style === 'object'
        ? (style as Record<string, unknown>)
        : {}

  // The filter input and the row labels both colour themselves from
  // theme.onBackgroundTextColor, so they show whether the theme reached the
  // subtree at all.
  const themedColors = () => ({
    filter: flatten(screen.getByTestId('text-input-country-filter').props.style)
      .color,
    row: flatten(screen.getByText(/United States/).props.style).color,
  })

  it('applies the dark theme inside the native modal', async () => {
    await render(
      <CountryPicker
        countryCode={'US'}
        countryCodes={[...THREE]}
        visible
        withFilter
        theme={DARK_THEME}
        onSelect={() => {}}
      />,
    )
    await screen.findByTestId('country-selector-US')
    expect(themedColors().filter).toBe(DARK_THEME.onBackgroundTextColor)
    expect(themedColors().row).toBe(DARK_THEME.onBackgroundTextColor)
  })

  // Regression: the teleported modal renders inside CountryModalProvider,
  // which sits above the picker's ThemeProvider. Without re-providing the
  // theme at the gate, every useTheme() call there fell back to DEFAULT_THEME
  // and the modal came out light even though DARK_THEME was passed.
  it('applies the dark theme inside the teleported modal', async () => {
    // The modal is teleported on the false -> true transition, matching how a
    // user opens it, so the list has finished loading by then.
    const picker = (visible: boolean) => (
      <CountryModalProvider>
        <CountryPicker
          countryCode={'US'}
          countryCodes={[...THREE]}
          visible={visible}
          withFilter
          disableNativeModal
          theme={DARK_THEME}
          onSelect={() => {}}
        />
      </CountryModalProvider>
    )
    const view = await render(picker(false))
    await view.rerender(picker(true))
    await screen.findByTestId('country-selector-US')
    expect(themedColors().filter).toBe(DARK_THEME.onBackgroundTextColor)
    expect(themedColors().row).toBe(DARK_THEME.onBackgroundTextColor)
  })

  // iOS renders a light keyboard over a dark modal unless it is told
  // otherwise, so keyboardAppearance rides along with the theme.
  it('asks for a dark keyboard under the dark theme', async () => {
    await renderListOnly({ withFilter: true, theme: DARK_THEME })
    await screen.findByTestId('country-selector-US')
    expect(
      screen.getByTestId('text-input-country-filter').props.keyboardAppearance,
    ).toBe('dark')
  })

  it('asks for a light keyboard under the default theme', async () => {
    await renderListOnly({ withFilter: true })
    await screen.findByTestId('country-selector-US')
    expect(
      screen.getByTestId('text-input-country-filter').props.keyboardAppearance,
    ).toBe('light')
  })

  it('lets filterProps override the keyboard appearance', async () => {
    await renderListOnly({
      withFilter: true,
      theme: DARK_THEME,
      filterProps: { keyboardAppearance: 'default' },
    })
    await screen.findByTestId('country-selector-US')
    expect(
      screen.getByTestId('text-input-country-filter').props.keyboardAppearance,
    ).toBe('default')
  })
})

describe('filter inside a modal', () => {
  const openTeleported = async (extra: Record<string, unknown> = {}) => {
    const picker = (visible: boolean) => (
      <CountryModalProvider>
        <CountryPicker
          countryCode={'US'}
          countryCodes={[...THREE]}
          visible={visible}
          withFilter
          disableNativeModal
          onSelect={() => {}}
          {...extra}
        />
      </CountryModalProvider>
    )
    // Teleport on the false -> true transition, as pressing the flag does.
    const view = await render(picker(false))
    await view.rerender(picker(true))
    await screen.findByTestId('country-selector-US')
  }

  const type = async (text: string) =>
    fireEvent.changeText(screen.getByTestId('text-input-country-filter'), text)

  it('narrows the list inside the native modal', async () => {
    await render(
      <CountryPicker
        countryCode={'US'}
        countryCodes={[...THREE]}
        visible
        withFilter
        onSelect={() => {}}
      />,
    )
    await screen.findByTestId('country-selector-US')
    await type('Fran')
    await waitFor(() => expect(rowOrder()).toEqual(['FR']))
  })

  // Regression: the teleported element used to be pushed to the gate only on
  // a visibility change, so the gate rendered a snapshot taken when the modal
  // opened. Typing updated the picker's state but never the visible modal, so
  // the search box looked completely dead.
  it('narrows the list inside the teleported modal', async () => {
    await openTeleported()
    await type('Fran')
    await waitFor(() => expect(rowOrder()).toEqual(['FR']))
    expect(screen.getByTestId('text-input-country-filter').props.value).toBe(
      'Fran',
    )
  })

  // The gate must reconcile the pushed element rather than remount it. A
  // remount would drop the keyboard on every keystroke on a real device,
  // which no assertion on the rendered value would catch.
  it('does not remount the filter input while typing', async () => {
    const onMount = jest.fn()
    const CountingFilter = (props: CountryFilterProps) => {
      useEffect(() => onMount(), [])
      return <CountryFilter {...props} />
    }
    await openTeleported({
      renderCountryFilter: (props: CountryFilterProps) => (
        <CountingFilter {...props} />
      ),
    })
    expect(onMount).toHaveBeenCalledTimes(1)
    await type('F')
    await type('Fr')
    await type('Fra')
    await waitFor(() => expect(rowOrder()).toEqual(['FR']))
    expect(onMount).toHaveBeenCalledTimes(1)
  })
})

describe('opening and closing', () => {
  // Mirrors example/App.tsx: a controlled `visible` plus onOpen/onClose.
  const Harness = () => {
    const [visible, setVisible] = useState(false)
    return (
      <CountryPicker
        countryCode={'US'}
        countryCodes={[...THREE]}
        visible={visible}
        withFilter
        onSelect={() => {}}
        onOpen={() => setVisible(true)}
        onClose={() => setVisible(false)}
      />
    )
  }

  const modalNode = () => {
    const found: { props: Record<string, unknown> }[] = []
    const walk = (node: unknown) => {
      if (!node || typeof node !== 'object') return
      const n = node as { type?: string; children?: unknown[] }
      if (n.type === 'Modal')
        found.push(node as { props: Record<string, unknown> })
      ;(n.children ?? []).forEach(walk)
    }
    walk(screen.toJSON())
    return found[0]
  }

  const isOpen = () => modalNode()?.props?.visible === true

  const press = async (testID: string) =>
    fireEvent.press(screen.getByTestId(testID))

  // Regression: onDismiss was wired to onClose. iOS fires it only once the
  // slide-out animation finishes, so reopening the picker quickly let the
  // previous close land late and shut the new modal again -- it flickered
  // open and needed a second tap.
  it('stays open when a late dismissal lands after re-opening', async () => {
    await render(<Harness />)
    await press('country-picker-button')
    expect(isOpen()).toBe(true)

    await press('close-button')
    expect(isOpen()).toBe(false)

    await press('country-picker-button')
    expect(isOpen()).toBe(true)

    // The native dismissal for the PREVIOUS close arrives now.
    const onDismiss = modalNode()?.props?.onDismiss as (() => void) | undefined
    if (onDismiss) {
      await act(async () => onDismiss())
    }
    expect(isOpen()).toBe(true)
  })

  it('still lets modalProps supply its own onDismiss', async () => {
    const onDismiss = jest.fn()
    await render(
      <CountryPicker
        countryCode={'US'}
        countryCodes={[...THREE]}
        visible
        modalProps={{ onDismiss }}
        onSelect={() => {}}
      />,
    )
    await screen.findByTestId('country-selector-US')
    expect(modalNode()?.props?.onDismiss).toBe(onDismiss)
  })

  describe('keyboard', () => {
    // The filter input keeps focus as the modal tears down, leaving the
    // keyboard floating over the screen underneath.
    it('dismisses the keyboard when closed with the close button', async () => {
      const dismiss = jest.spyOn(Keyboard, 'dismiss')
      await render(<Harness />)
      await press('country-picker-button')
      await screen.findByTestId('country-selector-US')
      dismiss.mockClear()
      await press('close-button')
      expect(dismiss).toHaveBeenCalled()
      dismiss.mockRestore()
    })

    it('dismisses the keyboard when a country is picked', async () => {
      const dismiss = jest.spyOn(Keyboard, 'dismiss')
      await render(<Harness />)
      await press('country-picker-button')
      await screen.findByTestId('country-selector-FR')
      dismiss.mockClear()
      await press('country-selector-FR')
      expect(dismiss).toHaveBeenCalled()
      dismiss.mockRestore()
    })
  })
})
