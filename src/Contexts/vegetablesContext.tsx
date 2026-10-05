import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { fetchWithAuth } from "../Utils/fetchWithAuth"

export type Vegetable = {
  id: number
  vegetable: string
  is_generic: boolean
  generic_group: string | null
}

export type Cultivar = {
  id: number
  vegetable_id: number
  vegetable: string
  cultivar: string
}

export type FinishedProduct = {
  id: number
  vegetable_id: number
  full_name: string
  product_code: string
  cup: string | null
  is_active: boolean
  quantity_format: string | null
  product_type: string | null
  qty_per_pallet: number | null
  stacking_possibility: "top" | "bottom" | null
  weight: string | null
  on_hand_qty: string | null
  sold_qty: string | null
  balance_qty: string | null
  estimated_pallet_qty: string | null
}

export type RawProduct = {
  id: number;
  vegetable_id: number;
  product_code: string;
  cup_label: string;
  description: string;
  product_type: string;
  quantity_format: number;
  unit_format: string;
  product_group: string;
  qty_per_pallet: number;
  transport_weight: number;
  is_active: boolean;
}

type VegetablesContextValue = {
  vegetables: Vegetable[]
  cultivars: Cultivar[]
  finishedProducts: FinishedProduct[]
  selectedCultivar: Cultivar | null
  vegetablesLoading: boolean
  vegetablesError: string | null
  fetchVegetables: () => Promise<Vegetable[]>
  fetchCultivars: () => Promise<Cultivar[]>
  fetchFinishedProducts: () => Promise<FinishedProduct[]>
  fetchCultivar: (cultivarId: number) => Promise<Cultivar>
  createCultivar: (vegetableId: number, cultivar: string) => Promise<Cultivar>
  clearVegetablesError: () => void
}

const VegetablesContext = createContext<VegetablesContextValue | undefined>(
  undefined,
)

export function VegetablesProvider({ children }: { children: ReactNode }) {
  const [vegetables, setVegetables] = useState<Vegetable[]>([])
  const [cultivars, setCultivars] = useState<Cultivar[]>([])
  const [finishedProducts, setFinishedProducts] = useState<FinishedProduct[]>([])
  const [selectedCultivar, setSelectedCultivar] = useState<Cultivar | null>(null)
  const [vegetablesLoading, setVegetablesLoading] = useState(false)
  const [vegetablesError, setVegetablesError] = useState<string | null>(null)

  const clearVegetablesError = useCallback(() => {
    setVegetablesError(null)
  }, [])

  const runRequest = useCallback(async <T,>(request: () => Promise<T>) => {
    setVegetablesLoading(true)
    setVegetablesError(null)

    try {
      return await request()
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Impossible de récupérer les données des légumes."

      setVegetablesError(message)
      throw new Error(message, { cause: error })
    } finally {
      setVegetablesLoading(false)
    }
  }, [])

  const fetchVegetables = useCallback(() => runRequest(async () => {
    const data = await fetchWithAuth<Vegetable[]>("/vegetables")
    setVegetables(data)
    return data
  }), [runRequest])

  const fetchCultivars = useCallback(() => runRequest(async () => {
    const data = await fetchWithAuth<Cultivar[]>("/vegetables/cultivars")
    setCultivars(data)
    return data
  }), [runRequest])

  const fetchFinishedProducts = useCallback(() => runRequest(async () => {
    const data = await fetchWithAuth<FinishedProduct[]>("/finished-products")
    setFinishedProducts(data)
    return data
  }), [runRequest])

  const fetchCultivar = useCallback((cultivarId: number) => runRequest(async () => {
    if (!Number.isInteger(cultivarId) || cultivarId <= 0) {
      throw new Error("Identifiant de cultivar invalide.")
    }

    const data = await fetchWithAuth<Cultivar>(
      `/vegetables/cultivars/${encodeURIComponent(String(cultivarId))}`,
    )
    setSelectedCultivar(data)
    return data
  }), [runRequest])

  const createCultivar = useCallback((vegetableId: number, cultivar: string) => runRequest(async () => {
    const created = await fetchWithAuth<Omit<Cultivar, "vegetable">>(
      "/vegetables/cultivars",
      {
        method: "POST",
        body: { vegetable_id: vegetableId, cultivar },
      },
    )
    const vegetable = vegetables.find(({ id }) => id === created.vegetable_id)?.vegetable ?? ""
    const complete = { ...created, vegetable }
    setCultivars((current) => [...current, complete])
    return complete
  }), [runRequest, vegetables])

  const value = useMemo(() => ({
    vegetables,
    cultivars,
    finishedProducts,
    selectedCultivar,
    vegetablesLoading,
    vegetablesError,
    fetchVegetables,
    fetchCultivars,
    fetchFinishedProducts,
    fetchCultivar,
    createCultivar,
    clearVegetablesError,
  }), [
    vegetables,
    cultivars,
    finishedProducts,
    selectedCultivar,
    vegetablesLoading,
    vegetablesError,
    fetchVegetables,
    fetchCultivars,
    fetchFinishedProducts,
    fetchCultivar,
    createCultivar,
    clearVegetablesError,
  ])

  return (
    <VegetablesContext.Provider value={value}>
      {children}
    </VegetablesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVegetables() {
  const context = useContext(VegetablesContext)

  if (!context) {
    throw new Error("useVegetables must be used inside a VegetablesProvider")
  }

  return context
}
