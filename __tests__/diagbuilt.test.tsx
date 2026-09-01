import { render, screen, fireEvent } from '@testing-library/react-native'
// deliberately import the BUILT output, which is what web/bundler consumers get
import CountryPicker, { DARK_THEME } from '../lib/commonjs/index.js'

const flat = (s: any): any =>
  Array.isArray(s) ? Object.assign({}, ...s.map(flat)) : s && typeof s === 'object' ? s : {}

const walk = (node: any, depth = 0, out: string[] = []) => {
  if (!node || typeof node !== 'object') return out
  const st = flat(node.props?.style)
  const bits = []
  if (st.backgroundColor !== undefined) bits.push(`bg=${st.backgroundColor}`)
  if (st.color !== undefined) bits.push(`color=${st.color}`)
  if (bits.length) out.push('  '.repeat(depth) + node.type + (node.props?.testID ? ` #${node.props.testID}` : '') + '  ' + bits.join(' '))
  for (const c of node.children ?? []) walk(c, depth + 1, out)
  return out
}

it('BUILT: dark theme', async () => {
  await render(
    <CountryPicker countryCode='US' countryCodes={['US','FR','GB']} visible withFilter theme={DARK_THEME} onSelect={() => {}} />,
  )
  await screen.findByTestId('country-selector-US')
  console.log('\n===== BUILT DARK =====\n' + walk(screen.toJSON()).join('\n'))
})

it('BUILT: filter', async () => {
  await render(
    <CountryPicker countryCode='US' countryCodes={['US','FR','GB']} visible withFilter onSelect={() => {}} />,
  )
  await screen.findByTestId('country-selector-US')
  await fireEvent.changeText(screen.getByTestId('text-input-country-filter'), 'Fran')
  console.log('BUILT value:', JSON.stringify(screen.getByTestId('text-input-country-filter').props.value))
  console.log('BUILT rows :', screen.getAllByTestId(/^country-selector-/).map((n:any)=>n.props.testID).join(','))
})
