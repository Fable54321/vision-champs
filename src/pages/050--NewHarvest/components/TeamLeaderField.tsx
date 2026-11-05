import {
  useMemo,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

import type { Worker } from "../../../Contexts/ForeignWorkersContext";
import { formatNames } from "../../../Utils/formatNames";
import { fieldControlClassName, fieldLabelClassName } from "./formStyles";
import { getCurrentDayCode, getCurrentWeekCode } from "../dateTime";

type TeamLeaderFieldProps = {
  teamLeaders: Worker[];
  value: string;
  onChange: (value: string) => void;
  fieldCode: string;
  setFieldCode: (value: string) => void;
  weekCode: string;
  setWeekCode: (value: string) => void;
  dayCode: string;
  setDayCode: (value: string) => void;
  productCode: string;
  setProductCode: (value: string) => void;
};

const lotSegmentLengths = [3, 2, 1, 4];

export function TeamLeaderField({
  teamLeaders,
  value,
  onChange,
  fieldCode,
  setFieldCode,
  weekCode,
  setWeekCode,
  dayCode,
  setDayCode,
  productCode,
  setProductCode,
}: TeamLeaderFieldProps) {
  const lotInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const valueAndChangers = [
    { value: fieldCode, changer: setFieldCode, placeHolder: "" },
    { value: weekCode, changer: setWeekCode, placeHolder: getCurrentWeekCode()},
    { value: dayCode, changer: setDayCode, placeHolder: getCurrentDayCode()},
    { value: productCode, changer: setProductCode, placeHolder: "" },
  ];

  const selectedTeamLeaderName = useMemo(() => {
    const selectedLeader = teamLeaders.find(
      (leader) => String(leader.id) === value,
    );

    return selectedLeader
      ? formatNames(selectedLeader.name, selectedLeader.surname)
      : "Selecciona un jefe de equipo";
  }, [teamLeaders, value]);

  const handleLotSegmentChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const digits = input.value.replace(/\D/g, "").slice(0, input.maxLength);

    valueAndChangers[index].changer(digits);

    if (digits.length === input.maxLength) {
      lotInputRefs.current[index + 1]?.focus();
    }
  };

  const handleLotSegmentPaste = (
    startIndex: number,
    event: ClipboardEvent<HTMLInputElement>,
  ) => {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!digits) return;

    event.preventDefault();

    let remainingDigits = digits;
    let focusIndex = startIndex;

    for (
      let index = startIndex;
      index < lotSegmentLengths.length && remainingDigits;
      index += 1
    ) {
      const segmentValue = remainingDigits.slice(
        0,
        lotSegmentLengths[index],
      );

      valueAndChangers[index].changer(segmentValue);
      remainingDigits = remainingDigits.slice(lotSegmentLengths[index]);
      focusIndex =
        segmentValue.length === lotSegmentLengths[index]
          ? Math.min(index + 1, lotSegmentLengths.length - 1)
          : index;
    }

    lotInputRefs.current[focusIndex]?.focus();
  };

  const handleLotSegmentKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    const input = event.currentTarget;
    const isAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

    if (event.key !== "Backspace" || index === 0 || !isAtStart) return;

    const previousInput = lotInputRefs.current[index - 1];
    const previousSegment = valueAndChangers[index - 1];

    if (!previousInput) return;

    event.preventDefault();
    const previousValue = previousSegment.value.slice(0, -1);

    previousSegment.changer(previousValue);
    previousInput.focus();
    window.requestAnimationFrame(() => {
      previousInput.setSelectionRange(previousValue.length, previousValue.length);
    });
  };

  return (
    <div className="space-y-2">
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

        <div className="grid grid-cols-4 items-center sm:gap-x-2 gap-x-1">
       
          {lotSegmentLengths.map((maxLength, index) => (
            <input
              key={index}
              ref={(input) => {
                lotInputRefs.current[index] = input;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={maxLength}
              placeholder={valueAndChangers[index].placeHolder}
              value={valueAndChangers[index].value}
              onChange={(event) => handleLotSegmentChange(index, event)}
              aria-label={`Segmento ${index + 1} del numero de lote`}
              onKeyDown={(event) => handleLotSegmentKeyDown(index, event)}
              onPaste={(event) => handleLotSegmentPaste(index, event)}
              className={`bg-slate-50 rounded-xl shadow-sm py-2 border-slate-200 text-center sm:text-[1.5rem]! text-[1.2rem]! font-bold`}
            />
          ))}
          <p className="text-center">CCC</p>
          <p className="text-center">SS</p>
          <p className="text-center">D</p>
          <p className="text-center">PPPP</p>
        </div>
      </label>
    </div>
  );
}
