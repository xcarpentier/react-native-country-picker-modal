import { render, screen, fireEvent } from '@testing-library/react-native'
import CountryPicker, { CountryModalProvider, DARK_THEME } from '../src/'

const flat = (s: any): any =>
  Array.isArray(s) ? Object.assign({}, ...s.map(flat)) : s && typeof s === 'object' ? s : {}
const walk = (n: any, d = 0, out: string[] = []) => {
  if (!n || typeof n !== 'object') return out
  const st = flat(n.props?.style)
  const b = []
  if (st.backgroundColor !== undefined) b.push(`bg=${st.backgroundColor}`)
  if (st.color !== undefined) b.push(`color=${st.color}`)
  if (b.length) out.push('  '.repeat(d) + n.type + (n.props?.testID ? ` #${n.props.testID}` : '') + '  ' + b.join(' '))
  for (const c of n.children ?? []) walk(c, d + 1, out)
  return out
}

it('DIAG disableNativeModal + dark theme', async () => {
  await render(
    <CountryModalProvider>
      <CountryPicker
        countryCode='US'
        countryCodes={['US', 'FR', 'GB']}
        visible
        withFilter
        disableNativeModal
        theme={DARK_THEME}
        onSelect={() => {}}
      />
    </CountryModalProvider>,
  )
  await screen.findByTestId('country-selector-US')
  console.log('\n=== disableNativeModal DARK ===\n' + walk(screen.toJSON()).join('\n'))
})

it('DIAG disableNativeModal + filter typing', async () => {
  await render(
    <CountryModalProvider>
      <CountryPicker
        countryCode='US'
        countryCodes={['US', 'FR', 'GB']}
        visible
        withFilter
        disableNativeModal
        onSelect={() => {}}
      />
    </CountryModalProvider>,
  )
  await screen.findByTestId('country-selector-US')
  const input = screen.getByTestId('text-input-country-filter')
  console.log('value BEFORE:', JSON.stringify(input.props.value))
  await fireEvent.changeText(input, 'Fran')
  console.log('value AFTER :', JSON.stringify(screen.getByTestId('text-input-country-filter').props.value))
  console.log('rows  AFTER :', screen.getAllByTestId(/^country-selector-/).map((n: any) => n.props.testID).join(','))
})
