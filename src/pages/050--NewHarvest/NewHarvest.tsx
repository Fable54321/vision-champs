import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  Send,
  Wheat,
} from "lucide-react";

import { useCropPlans } from "../../Contexts/CropPlanContext";
import { useForeignWorkers } from "../../Contexts/ForeignWorkersContext";
import { useHarvesting } from "../../Contexts/HarvestingContext";
import { useVegetables } from "../../Contexts/vegetablesContext";
import { HarvestDetailsFields } from "./components/HarvestDetailsFields";
import { HarvestFormSection } from "./components/HarvestFormSection";
import { HarvesterField } from "./components/HarvesterField";
import { LocationAndScheduleFields } from "./components/LocationAndScheduleFields";
import { TeamLeaderField } from "./components/TeamLeaderField";
import {
  getCurrentDate,
  getCurrentDayCode,
  getCurrentTime,
  getCurrentWeekCode,
} from "./dateTime";

const NewHarvest = () => {
  const {
    createHarvestingRecord,
    creating,
    error,
    clearError,
    boxTypes,
    fetchBoxTypes,
    fields,
    fetchFields,
    harvesters,
    fetchHarvesters,
  } = useHarvesting();
  const { fetchVegetables, vegetables, fetchAllProducts, allProducts } =
    useVegetables();
  const { foreignWorkers } = useForeignWorkers();
  const { fetchCropPlans, cropPlans } = useCropPlans();

  const [teamLeaderUserId, setTeamLeaderUserId] = useState("");
  const [fieldId, setFieldId] = useState<number | string>("");
  const [harvestingDate, setHarvestingDate] = useState(getCurrentDate);
  const [harvestingTime, setHarvestingTime] = useState(getCurrentTime);
  const [vegetableId, setVegetableId] = useState<number | string>("");
  const [productId, setProductId] = useState<number | string>("");
  const [amountOfBoxes, setAmountOfBoxes] = useState("");
  const [boxType, setBoxType] = useState("");
  const [harvesterId, setHarvesterId] = useState<number | "">("");
  const [success, setSuccess] = useState(false);

  const [fieldCode, setFieldCode] = useState("");
  const [weekCode, setWeekCode] = useState("");
  const [dayCode, setDayCode] = useState("");
  const [productCode, setProductCode] = useState("");

  useEffect(() => {
    void fetchBoxTypes();
    void fetchFields();
    void fetchVegetables();
    void fetchHarvesters();
    void fetchAllProducts();
    void fetchCropPlans();
  }, [
    fetchAllProducts,
    fetchBoxTypes,
    fetchCropPlans,
    fetchFields,
    fetchHarvesters,
    fetchVegetables,
  ]);

  const teamLeaders = useMemo(
    () =>
      foreignWorkers.filter(
        (worker) =>
          worker.job_id_1 === 6 ||
          worker.job_id_2 === 6 ||
          worker.job_id_3 === 6,
      ),
    [foreignWorkers],
  );

  const handleFieldCodeChange = (nextFieldCode: string) => {
    setFieldCode(nextFieldCode);

    if (nextFieldCode.length !== 3) {
      setFieldId("");
      return;
    }

    const matchingField = fields.find(
      (field) => Number(field.field_code) === Number(nextFieldCode),
    );

    setFieldId(matchingField?.id ?? "");
  };

  const clearProductSelection = () => {
    setVegetableId("");
    setProductId("");
    setBoxType("");
  };

  const handleProductCodeChange = (nextProductCode: string) => {
    setProductCode(nextProductCode);

    if (nextProductCode.length !== 4) {
      clearProductSelection();
      return;
    }

    const matchingProduct = allProducts.find(
      (product) =>
        Number(product.product_code) === Number(nextProductCode),
    );

    if (!matchingProduct) {
      clearProductSelection();
      return;
    }

    const matchingVegetableId = Number(matchingProduct.vegetable_id);
    const matchingBoxTypes = boxTypes.filter(
      (type) => Number(type.vegetable_id) === matchingVegetableId,
    );
    const quantityFormat = matchingProduct.quantity_format?.trim() ?? "";
    const boxTypeMatchingFormat = matchingBoxTypes.find(
      (type) =>
        quantityFormat !== "" &&
        type.box_type.trim().localeCompare(quantityFormat, undefined, {
          sensitivity: "base",
        }) === 0,
    );

    setVegetableId(matchingVegetableId);
    setProductId(Number(matchingProduct.id));
    setBoxType(
      boxTypeMatchingFormat?.box_type ?? matchingBoxTypes[0]?.box_type ?? "",
    );
  };

  const resetForm = () => {
    setTeamLeaderUserId("");
    setFieldId("");
    setHarvestingDate(getCurrentDate());
    setHarvestingTime(getCurrentTime());
    setVegetableId("");
    setProductId("");
    setAmountOfBoxes("");
    setBoxType("");
    setHarvesterId("");
    setFieldCode("");
    setWeekCode(getCurrentWeekCode());
    setDayCode(getCurrentDayCode());
    setProductCode("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !vegetableId ||
      typeof vegetableId === "string" ||
      !productId ||
      typeof productId === "string" ||
      harvesterId === ""
    ) {
      return;
    }

    clearError();
    setSuccess(false);

    const created = await createHarvestingRecord({
      team_leader_user_id: Number(teamLeaderUserId),
      field_id: Number(fieldId),
      harvesting_date: harvestingDate,
      harvesting_time: harvestingTime,
      vegetable_id: vegetableId,
      product_id: productId,
      amount_of_boxes: Number(amountOfBoxes),
      box_type: boxType.trim(),
      harvester_id: harvesterId,
    });

    if (!created) return;

    setSuccess(true);
    resetForm();

    window.setTimeout(() => setSuccess(false), 3500);
  };


  return (
    <main className="relative z-10 mt-4 w-[min(99%,600px)] pb-16 sm:mt-6">
      <Link
        to="/"
        className="mb-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-deepgreen focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <ArrowLeft aria-hidden="true" size={18} />
        Volver al inicio
      </Link>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-[1.75rem]  border-white/80 bg-white shadow-[0_24px_70px_rgba(38,63,8,0.14)]"
      >
        <header className="relative overflow-hidden bg-linear-to-br from-deepgreen via-secondary to-[#6e9418] px-5 py-7 text-white sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full border-28 border-white/5" />
          <div className="pointer-events-none absolute -bottom-16 right-24 size-32 rounded-full bg-primary/15 blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/25 backdrop-blur-sm">
              <Wheat aria-hidden="true" size={25} strokeWidth={2} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Nueva cosecha
            </h1>
          </div>
        </header>

        <div className="space-y-1 py-3 px-2  sm:p-5">
          <HarvestFormSection>
            <TeamLeaderField
              teamLeaders={teamLeaders}
              value={teamLeaderUserId}
              onChange={setTeamLeaderUserId}
              fieldCode={fieldCode}
              setFieldCode={handleFieldCodeChange}
              weekCode={weekCode}
              setWeekCode={setWeekCode}
              dayCode={dayCode}
              setDayCode={setDayCode}
              productCode={productCode}
              setProductCode={handleProductCodeChange}
            />
          </HarvestFormSection>

          <HarvestFormSection>
            <LocationAndScheduleFields
              fields={fields}
              fieldId={fieldId}
              harvestingDate={harvestingDate}
              harvestingTime={harvestingTime}
              onSubfieldChange={setFieldId}
              onHarvestingDateChange={setHarvestingDate}
              onHarvestingTimeChange={setHarvestingTime}
            />
          </HarvestFormSection>

          <HarvestFormSection>
            <HarvestDetailsFields
              vegetables={vegetables}
              boxTypes={boxTypes}
              products={allProducts}
              fields={fields}
              fieldId={fieldId}
              vegetableId={vegetableId}
              productId={productId}
              boxType={boxType}
              amountOfBoxes={amountOfBoxes}
              onVegetableIdChange={setVegetableId}
              onProductIdChange={setProductId}
              onBoxTypeChange={setBoxType}
              onAmountOfBoxesChange={setAmountOfBoxes}
              cropPlans={cropPlans}
            />
          </HarvestFormSection>

          <HarvestFormSection>
            <HarvesterField
              harvesters={harvesters}
              value={harvesterId}
              onChange={setHarvesterId}
            />
          </HarvestFormSection>

          <div aria-live="polite" className="space-y-3">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 shrink-0" size={19} />
                <p className="leading-5">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
                <p className="leading-5">
                  La cosecha se registró correctamente.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-deepgreen/4.5 p-2 sm:p-3">
            <button
              type="submit"
              disabled={creating}
              className="group flex min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-linear-to-r from-secondary to-deepgreen px-5 py-3.5 font-bold text-white shadow-[0_10px_24px_rgba(38,63,8,0.22)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_14px_30px_rgba(38,63,8,0.28)] active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={20}
                />
              ) : (
                <Send
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                  size={19}
                />
              )}
              {creating ? "Guardando cosecha..." : "Registrar cosecha"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default NewHarvest;
