import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fetchWithAuth } from "../Utils/fetchWithAuth";

const CROP_PLANS_PATH = "/trackability/crop-plans";

export type CropPlan = {
  id: number;
  season: number;
  responsible: string;
  culture_id: number;
  planned_product_id: number | null;
  cultivar_id: number | null;
  planting_type: string;
  seeding_number: number | null;
  expected_harvest_date: string | null;
  field_id: number | null;
  planned_area: string | number | null;
  area_unit: string | null;
  bed_start: string | null;
  bed_end: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
  crop_plan_number: number;
  planting_date: string | null;
};

export type CreateCropPlanPayload = {
  season: number;
  responsible: string;
  culture_id: number;
  planting_type: string;
  planned_product_id?: number | null;
  cultivar_id?: number | null;
  seeding_number?: number | null;
  expected_harvest_date?: string | null;
  field_id?: number | null;
  planned_area?: string | number | null;
  area_unit?: string | null;
  bed_start?: number | null;
  bed_end?: number | null;
  notes?: string | null;
  user_id: number;
  planting_date: string | null;
};

export type CropPlanNumber = {
  next_crop_plan_number: number;
}



type CulturePlanContextValue = {
  cropPlans: CropPlan[];
  selectedCropPlan: CropPlan | null;
  cropPlansLoading: boolean;
  cropPlansError: string | null;
  fetchCropPlans: () => Promise<CropPlan[]>;
  fetchCropPlan: (id: number) => Promise<CropPlan>;
  deleteCropPlan: (id: number) => Promise<CropPlan>;
  clearCropPlansError: () => void;
};

const CulturePlanContext = createContext<CulturePlanContextValue | undefined>(
  undefined,
);

function cropPlanPath(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Identifiant du plan de culture invalide.");
  }

  return `${CROP_PLANS_PATH}/${encodeURIComponent(String(id))}`;
}

export function CulturePlanProvider({ children }: { children: ReactNode }) {
  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [selectedCropPlan, setSelectedCropPlan] = useState<CropPlan | null>(
    null,
  );
  const [cropPlansLoading, setCropPlansLoading] = useState(false);
  const [cropPlansError, setCropPlansError] = useState<string | null>(null);
 

  const clearCropPlansError = useCallback(() => {
    setCropPlansError(null);
  }, []);

  const runRequest = useCallback(
    async <T,>(request: () => Promise<T>, fallbackMessage: string) => {
      setCropPlansLoading(true);
      setCropPlansError(null);

      try {
        return await request();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : fallbackMessage;
        setCropPlansError(message);
        throw new Error(message, { cause: error });
      } finally {
        setCropPlansLoading(false);
      }
    },
    [],
  );

  const fetchCropPlans = useCallback(
    () =>
      runRequest(async () => {
        const records = await fetchWithAuth<CropPlan[]>(CROP_PLANS_PATH);
        setCropPlans(records);
        return records;
      }, "Impossible de récupérer les plans de culture."),
    [runRequest],
  );

  const fetchCropPlan = useCallback(
    (id: number) =>
      runRequest(async () => {
        const record = await fetchWithAuth<CropPlan>(cropPlanPath(id));
        setSelectedCropPlan(record);
        return record;
      }, "Impossible de récupérer ce plan de culture."),
    [runRequest],
  );







  const deleteCropPlan = useCallback(
    (id: number) =>
      runRequest(async () => {
        const deleted = await fetchWithAuth<CropPlan>(cropPlanPath(id), {
          method: "DELETE",
        });

        setCropPlans((current) =>
          current.filter((cropPlan) => cropPlan.id !== deleted.id),
        );
        setSelectedCropPlan((current) =>
          current?.id === deleted.id ? null : current,
        );
        return deleted;
      }, "Impossible de supprimer le plan de culture."),
    [runRequest],
  );

  const value = useMemo(
    () => ({
      cropPlans,
      selectedCropPlan,
      cropPlansLoading,
      cropPlansError,
      fetchCropPlans,
      fetchCropPlan,
      deleteCropPlan,
      clearCropPlansError,
    }),
    [
      cropPlans,
      selectedCropPlan,
      cropPlansLoading,
      cropPlansError,
      fetchCropPlans,
      fetchCropPlan,
      deleteCropPlan,
      clearCropPlansError,
    ],
  );

  return (
    <CulturePlanContext.Provider value={value}>
      {children}
    </CulturePlanContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCulturePlans() {
  const context = useContext(CulturePlanContext);

  if (!context) {
    throw new Error(
      "useCulturePlans must be used inside a CulturePlanProvider",
    );
  }

  return context;
}
