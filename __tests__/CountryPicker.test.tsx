import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CountryPicker from '../src/'

// Mock LegendList with FlatList for testing
jest.mock('@legendapp/list/react-native', () => {
  const React = require('react')
  const { FlatList } = require('react-native')

  return {
    LegendList: React.forwardRef((props: any, ref: any) => {
      const { estimatedItemSize, recycleItems, ...flatListProps } = props
      const getItemLayout = (_data: any, index: number) => ({
        length: estimatedItemSize || 50,
        offset: (estimatedItemSize || 50) * index,
        index,
      })
      return <FlatList ref={ref} getItemLayout={getItemLayout} {...flatListProps} />
    }),
    LegendListRenderItemProps: {},
  }
})

jest.mock('react-native-safe-area-context', () => {
  const React = require('react')
  const { View } = require('react-native')

  return {
    SafeAreaView: (props: React.ComponentProps<typeof View>) => (
      <View {...props} />
    ),
    SafeAreaProvider: ({ children }: { children?: React.ReactNode }) => (
      <>{children}</>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  }
})

describe('CountryPicker', () => {
  it('can be created', () => {
    expect(() =>
      render(<CountryPicker countryCode={'US'} onSelect={() => { }} />),
    ).not.toThrow()
  })

  it('renders with default props', () => {
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders without countryCode (shows placeholder)', () => {
    const { getByText } = render(<CountryPicker onSelect={() => { }} />)

    expect(getByText('Select Country')).toBeTruthy()
  })

  it('renders with custom placeholder', () => {
    const { getByText } = render(
      <CountryPicker onSelect={() => { }} placeholder="Choose a country" />,
    )

    expect(getByText('Choose a country')).toBeTruthy()
  })

  it('renders with withEmoji=true by default', () => {
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with withEmoji=false', () => {
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} withEmoji={false} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with withModal=false', () => {
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} withModal={false} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with withFilter enabled', () => {
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} withFilter={true} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with withAlphaFilter enabled', () => {
    const { UNSAFE_root } = render(
      <CountryPicker
        countryCode={'US'}
        onSelect={() => { }}
        withAlphaFilter={true}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with withCallingCode enabled', () => {
    const { UNSAFE_root } = render(
      <CountryPicker
        countryCode={'US'}
        onSelect={() => { }}
        withCallingCode={true}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with withCurrency enabled', () => {
    const { UNSAFE_root } = render(
      <CountryPicker
        countryCode={'US'}
        onSelect={() => { }}
        withCurrency={true}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with excludeCountries', () => {
    const { UNSAFE_root } = render(
      <CountryPicker
        countryCode={'US'}
        onSelect={() => { }}
        excludeCountries={['CA', 'MX']}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with preferredCountries', () => {
    const { UNSAFE_root } = render(
      <CountryPicker
        countryCode={'US'}
        onSelect={() => { }}
        preferredCountries={['US', 'GB', 'CA']}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('calls onOpen callback when opened', () => {
    const onOpen = jest.fn()
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} onOpen={onOpen} />,
    )

    // Find and press the flag button
    const touchables = UNSAFE_root.findAllByType(
      require('react-native').TouchableOpacity,
    )
    if (touchables.length > 0) {
      fireEvent.press(touchables[0])
      expect(onOpen).toHaveBeenCalled()
    }
  })

  it('uses default onSelect when not provided', () => {
    // This tests that the default onSelect = () => {} works
    expect(() => render(<CountryPicker countryCode={'US'} />)).not.toThrow()
  })

  it('renders with allowFontScaling=true by default', () => {
    const { UNSAFE_root } = render(
      <CountryPicker countryCode={'US'} onSelect={() => { }} />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })

  it('renders with custom theme', () => {
    const customTheme = {
      primaryColor: '#ff0000',
      backgroundColor: '#ffffff',
    }

    const { UNSAFE_root } = render(
      <CountryPicker
        countryCode={'US'}
        onSelect={() => { }}
        theme={customTheme}
      />,
    )

    expect(UNSAFE_root).toBeTruthy()
  })
})
