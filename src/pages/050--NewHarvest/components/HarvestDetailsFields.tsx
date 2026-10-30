import { useEffect, useMemo } from "react";

import type { BoxType, Field } from "../../../Contexts/HarvestingContext";
import type {
  Products,
  Vegetable,
} from "../../../Contexts/vegetablesContext";
import type { CropPlan } from "../../../Contexts/CropPlanContext";

function formatVegetableName(name: string) {
  const lowerCaseName = name.trim().toLocaleLowerCase("es");

  return lowerCaseName
    ? lowerCaseName.charAt(0).toLocaleUpperCase("es") + lowerCaseName.slice(1)
    : "";
}

type HarvestDetailsFieldsProps = {
  vegetables: Vegetable[];
  boxTypes: BoxType[];
  products: Products;
  fields: Field[];
  cropPlans: CropPlan[];
  fieldId: number | string;
  vegetableId: number | string;
  productId: number | string;
  boxType: string;
  amountOfBoxes: string;
  onVegetableIdChange: (value: number) => void;
  onProductIdChange: (value: string) => void;
  onBoxTypeChange: (value: string) => void;
  onAmountOfBoxesChange: (value: string) => void;
};

export function HarvestDetailsFields({
  vegetables,
  boxTypes,
  products,
  fields,
  cropPlans,
  fieldId,
  vegetableId,
  productId,
  boxType,
  amountOfBoxes,
  onVegetableIdChange,
  onProductIdChange,
  onBoxTypeChange,
  onAmountOfBoxesChange,
}: HarvestDetailsFieldsProps) {
  const filteredVegetables = useMemo(
    () =>
      vegetables.filter(
        (vegetable) =>
          !vegetable.is_generic && vegetable.vegetable !== "AUCUNE",
      ),
    [vegetables],
  );

  const sortedBoxTypes = useMemo(() => {
    if (typeof vegetableId === "string") {
      return [];
    }

    const matchingBoxTypes = boxTypes.filter(
      (type) => type.vegetable_id === vegetableId,
    );
    const remainingBoxTypes = boxTypes
      .filter((type) => type.vegetable_id !== vegetableId)
      .sort((a, b) =>
        a.box_type.localeCompare(b.box_type, undefined, {
          numeric: true,
          sensitivity: "base",
        }),
      );

    return [...matchingBoxTypes, ...remainingBoxTypes];
  }, [boxTypes, vegetableId]);

  const matchingBoxTypesCount = useMemo(
    () => boxTypes.filter((type) => type.vegetable_id === vegetableId).length,
    [boxTypes, vegetableId],
  );

  const sortedProducts = useMemo(() => {
    const matchingProducts = products.filter(
      (product) => product.vegetable_id === vegetableId,
    );
    const remainingProducts = products.filter(
      (product) => product.vegetable_id !== vegetableId,
    );

    return [...matchingProducts, ...remainingProducts];
  }, [products, vegetableId]);

  const matchingProductsCount = useMemo(
    () =>
      products.filter((product) => product.vegetable_id === vegetableId).length,
    [products, vegetableId],
  );


  useEffect(() => {
    console.log(vegetableId)
  },[vegetableId])

const filteredCropPlans = useMemo(() => {
    
     if(fieldId === "" && vegetableId === ""){
      return cropPlans
    }
  
   const vegetable = vegetables.find((veg) => Number(veg.id) === Number(vegetableId))

   return cropPlans.filter((plan) => {

if(vegetableId){
 return   Number(plan.culture_id) === Number(vegetableId) 
   || Number(plan.culture_id) === Number(vegetable?.generic_display_group_id)}
 else {
  return true
 }  
  })
  .filter((plan) => {
    if(fieldId){
      return Number(plan.field_id) === Number(fieldId)
    }
    else {
      return true
    }
  })
  }, [cropPlans, vegetableId, fieldId, vegetables]);


  useEffect(() => {
    console.log(filteredCropPlans);
  } ,[filteredCropPlans])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Cultivo</span>

          <select
            value={vegetableId}
            onChange={(event) =>
              onVegetableIdChange(Number(event.target.value))
            }
            required
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option>Seleccionar el cultivo</option>
            {filteredVegetables.map((vegetable) => (
              <option key={vegetable.id} value={vegetable.id}>
                {formatVegetableName(vegetable.spanish_display_name)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Tipos de cajas</span>

          <select
            value={boxType}
            onChange={(event) => onBoxTypeChange(event.target.value)}
            required
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option>Seleccionar el tipo de caja</option>

            {sortedBoxTypes.map((type, index) => {
              const label = type.box_type.trim();

              return (
                <option
                  key={type.id}
                  value={type.box_type}
                  className={index < matchingBoxTypesCount ? "font-bold" : ""}
                >
                  {label.charAt(0).toLocaleUpperCase() + label.slice(1)}
                </option>
              );
            })}
          </select>
        </label>

        <label className="sm:col-span-2 flex flex-col" htmlFor="">
          <span className="font-semibold" >Plan de cultivo</span>
<select className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20">
  <option>Seleccionar el plan de cultivo</option>
          {filteredCropPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.crop_plan_number}--
             {formatVegetableName(
               vegetables.find((veg) => veg.id === plan.culture_id)
                 ?.spanish_display_name ?? "",
             )}--
             {fields.find((field) => Number(field.id) === Number(plan.field_id))?.field}
            </option>
          ))}

          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-semibold">Producto</span>

          <select
            value={productId}
            onChange={(event) => onProductIdChange(event.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option> Seleccionar un producto</option>

            {sortedProducts.map((product, index) => (
              <option
                key={product.id}
                value={product.id}
                className={index < matchingProductsCount ? "font-bold" : ""}
              >
                {product.product_source === "finished_product"
                  ? product.full_name
                  : product.description}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">Numero de cajas</span>

          <input
            type="number"
            min="1"
            value={amountOfBoxes}
            onChange={(event) => onAmountOfBoxesChange(event.target.value)}
            required
            className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
      </div>
    </>
  );
}
