import type { Harvester } from "../../../Contexts/HarvestingContext";
import {
  fieldControlClassName,
  fieldLabelClassName,
} from "./formStyles";

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
    <label className="block">
      <span className={fieldLabelClassName}>Cosechadora</span>

      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        required
        className={fieldControlClassName}
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
