import { type ReactNode } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
    justifyContent: 'space-between',
    padding: 10,
    paddingHorizontal: 50,
  },
})

export const Row = (
  props: ViewProps & { children?: ReactNode; fullWidth?: boolean },
) => (
  <View
    {...props}
    style={[styles.row, props.style, props.fullWidth && styles.fullWidth]}
  />
)
