import type { Harvester } from "../../../Contexts/HarvestingContext";

type HarvesterFieldProps = {
  harvesters: Harvester[];
  value: number | "";
  onChange: (value: number) => void;
};

export function HarvesterField({
  harvesters,
  value,
  onChange,
}: HarvesterFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-semibold">Cosechadora</span>

      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        required
        className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="" disabled>
          Seleccionar la cosechadora
        </option>
        {harvesters.map((harvester) => (
          <option value={harvester.id} key={harvester.id}>
            {`${harvester.harvester_number} - ${harvester.harvester_name}`}
          </option>
        ))}
      </select>
    </label>
  );
}
