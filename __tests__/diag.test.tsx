import { render, screen } from '@testing-library/react-native'
import CountryPicker, { DARK_THEME } from '../src/'

const flat = (s: unknown): Record<string, unknown> =>
  Array.isArray(s)
    ? Object.assign({}, ...s.map(flat))
    : s && typeof s === 'object'
      ? (s as Record<string, unknown>)
      : {}

const walk = (node: any, depth = 0, out: string[] = []) => {
  if (!node || typeof node !== 'object') return out
  const st = flat(node.props?.style)
  const bits = []
  if (st.backgroundColor !== undefined) bits.push(`bg=${st.backgroundColor}`)
  if (st.color !== undefined) bits.push(`color=${st.color}`)
  if (bits.length)
    out.push(
      '  '.repeat(depth) +
        node.type +
        (node.props?.testID ? ` #${node.props.testID}` : '') +
        '  ' +
        bits.join(' '),
    )
  for (const c of node.children ?? []) walk(c, depth + 1, out)
  return out
}

it('DIAG dark', async () => {
  await render(
    <CountryPicker
      countryCode='US'
      countryCodes={['US', 'FR', 'GB']}
      visible
      withFilter
      theme={DARK_THEME}
      onSelect={() => {}}
    />,
  )
  await screen.findByTestId('country-selector-US')
  console.log('\n===== DARK =====\n' + walk(screen.toJSON()).join('\n'))
})

it('DIAG light', async () => {
  await render(
    <CountryPicker
      countryCode='US'
      countryCodes={['US', 'FR', 'GB']}
      visible
      withFilter
      onSelect={() => {}}
    />,
  )
  await screen.findByTestId('country-selector-US')
  console.log('\n===== LIGHT =====\n' + walk(screen.toJSON()).join('\n'))
})
