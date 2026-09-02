import { useEffect, useState } from 'react'

export interface AsyncState<T> {
  loading: boolean
  result?: T
  error?: Error
}

/**
 * Minimal replacement for `react-async-hook`. Runs `fn` whenever `deps`
 * change and discards the result if the effect was cleaned up first, so an
 * unmounted or superseded call can never set state.
 */
export const useAsync = <T>(
  fn: () => Promise<T>,
  deps: readonly unknown[],
): AsyncState<T> => {
  const [state, setState] = useState<AsyncState<T>>({ loading: true })

  useEffect(() => {
    let cancelled = false
    // Intentional: when the inputs change the previously resolved value is
    // stale, and rendering it would show the wrong flag until the new request
    // settles. Resetting to `loading` is the whole purpose of this hook.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ loading: true })
    fn()
      .then((result) => {
        if (!cancelled) setState({ loading: false, result })
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ loading: false, error })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
