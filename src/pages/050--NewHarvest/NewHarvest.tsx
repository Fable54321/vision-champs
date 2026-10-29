import { useEffect, useMemo, useState, type FormEvent } from "react";

import { useForeignWorkers } from "../../Contexts/ForeignWorkersContext";
import { useHarvesting } from "../../Contexts/HarvestingContext";
import { useVegetables } from "../../Contexts/vegetablesContext";
import { HarvestDetailsFields } from "./components/HarvestDetailsFields";
import { HarvesterField } from "./components/HarvesterField";
import { LocationAndScheduleFields } from "./components/LocationAndScheduleFields";
import { TeamLeaderField } from "./components/TeamLeaderField";
import { getCurrentDate } from "./dateTime";
import { useCropPlans } from "../../Contexts/CropPlanContext";

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
  const [harvestingTime, setHarvestingTime] = useState(("09:41"));
  const [vegetableId, setVegetableId] = useState<number | string>("");
  const [productId, setProductId] = useState<number | string>("");
  const [amountOfBoxes, setAmountOfBoxes] = useState("");
  const [boxType, setBoxType] = useState("");
  const [harvesterId, setHarvesterId] = useState<number | "">("");
  const [success, setSuccess] = useState(false);

  // // useEffect(() => {
  // //   const interval = setInterval(() => {
  // //     setHarvestingTime(getCurrentTime());
  // //   }, 60_000);

  //   return () => clearInterval(interval);
  // }, []);

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
    fetchFields,
    fetchHarvesters,
    fetchVegetables,
    fetchCropPlans
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



  const resetForm = () => {
    setTeamLeaderUserId("");
    setFieldId("");
    setHarvestingDate("");
    setHarvestingTime("");
    setVegetableId("");
    setProductId("");
    setAmountOfBoxes("");
    setBoxType("");
    setHarvesterId("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!vegetableId || typeof vegetableId === "string") {
      throw new Error("El cultivo es obligatorio");
    }

    if (!productId || typeof productId === "string") {
      throw new Error("El producto es obligatorio");
    }

    if (harvesterId === "") {
      throw new Error("La cosechadora es obligatoria");
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

    if (!created) {
      return;
    }

    setSuccess(true);
    resetForm();

    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };



  useEffect(() => {
    console.log(fieldId);
  },[fieldId])
 


  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex w-[min(100%,550px)] flex-col gap-5 rounded-2xl bg-white/50 p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold">Nueva cosecha</h2>

      <TeamLeaderField
        teamLeaders={teamLeaders}
        value={teamLeaderUserId}
        onChange={setTeamLeaderUserId}
      />

      <LocationAndScheduleFields
        fields={fields}
        fieldId={fieldId}
        harvestingDate={harvestingDate}
        harvestingTime={harvestingTime}
        onSubfieldChange={setFieldId}
        onHarvestingDateChange={setHarvestingDate}
        onHarvestingTimeChange={setHarvestingTime}
      />

      <HarvestDetailsFields
        vegetables={vegetables}
        boxTypes={boxTypes}
        products={allProducts}
        fields={fields}
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

      <HarvesterField
        harvesters={harvesters}
        value={harvesterId}
        onChange={setHarvesterId}
      />

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          La cosecha se registró correctamente
        </p>
      )}

      <button
        type="submit"
        disabled={creating}
        className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creating ? "Enregistrement..." : "Enregistrer la récolte"}
      </button>
    </form>
  );
};

export default NewHarvest;
