import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { fetchWithAuth } from "../Utils/fetchWithAuth";
// Adjust path depending on where your helper actually lives


export interface HarvestingTracking {
  id: number;

  reference_number: string;
  planting_tracking_id: number;
  harvest_date: string;

  harvested_quantity: string | null;
  quantity_unit: string | null;
  notes: string | null;

  created_at: string;
}


export interface CreateHarvestingTrackingInput {
  reference_number: string;
  planting_tracking_id: number;
  harvest_date: string;

  harvested_quantity?: number | string | null;
  quantity_unit?: string | null;
  notes?: string | null;
}


export interface UpdateHarvestingTrackingInput {
  reference_number?: string;
  planting_tracking_id?: number;
  harvest_date?: string;

  harvested_quantity?: number | string | null;
  quantity_unit?: string | null;
  notes?: string | null;
}


interface HarvestingContextType {
  harvestingRecords: HarvestingTracking[];
  selectedHarvestingRecord: HarvestingTracking | null;

  loading: boolean;
  loadingRecord: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;

  error: string | null;

  fetchHarvestingRecords: () => Promise<void>;
  fetchHarvestingRecord: (
    id: number,
  ) => Promise<HarvestingTracking | null>;

  createHarvestingRecord: (
    data: CreateHarvestingTrackingInput,
  ) => Promise<HarvestingTracking | null>;

  updateHarvestingRecord: (
    id: number,
    data: UpdateHarvestingTrackingInput,
  ) => Promise<HarvestingTracking | null>;

  deleteHarvestingRecord: (id: number) => Promise<boolean>;

  clearSelectedHarvestingRecord: () => void;
  clearError: () => void;
}


const HarvestingContext = createContext<
  HarvestingContextType | undefined
>(undefined);


interface HarvestingProviderProps {
  children: ReactNode;
}


export const HarvestingProvider = ({
  children,
}: HarvestingProviderProps) => {
  const [harvestingRecords, setHarvestingRecords] = useState<
    HarvestingTracking[]
  >([]);

  const [
    selectedHarvestingRecord,
    setSelectedHarvestingRecord,
  ] = useState<HarvestingTracking | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);


  const fetchHarvestingRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithAuth<HarvestingTracking[]>(
        "/harvesting",
      );

      setHarvestingRecords(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les récoltes.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchHarvestingRecord = useCallback(
    async (
      id: number,
    ): Promise<HarvestingTracking | null> => {
      setLoadingRecord(true);
      setError(null);

      try {
        const data =
          await fetchWithAuth<HarvestingTracking>(
            `/harvesting/${id}`,
          );

        setSelectedHarvestingRecord(data);

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de charger la récolte.";

        setError(message);

        return null;
      } finally {
        setLoadingRecord(false);
      }
    },
    [],
  );


  const createHarvestingRecord = useCallback(
    async (
      data: CreateHarvestingTrackingInput,
    ): Promise<HarvestingTracking | null> => {
      setCreating(true);
      setError(null);

      try {
        const created =
          await fetchWithAuth<HarvestingTracking>(
            "/harvesting",
            {
              method: "POST",
              body: data,
            },
          );

        setHarvestingRecords((current) => [
          created,
          ...current,
        ]);

        setSelectedHarvestingRecord(created);

        return created;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de créer la récolte.";

        setError(message);

        return null;
      } finally {
        setCreating(false);
      }
    },
    [],
  );


  const updateHarvestingRecord = useCallback(
    async (
      id: number,
      data: UpdateHarvestingTrackingInput,
    ): Promise<HarvestingTracking | null> => {
      setUpdating(true);
      setError(null);

      try {
        const updated =
          await fetchWithAuth<HarvestingTracking>(
            `/harvesting/${id}`,
            {
              method: "PATCH",
              body: data,
            },
          );

        setHarvestingRecords((current) =>
          current.map((record) =>
            record.id === id ? updated : record,
          ),
        );

        setSelectedHarvestingRecord((current) =>
          current?.id === id ? updated : current,
        );

        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de modifier la récolte.";

        setError(message);

        return null;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );


  const deleteHarvestingRecord = useCallback(
    async (id: number): Promise<boolean> => {
      setDeleting(true);
      setError(null);

      try {
        await fetchWithAuth<HarvestingTracking>(
          `/harvesting/${id}`,
          {
            method: "DELETE",
          },
        );

        setHarvestingRecords((current) =>
          current.filter((record) => record.id !== id),
        );

        setSelectedHarvestingRecord((current) =>
          current?.id === id ? null : current,
        );

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Impossible de supprimer la récolte.";

        setError(message);

        return false;
      } finally {
        setDeleting(false);
      }
    },
    [],
  );


  const clearSelectedHarvestingRecord = useCallback(() => {
    setSelectedHarvestingRecord(null);
  }, []);


  const clearError = useCallback(() => {
    setError(null);
  }, []);


  return (
    <HarvestingContext.Provider
      value={{
        harvestingRecords,
        selectedHarvestingRecord,

        loading,
        loadingRecord,
        creating,
        updating,
        deleting,

        error,

        fetchHarvestingRecords,
        fetchHarvestingRecord,
        createHarvestingRecord,
        updateHarvestingRecord,
        deleteHarvestingRecord,

        clearSelectedHarvestingRecord,
        clearError,
      }}
    >
      {children}
    </HarvestingContext.Provider>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useHarvesting = () => {
  const context = useContext(HarvestingContext);

  if (!context) {
    throw new Error(
      "useHarvesting must be used within a HarvestingProvider",
    );
  }

  return context;
};