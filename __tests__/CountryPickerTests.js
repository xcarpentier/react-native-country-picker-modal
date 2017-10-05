import React from 'react';
import 'react-native';

import renderer from 'react-test-renderer';

import CountryPicker from '../src/CountryPicker';


test('CountryPicker can be created', () => {
  const picker = renderer.create(<CountryPicker cca2={'US'} onChange={() => {}} />);
  expect(picker).toBeDefined();
});
