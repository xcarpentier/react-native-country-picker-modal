import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

/**
 * React Native has no portals, so the modal content is pushed up to this
 * provider and rendered as a sibling of the app tree, above everything else.
 *
 * v3 keeps the pushed element in an external store rather than provider state.
 * With state, every push re-rendered the provider and therefore the picker,
 * which produced a new element and pushed again -- an infinite loop. v2 dodged
 * that by pushing only once per visibility change, which froze the modal: the
 * gate kept rendering the element captured when the modal opened, so typing in
 * the filter updated the picker's state but never the modal the user could see.
 * Only the gate subscribes to this store, so pushing re-renders the gate alone
 * and the loop cannot form.
 */
interface GateStore {
  subscribe(listener: () => void): () => void
  getSnapshot(): ReactNode
  set(element: ReactNode): void
}

const createGateStore = (): GateStore => {
  let element: ReactNode = null
  const listeners = new Set<() => void>()
  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => element,
    set(next) {
      if (next === element) {
        return
      }
      element = next
      listeners.forEach((listener) => listener())
    },
  }
}

export interface CountryModalContextParam {
  teleport?(element: ReactNode): void
}

export const CountryModalContext = createContext<CountryModalContextParam>({
  teleport: undefined,
})

const Gate = ({ store }: { store: GateStore }) => {
  const element = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  )
  return <>{element}</>
}

export interface CountryModalProviderProps {
  children: ReactNode
}

export const CountryModalProvider = ({
  children,
}: CountryModalProviderProps) => {
  // Lazy state, matching AnimatedModal: one store for the lifetime of the
  // provider without reading a ref during render.
  const [store] = useState(createGateStore)

  const teleport = useCallback(
    (element: ReactNode) => store.set(element),
    [store],
  )
  // Stable, so pushing a new modal never re-renders `children`.
  const value = useMemo(() => ({ teleport }), [teleport])

  return (
    <CountryModalContext.Provider value={value}>
      {children}
      <Gate store={store} />
    </CountryModalContext.Provider>
  )
}
