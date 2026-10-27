import { useMemo } from "react";

import type { Worker } from "../../../Contexts/ForeignWorkersContext";
import { formatNames } from "../../../Utils/formatNames";

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
    <label className="flex flex-col gap-2">
      <span className="font-semibold">Jefe de equipo</span>

      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          className="w-full appearance-none rounded-xl border border-slate-300 px-3 py-2.5 text-transparent outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          className="pointer-events-none absolute inset-y-0 left-3 right-9 flex items-center overflow-hidden"
        >
          <span
            className={` ${selectedTeamLeaderName.length > 20 ? "move-left-right" : ""} shrink-0 whitespace-nowrap text-slate-900`}
          >
            {selectedTeamLeaderName}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-600"
        >
          {"\u25BE"}
        </span>
      </div>
    </label>
  );
}
