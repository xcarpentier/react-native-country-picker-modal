import React from 'react';
import 'react-native';

import renderer from 'react-test-renderer';

import CountryPicker from '../src/CountryPicker';


test('CountryPicker can be created', () => {
  renderer.create(<CountryPicker cca2={'US'} onChange={() => {}} />);
});
