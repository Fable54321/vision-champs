import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useHarvesting } from "../../Contexts/HarvestingContext";
import { useForeignWorkers } from "../../Contexts/ForeignWorkersContext";
import { formatNames } from "../../Utils/formatNames";
import { useVegetables } from "../../Contexts/vegetablesContext";

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
  } = useHarvesting();

  const { fetchVegetables, vegetables, fetchAllProducts, allProducts } = useVegetables();

    const { foreignWorkers } = useForeignWorkers();



  const [teamLeaderUserId, setTeamLeaderUserId] = useState("");
  const [subfield, setSubfield] = useState("");
 const [harvestingDate, setHarvestingDate] = useState(() => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
});


const getCurrentTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

  const [harvestingTime, setHarvestingTime] = useState(getCurrentTime);
  
  const [vegetableId, setVegetableId] = useState<number | string>("")
  const [subProduct, setSubProduct] = useState("");
  const [amountOfBoxes, setAmountOfBoxes] = useState("");
  const [boxType, setBoxType] = useState("");
  const [harvester, setHarvester] = useState("");


  

  const [success, setSuccess] = useState(false);

  useEffect(() => {

    const interval = setInterval(() => {
      setHarvestingTime(getCurrentTime());
    }, 60_000);

    return () => clearInterval(interval);
  },[])




  useEffect(() => {
    console.log(allProducts);
  },[allProducts])
  

  const resetForm = () => {
    setTeamLeaderUserId("");
    setSubfield("");
    setHarvestingDate("");
    setHarvestingTime("");
    setVegetableId("");
    setSubProduct("");
    setAmountOfBoxes("");
    setBoxType("");
    setHarvester("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if(!vegetableId || typeof vegetableId === "string"){
      throw new Error("La culture est obligatoire")
    }

    clearError();
    setSuccess(false);

    const created = await createHarvestingRecord({
      team_leader_user_id: Number(teamLeaderUserId),
      subfield: subfield.trim(),
      harvesting_date: harvestingDate,
      harvesting_time: harvestingTime,
      vegetable_id: vegetableId,
      sub_product:
        subProduct.trim() === ""
          ? null
          : subProduct.trim(),
      amount_of_boxes: Number(amountOfBoxes),
      box_type: boxType.trim(),
      harvester: harvester.trim(),
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

const teamLeaders = useMemo(() => {
  return foreignWorkers.filter((worker) => {
    return worker.job_id_1 === 6 || worker.job_id_2 === 6 || worker.job_id_3 === 6
  })
} ,[foreignWorkers])

const selectedTeamLeaderName = useMemo(() => {
  const selectedLeader = teamLeaders.find(
    (leader) => String(leader.id) === teamLeaderUserId,
  );

  return selectedLeader
    ? formatNames(selectedLeader.name, selectedLeader.surname)
    : "Selecciona un jefe de equipo";
}, [teamLeaderUserId, teamLeaders]);




useEffect(() => {
  void fetchBoxTypes()
},[fetchBoxTypes])

useEffect(() => {
  void fetchFields()
}, [fetchFields])

useEffect(() => {
  void fetchVegetables()
},[fetchVegetables])

  useEffect(() => {
    void fetchAllProducts();
  }, [fetchAllProducts])


const filteredVegetables = useMemo(() => {
  if(!vegetables) return;

  return vegetables.filter((veg) => !veg.is_generic && veg.vegetable !== "AUCUNE")
},[vegetables])



const sortedBoxTypes = useMemo(() => {

  if(typeof vegetableId === "string") {
    return [];
  }
  const firstPart = boxTypes.filter((box) => box.vegetable_id === vegetableId)
  const secondPart = boxTypes.filter((box) =>  box.vegetable_id !== vegetableId).sort((a,b) => {
    return a.box_type.localeCompare(b.box_type, undefined , {
      numeric: true,
      sensitivity: "base",
    })
  })

  return [...firstPart, ...secondPart];
},[vegetableId, boxTypes])

const sortedBoxTypesLength = useMemo(() => {

return boxTypes.filter((box) => box.vegetable_id === vegetableId ).length

},[vegetableId, boxTypes])








  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 flex w-[min(100%,550px)] flex-col gap-5 rounded-2xl bg-white/50 p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold">
        Nueva cosecha
      </h2>

      <label className="flex flex-col gap-2">
        <span className="font-semibold">
          Jefe de equipo
        </span>

        <div className="relative">
          <select
            value={teamLeaderUserId}
            onChange={(event) =>
              setTeamLeaderUserId(event.target.value)
            }
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
            <span className={` ${selectedTeamLeaderName.length > 20 ? "move-left-right" : ""} shrink-0 whitespace-nowrap text-slate-900`}>
              {selectedTeamLeaderName}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-600"
          >
            ▾
          </span>
        </div>

      </label>

      <label className="flex flex-col gap-2">
        <span className="font-semibold">
          Campo y parcela
        </span>

        <select
          value={subfield}
          onChange={(event) =>
            setSubfield(event.target.value)
          }
          required
          className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option>Seleccionar un campo</option>
          {[...fields]
            .sort((a, b) =>
              a.field.localeCompare(b.field, undefined, {
                numeric: true,
                sensitivity: "base",
              }),
            )
            .map((field) => {
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
          <span className="font-semibold">
            Fecha de cosecha
          </span>

          <input
            type="date"
            value={harvestingDate}
            onChange={(event) =>
              setHarvestingDate(event.target.value)
            }
            required
            className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">
            Hora
          </span>

          <input
            type="time"
            value={harvestingTime}
            onChange={(event) =>
              setHarvestingTime(event.target.value)
            }
            required
            className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">
            Cultivo
          </span>

          <select
            
            value={vegetableId}
            onChange={(event) =>
              setVegetableId(Number(event.target.value))

            }
            required
            className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option>Seleccionar el cultivo</option>
            {filteredVegetables?.map((veg) => (
              <option
               key={veg.id}
               value={veg.id}
               >{veg.vegetable}</option>
            ))}
            </select>
        </label>

           <label className="flex flex-col gap-2">
          <span className="font-semibold">
            Tipos de cajas
          </span>

          <select
            
            value={boxType}
            onChange={(event) =>
              setBoxType(event.target.value)
            }
            required
            className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option>Seleccionar el tipo de caja</option>

             {sortedBoxTypes
                .map((type, idx) => {
                  const label = type.box_type.trim();

                  return (
                    <option key={type.id} value={type.box_type} className={`${idx < sortedBoxTypesLength ? "font-bold" : ""}`}>
                      {label.charAt(0).toLocaleUpperCase() + label.slice(1)}
                    </option>
                  );
                })}
            </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">
            Producto
          </span>

          <input
            type="text"
            value={subProduct}
            onChange={(event) =>
              setSubProduct(event.target.value)
            }
            className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">
            Numero de cajas
          </span>

          <input
            type="number"
            min="1"
            value={amountOfBoxes}
            onChange={(event) =>
              setAmountOfBoxes(event.target.value)
            }
            required
            className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>

     
      </div>

      <label className="flex flex-col gap-2">
        <span className="font-semibold">
          Récolteuse
        </span>

        <input
          type="text"
          value={harvester}
          onChange={(event) =>
            setHarvester(event.target.value)
          }
          required
          placeholder="Ex: Récolteuse 1"
          className="rounded-xl border bg-white border-slate-300 px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </label>

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
        {creating
          ? "Enregistrement..."
          : "Enregistrer la récolte"}
      </button>
    </form>
  );
};

export default NewHarvest;
