import { useMemo } from "react";

import type { Field } from "../../../Contexts/HarvestingContext";

type LocationAndScheduleFieldsProps = {
  fields: Field[];
  subfield: string;
  harvestingDate: string;
  harvestingTime: string;
  onSubfieldChange: (value: string) => void;
  onHarvestingDateChange: (value: string) => void;
  onHarvestingTimeChange: (value: string) => void;
};

export function LocationAndScheduleFields({
  fields,
  subfield,
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
      <label className="flex flex-col gap-2">
        <span className="font-semibold">Campo y parcela</span>

        <select
          value={subfield}
          onChange={(event) => onSubfieldChange(event.target.value)}
          required
          className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option>Seleccionar un campo</option>
          {sortedFields.map((field) => {
            const label = field.field.trim();

            return (
              <option key={field.id} value={field.field}>
                {label.charAt(0).toLocaleUpperCase() + label.slice(1)}
              </option>
            );
          })}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Fecha de cosecha</span>

          <input
            type="date"
            value={harvestingDate}
            onChange={(event) => onHarvestingDateChange(event.target.value)}
            required
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Hora</span>

          <input
            type="time"
            value={harvestingTime}
            onChange={(event) => onHarvestingTimeChange(event.target.value)}
            required
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>
    </>
  );
}
