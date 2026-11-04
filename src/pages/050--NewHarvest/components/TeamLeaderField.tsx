import { useMemo } from "react";

import type { Worker } from "../../../Contexts/ForeignWorkersContext";
import { formatNames } from "../../../Utils/formatNames";
import { fieldControlClassName, fieldLabelClassName } from "./formStyles";

type TeamLeaderFieldProps = {
  teamLeaders: Worker[];
  value: string;
  onChange: (value: string) => void;
};

export function TeamLeaderField({
  teamLeaders,
  value,
  onChange,
}: TeamLeaderFieldProps) {
  const selectedTeamLeaderName = useMemo(() => {
    const selectedLeader = teamLeaders.find(
      (leader) => String(leader.id) === value,
    );

    return selectedLeader
      ? formatNames(selectedLeader.name, selectedLeader.surname)
      : "Selecciona un jefe de equipo";
  }, [teamLeaders, value]);

  return (
    <div>
      <label className="block">
        <span className={fieldLabelClassName}>Jefe de equipo</span>

        <div className="relative">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            required
            className={`${fieldControlClassName} appearance-none pr-10 text-transparent`}
          >
            <option value="" disabled className="text-slate-900">
              Selecciona un jefe de equipo
            </option>
            {teamLeaders.map((leader) => {
              const fullName = formatNames(leader.name, leader.surname);

              return (
                <option
                  className="text-slate-900"
                  value={leader.id}
                  key={leader.id}
                  title={fullName}
                >
                  {fullName}
                </option>
              );
            })}
          </select>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3.5 right-10 flex items-center overflow-hidden"
          >
            <span
              className={`${selectedTeamLeaderName.length > 25 ? "move-left-right" : ""} shrink-0 whitespace-nowrap text-[15px] ${value ? "text-slate-800" : "text-slate-400"}`}
            >
              {selectedTeamLeaderName}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-500"
          >
            {"\u25BE"}
          </span>
        </div>
      </label>

            <label className="block">
              <span className={fieldLabelClassName}>Numero de lote</span>
              <input type="text" />
            </label>


    </div>
  );
}
