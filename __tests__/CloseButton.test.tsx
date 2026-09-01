/**
 * Kept out of Android.test.tsx on purpose: swapping Platform.OS repeatedly
 * inside a single test interferes with the country list's async load, so each
 * platform gets its own isolated test here.
 */
import { render, screen } from '@testing-library/react-native'
import { Platform } from 'react-native'
import CountryPicker from '../src/'

const THREE = ['US', 'FR', 'GB'] as const

const renderPicker = async (props: Record<string, unknown> = {}) =>
  render(
    <CountryPicker
      countryCode={'US'}
      countryCodes={[...THREE]}
      visible
      onSelect={() => {}}
      {...props}
    />,
  )

const closeIconSource = async () => {
  await screen.findByTestId('country-selector-US')
  return screen.getByTestId('close-button-image').props.source
}

describe('close icon', () => {
  afterEach(() => jest.restoreAllMocks())

  // Regression: the picker shipped close.ios.png and close.android.png. Both
  // were the same X glyph, so the split only made the icon render at two
  // different weights -- the iOS asset was mostly padding and came out as a
  // ~9px hairline inside the 25px frame.
  it.each(['ios', 'android', 'web'] as const)(
    'uses the shared asset on %s',
    async (os) => {
      jest.replaceProperty(Platform, 'OS', os)
      await renderPicker()
      expect(await closeIconSource()).toStrictEqual(
        require('../src/assets/images/close.png'),
      )
    },
  )

  it('lets closeButtonImage override it', async () => {
    const custom = { uri: 'https://example.com/x.png' }
    await renderPicker({ closeButtonImage: custom })
    expect(await closeIconSource()).toStrictEqual(custom)
  })
})
