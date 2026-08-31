import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import CountryPicker from '../src/'
import { Country } from '../src/types'

// These tests characterise the behaviour of the component as shipped in v2.
// They must stay green across the v3 modernisation; a failure here means the
// upgrade changed observable behaviour.

const THREE = ['US', 'FR', 'GB'] as const

const renderListOnly = (props: Record<string, unknown> = {}) =>
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
    renderListOnly()
    await screen.findByTestId('country-selector-US')
    expect(rowOrder().sort()).toEqual(['FR', 'GB', 'US'])
  })

  // Guards the `Flag.defaultProps = { withFlagButton: true }` trap: with
  // withModal={false} there is no FlagButton, so an emoji here can only come
  // from a list row. Under React 19 without a real default this renders null.
  it('renders a flag inside each list row', async () => {
    renderListOnly({ withFlag: true })
    expect(await screen.findByText('🇺🇸')).toBeTruthy()
    expect(screen.getByText('🇫🇷')).toBeTruthy()
    expect(screen.getByText('🇬🇧')).toBeTruthy()
  })

  it('sorts alphabetically by translated name', async () => {
    renderListOnly()
    await screen.findByTestId('country-selector-US')
    expect(rowOrder()).toEqual(['FR', 'GB', 'US'])
  })

  it('puts preferred countries first when alpha filter is off', async () => {
    renderListOnly({ preferredCountries: ['GB'], withAlphaFilter: false })
    await screen.findByTestId('country-selector-GB')
    expect(rowOrder()[0]).toBe('GB')
  })

  it('honours excludeCountries', async () => {
    renderListOnly({ excludeCountries: ['FR'] })
    await screen.findByTestId('country-selector-US')
    expect(rowOrder()).not.toContain('FR')
  })

  it('shows calling code and currency when asked', async () => {
    renderListOnly({ withCallingCode: true, withCurrency: true })
    await screen.findByTestId('country-selector-US')
    expect(screen.getByText(/\+1/)).toBeTruthy()
    expect(screen.getByText(/USD/)).toBeTruthy()
  })

  it('passes the selected country to onSelect', async () => {
    const onSelect = jest.fn()
    renderListOnly({ onSelect })
    fireEvent.press(await screen.findByTestId('country-selector-FR'))
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))
    const country = onSelect.mock.calls[0][0] as Country
    expect(country.cca2).toBe('FR')
    expect(country.callingCode).toEqual(['33'])
    expect(country.currency).toEqual(['EUR'])
  })
})

describe('translation', () => {
  it('renders localised country names', async () => {
    renderListOnly({ translation: 'fra' })
    expect(await screen.findByText(/Royaume-Uni|United Kingdom/)).toBeTruthy()
  })
})

describe('flag button', () => {
  it('renders the placeholder when no country is selected', async () => {
    render(
      <CountryPicker
        countryCode={undefined as never}
        placeholder='Pick one'
        onSelect={() => {}}
      />,
    )
    expect(await screen.findByText('Pick one')).toBeTruthy()
  })

  it('renders the flag for the selected country', async () => {
    render(<CountryPicker countryCode={'FR'} onSelect={() => {}} />)
    expect(await screen.findByText('🇫🇷')).toBeTruthy()
  })

  it('opens the modal when pressed', async () => {
    const onOpen = jest.fn()
    render(<CountryPicker countryCode={'FR'} onOpen={onOpen} onSelect={() => {}} />)
    fireEvent.press(await screen.findByText('🇫🇷'))
    await waitFor(() => expect(onOpen).toHaveBeenCalled())
  })
})

describe('filter', () => {
  it('narrows the list to matching countries', async () => {
    renderListOnly({ withFilter: true })
    await screen.findByTestId('country-selector-US')
    fireEvent.changeText(screen.getByTestId('text-input-country-filter'), 'Fran')
    await waitFor(() => expect(rowOrder()).toEqual(['FR']))
  })
})

describe('alpha filter', () => {
  it('renders a letter index', async () => {
    renderListOnly({ withAlphaFilter: true })
    await screen.findByTestId('country-selector-US')
    expect(screen.getByTestId('letter-F')).toBeTruthy()
    expect(screen.getByTestId('letter-U')).toBeTruthy()
  })
})
