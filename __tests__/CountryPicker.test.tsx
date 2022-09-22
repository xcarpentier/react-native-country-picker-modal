import React from 'react'

import {setImmediate} from 'timers'

import TestRenderer from 'react-test-renderer';

import CountryPicker from '../src/'

describe('CountryPicker', () => {
  // beforeAll(() => { jest.useFakeTimers() })
  // afterAll(()  => { jest.useRealTimers() })

  it('CountryPicker with default options', async () => {
    const picker = TestRenderer.create(
      <CountryPicker countryCode={'GB'} onSelect={() => {}} withModal={false} />,
    )
    await new Promise((yay) => setTimeout(yay, 1000))
    expect(picker).toBeDefined()
    expect(picker).toMatchSnapshot()
  })

  it('CountryPicker with translation', async () => {
    const picker = TestRenderer.create(
      <CountryPicker translation="spa" countryCode={'GB'} onSelect={() => {}} withModal={false} />,
    )
    await new Promise((yay) => setTimeout(yay, 1000))
    expect(picker).toBeDefined()
    expect(picker).toMatchSnapshot()
  })

})

// it('CountryPicker with translation', async () => {
//   const picker = TestRenderer.create(
//     <CountryPicker countryCode={'UA'} translation="fra" onSelect={() => {}}/>,
//   )
//   expect(picker).toBeDefined()
//   expect(picker).toMatchSnapshot()
  // })

// it('CountryPicker without modal', () => {
//   const picker = TestRenderer.create(
//     <CountryPicker countryCode={'US'} onSelect={() => {}} withModal={false} />,
//   )
//   expect(picker).toBeDefined()
//   expect(picker).toMatchSnapshot()
// })
