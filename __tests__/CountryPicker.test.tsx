import React from 'react'

import { create } from 'react-test-renderer'

import CountryPicker from '../src/'

it('CountryPicker can be created', () => {
  const picker = create(
    <CountryPicker countryCode={'US'} onSelect={() => {}} />,
  )
  expect(picker).toBeDefined()
  expect(picker).toMatchSnapshot()
})
