import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  Keyboard,
  type FlatListProps,
  type ImageSourcePropType,
  type ImageStyle,
  type ModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { useCountryContext } from './CountryContext'
import { CountryFilter, type CountryFilterProps } from './CountryFilter'
import { CountryList } from './CountryList'
import { CountryModal, type ModalInsets } from './CountryModal'
import { FlagButton, type FlagButtonProps } from './FlagButton'
import { HeaderModal } from './HeaderModal'
import {
  FlagType,
  type Country,
  type CountryCode,
  type Region,
  type Subregion,
} from './types'

export interface CountryPickerProps {
  allowFontScaling?: boolean
  countryCode?: CountryCode
  region?: Region
  subregion?: Subregion
  countryCodes?: CountryCode[]
  excludeCountries?: CountryCode[]
  preferredCountries?: CountryCode[]
  modalProps?: ModalProps
  modalInsets?: ModalInsets
  filterProps?: CountryFilterProps
  flatListProps?: FlatListProps<Country>
  withEmoji?: boolean
  withCountryNameButton?: boolean
  withCurrencyButton?: boolean
  withCallingCodeButton?: boolean
  withFlagButton?: boolean
  withCloseButton?: boolean
  withFilter?: boolean
  withAlphaFilter?: boolean
  withCallingCode?: boolean
  withCurrency?: boolean
  withFlag?: boolean
  withModal?: boolean
  visible?: boolean
  placeholder?: string
  containerButtonStyle?: StyleProp<ViewStyle>
  closeButtonImage?: ImageSourcePropType
  closeButtonStyle?: StyleProp<ViewStyle>
  closeButtonImageStyle?: StyleProp<ImageStyle>
  renderFlagButton?(props: FlagButtonProps): ReactNode
  renderCountryFilter?(props: CountryFilterProps): ReactNode
  onSelect(country: Country): void
  onOpen?(): void
  onClose?(): void
}

export const CountryPicker = ({
  allowFontScaling = true,
  countryCode,
  region,
  subregion,
  countryCodes,
  renderFlagButton,
  renderCountryFilter,
  filterProps,
  modalProps,
  modalInsets,
  flatListProps,
  onSelect,
  withEmoji = true,
  withFilter,
  withCloseButton,
  withCountryNameButton,
  withCallingCodeButton,
  withCurrencyButton,
  containerButtonStyle,
  withAlphaFilter = false,
  withCallingCode = false,
  withCurrency,
  withFlag,
  withModal = true,
  withFlagButton,
  onClose: handleClose,
  onOpen: handleOpen,
  closeButtonImage,
  closeButtonStyle,
  closeButtonImageStyle,
  excludeCountries,
  placeholder = 'Select Country',
  preferredCountries,
  visible: visibleProp = false,
}: CountryPickerProps) => {
  // v2 held all four of these in one object and updated it with
  // `setState({ ...state, x })` from seven different handlers, which lost
  // updates whenever two fired against the same render's closure.
  const [visible, setVisible] = useState(visibleProp)
  const [countries, setCountries] = useState<Country[]>([])
  const [filter, setFilter] = useState('')
  const [filterFocus, setFilterFocus] = useState(false)

  const { translation, getCountriesAsync } = useCountryContext()

  // React's documented "adjusting state when a prop changes" pattern. Doing
  // this during render rather than in an effect avoids the extra commit that
  // made the modal flicker when opened via the `visible` prop.
  const [lastVisibleProp, setLastVisibleProp] = useState(visibleProp)
  if (lastVisibleProp !== visibleProp) {
    setLastVisibleProp(visibleProp)
    setVisible(visibleProp)
  }

  const onOpen = useCallback(() => {
    setVisible(true)
    handleOpen?.()
  }, [handleOpen])

  const onClose = useCallback(() => {
    // The filter input usually still holds focus, and a native modal tears
    // down without telling the keyboard, which then hangs over the screen
    // underneath. Covers every close path, including picking a country.
    Keyboard.dismiss()
    setFilter('')
    setVisible(false)
    handleClose?.()
  }, [handleClose])

  const onSelectClose = useCallback(
    (country: Country) => {
      onSelect(country)
      onClose()
    },
    [onSelect, onClose],
  )

  useEffect(() => {
    let cancelled = false
    getCountriesAsync(
      withEmoji ? FlagType.EMOJI : FlagType.FLAT,
      translation,
      region,
      subregion,
      countryCodes,
      excludeCountries,
      preferredCountries,
      withAlphaFilter,
    )
      .then((result) => {
        if (!cancelled) setCountries(result)
      })
      .catch(console.warn)

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translation, withEmoji, region, subregion, withAlphaFilter])

  const flagButtonProps: FlagButtonProps = {
    allowFontScaling,
    countryCode,
    withEmoji,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    withFlagButton,
    onOpen,
    containerButtonStyle,
    placeholder,
  }

  return (
    <>
      {withModal &&
        (renderFlagButton ? (
          renderFlagButton(flagButtonProps)
        ) : (
          <FlagButton {...flagButtonProps} />
        ))}
      {/*
        `onDismiss` is deliberately not wired to `onClose`. It is a completion
        callback: iOS fires it only once the slide-out animation has finished,
        so reopening the picker before that lands let the previous close arrive
        late and immediately shut the new modal again -- the picker appeared to
        flicker open and needed a second tap. `onRequestClose` is the intent
        callback and covers the back button and swipe dismissal. Consumers who
        want the completion hook can still pass one through `modalProps`.
      */}
      <CountryModal
        visible={visible}
        withModal={withModal}
        modalInsets={modalInsets}
        {...modalProps}
        onRequestClose={onClose}
      >
        <HeaderModal
          withFilter={withFilter}
          withCloseButton={withCloseButton}
          closeButtonImage={closeButtonImage}
          closeButtonImageStyle={closeButtonImageStyle}
          closeButtonStyle={closeButtonStyle}
          onClose={onClose}
          renderFilter={() => {
            const countryFilterProps: CountryFilterProps = {
              allowFontScaling,
              onChangeText: setFilter,
              value: filter,
              onFocus: () => setFilterFocus(true),
              onBlur: () => setFilterFocus(false),
              ...filterProps,
            }
            return renderCountryFilter ? (
              renderCountryFilter(countryFilterProps)
            ) : (
              <CountryFilter {...countryFilterProps} />
            )
          }}
        />
        <CountryList
          onSelect={onSelectClose}
          data={countries}
          withAlphaFilter={withAlphaFilter && filter === ''}
          withCallingCode={withCallingCode}
          withCurrency={withCurrency}
          withFlag={withFlag}
          withEmoji={withEmoji}
          filter={filter}
          filterFocus={filterFocus}
          flatListProps={flatListProps}
        />
      </CountryModal>
    </>
  )
}
