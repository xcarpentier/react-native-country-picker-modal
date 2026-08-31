import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface CountryModalContextParam {
  gate?: ReactNode
  teleport?(element: ReactNode): void
}

export const CountryModalContext = createContext<CountryModalContextParam>({
  gate: undefined,
  teleport: undefined,
})

export interface CountryModalProviderProps {
  children: ReactNode
}

export const CountryModalProvider = ({
  children,
}: CountryModalProviderProps) => {
  const [gate, setGate] = useState<ReactNode>(undefined)
  const teleport = useCallback((element: ReactNode) => setGate(element), [])
  const value = useMemo(() => ({ gate, teleport }), [gate, teleport])
  return (
    <CountryModalContext.Provider value={value}>
      {children}
      {gate}
    </CountryModalContext.Provider>
  )
}
