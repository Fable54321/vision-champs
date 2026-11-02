import { useMemo } from "react";

import type { Field } from "../../../Contexts/HarvestingContext";
import {
  fieldControlClassName,
  fieldLabelClassName,
} from "./formStyles";

type LocationAndScheduleFieldsProps = {
  fields: Field[];
  fieldId: string | number;
  harvestingDate: string;
  harvestingTime: string;
  onSubfieldChange: (value: string | number) => void;
  onHarvestingDateChange: (value: string) => void;
  onHarvestingTimeChange: (value: string) => void;
};

export function LocationAndScheduleFields({
  fields,
  fieldId,
  harvestingDate,
  harvestingTime,
  onSubfieldChange,
  onHarvestingDateChange,
  onHarvestingTimeChange,
}: LocationAndScheduleFieldsProps) {
  const sortedFields = useMemo(
    () =>
      [...fields].sort((a, b) =>
        a.field.localeCompare(b.field, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      ),
    [fields],
  );

  return (
    <>
      <label className="block">
        <span className={fieldLabelClassName}>Campo y parcela</span>

        <select
          value={fieldId}
          onChange={(event) => onSubfieldChange(Number(event.target.value))}
          required
          className={fieldControlClassName}
        >
          <option value="" disabled>Seleccionar un campo</option>
          {sortedFields.map((field) => {
            const label = field.field.trim();

            return (
              <option key={field.id} value={field.id}>
                {label.charAt(0).toLocaleUpperCase() + label.slice(1)}
              </option>
            );
          })}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={fieldLabelClassName}>Fecha de cosecha</span>

          <input
            type="date"
            value={harvestingDate}
            onChange={(event) => onHarvestingDateChange(event.target.value)}
            required
            className={fieldControlClassName}
          />
        </label>

        <label className="block">
          <span className={fieldLabelClassName}>Hora</span>

          <input
            type="time"
            value={harvestingTime}
            onChange={(event) => onHarvestingTimeChange(event.target.value)}
            required
            className={fieldControlClassName}
          />
        </label>
      </div>
    </>
  );
}
