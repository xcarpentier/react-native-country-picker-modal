import React, { ReactNode, useState, useEffect } from 'react'
import { ModalProps, FlatListProps, StyleProp, ViewStyle } from 'react-native'
import { CountryModal } from './CountryModal'
import { HeaderModal } from './HeaderModal'
import { Country, CountryCode, FlagType, Region, Subregion } from './types'
import { CountryFilter, CountryFilterProps } from './CountryFilter'
import { FlagButton } from './FlagButton'
import { useContext } from './CountryContext'
import { CountryList } from './CountryList'

interface State {
  visible: boolean
  countries: Country[]
  filter?: string
  filterFocus?: boolean
}

const renderFlagButton = (
  props: FlagButton['props'] & CountryPickerProps['renderFlagButton']
): ReactNode =>
  props.renderFlagButton ? (
    props.renderFlagButton(props)
  ) : (
      <FlagButton {...props} />
    )

const renderFilter = (
  props: CountryFilter['props'] & CountryPickerProps['renderCountryFilter']
): ReactNode =>
  props.renderCountryFilter ? (
    props.renderCountryFilter(props)
  ) : (
      <CountryFilter {...props} />
    )

interface CountryPickerProps {
  countryCode: CountryCode
  region?: Region
  subregion?: Subregion
  countryCodes?: CountryCode[]
  modalProps?: ModalProps
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
  containerButtonStyle?: StyleProp<ViewStyle>
  renderFlagButton?(props: FlagButton['props']): ReactNode
  renderCountryFilter?(props: CountryFilter['props']): ReactNode
  onSelect(country: Country): void
  onOpen?(): void
  onClose?(): void
}

export const CountryPicker = (props: CountryPickerProps) => {
  const {
    countryCode,
    region,
    subregion,
    countryCodes,
    renderFlagButton: renderButton,
    renderCountryFilter,
    filterProps,
    modalProps,
    flatListProps,
    onSelect,
    withEmoji,
    withFilter,
    withCloseButton,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    containerButtonStyle,
    withAlphaFilter,
    withCallingCode,
    withCurrency,
    withFlag,
    withModal,
    withFlagButton,
    onClose: handleClose,
    onOpen: handleOpen
  } = props
  const [state, setState] = useState<State>({
    visible: props.visible || false,
    countries: [],
    filter: '',
    filterFocus: false
  })
  const { translation, getCountries } = useContext()
  const { visible, filter, countries, filterFocus } = state
  const onOpen = () => {
    setState({ ...state, visible: true })
    if (handleOpen) {
      handleOpen()
    }
  }
  const onClose = () => {
    setState({ ...state, filter: '', visible: false })
    if (handleClose) {
      handleClose()
    }
  }
  const setFilter = (filter: string) => setState({ ...state, filter })
  const setCountries = (countries: Country[]) =>
    setState({ ...state, countries })
  const onSelectClose = (country: Country) => {
    onSelect(country)
    onClose()
  }
  const onFocus = () => setState({ ...state, filterFocus: true })
  const onBlur = () => setState({ ...state, filterFocus: false })

  const flagProp = {
    withEmoji,
    withCountryNameButton,
    withCallingCodeButton,
    withCurrencyButton,
    withFlagButton,
    countryCode,
    renderFlagButton: renderButton,
    onOpen,
    containerButtonStyle
  }
  useEffect(() => {
    const countries = getCountries(
      withEmoji ? FlagType.EMOJI : FlagType.FLAT,
      translation,
      region,
      subregion,
      countryCodes
    )
    setCountries(countries)
  }, [translation, withEmoji])

  return (
    <>
      {withModal && renderFlagButton(flagProp)}
      <CountryModal
        {...{ visible, withModal, ...modalProps }}
        onRequestClose={onClose}
      >
        <HeaderModal
          {...{ withFilter, withCloseButton, onClose }}
          renderFilter={(props: CountryFilter['props']) =>
            renderFilter({
              ...props,
              renderCountryFilter,
              onChangeText: setFilter,
              value: filter,
              onFocus,
              onBlur,
              ...filterProps
            })
          }
        />
        <CountryList
          {...{
            onSelect: onSelectClose,
            data: countries,
            letters: [],
            withAlphaFilter: withAlphaFilter && filter === '',
            withCallingCode,
            withCurrency,
            withFlag,
            withEmoji,
            filter,
            filterFocus,
            flatListProps
          }}
        />
      </CountryModal>
    </>
  )
}

CountryPicker.defaultProps = {
  withModal: true,
  withAlphaFilter: false,
  withCallingCode: false
}
