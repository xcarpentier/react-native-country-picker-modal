import React from 'react'

import TestRenderer from 'react-test-renderer';

import CountryPicker from '../src/'

it('CountryPicker can be created', () => {
  const picker = TestRenderer.create(
    <CountryPicker countryCode={'US'} onSelect={() => {}} />,
  )
  expect(picker).toBeDefined()
  expect(picker).toMatchSnapshot()
})
