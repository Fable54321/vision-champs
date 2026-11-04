import { useMemo } from "react";

import type { CropPlan } from "../../../Contexts/CropPlanContext";
import type { BoxType, Field } from "../../../Contexts/HarvestingContext";
import type {
  Products,
  Vegetable,
} from "../../../Contexts/vegetablesContext";
import {
  fieldControlClassName,
  fieldLabelClassName,
} from "./formStyles";

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
  onProductIdChange: (value: number) => void;
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
      vegetables
        .filter(
          (vegetable) =>
            !vegetable.is_generic && vegetable.vegetable !== "AUCUNE",
        )
        .sort((a, b) =>
          a.spanish_display_name.localeCompare(b.spanish_display_name, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        ),
    [vegetables],
  );

  const sortedBoxTypes = useMemo(() => {
    if (typeof vegetableId === "string") return [];

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

  const filteredCropPlans = useMemo(() => {
    if (fieldId === "" && vegetableId === "") return cropPlans;

    const vegetable = vegetables.find(
      (item) => Number(item.id) === Number(vegetableId),
    );

    return cropPlans
      .filter((plan) => {
        if (!vegetableId) return true;

        return (
          Number(plan.culture_id) === Number(vegetableId) ||
          Number(plan.culture_id) === Number(vegetable?.generic_display_group_id)
        );
      })
      .filter((plan) =>
        fieldId ? Number(plan.field_id) === Number(fieldId) : true,
      );
  }, [cropPlans, fieldId, vegetableId, vegetables]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={fieldLabelClassName}>Cultivo</span>
          <select
            value={vegetableId}
            onChange={(event) =>
              onVegetableIdChange(Number(event.target.value))
            }
            required
            className={fieldControlClassName}
          >
            <option value="" disabled>
              Seleccionar el cultivo
            </option>
            {filteredVegetables.map((vegetable) => (
              <option key={vegetable.id} value={vegetable.id}>
                {formatVegetableName(vegetable.spanish_display_name)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={fieldLabelClassName}>Tipo de caja</span>
          <select
            value={boxType}
            onChange={(event) => onBoxTypeChange(event.target.value)}
            required
            className={fieldControlClassName}
          >
            <option value="" disabled>
              Seleccionar el tipo de caja
            </option>
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

       

        <label className="block sm:col-span-2">
          <span className={fieldLabelClassName}>Producto</span>
          <select
            value={productId}
            onChange={(event) =>
              onProductIdChange(Number(event.target.value))
            }
            required
            className={fieldControlClassName}
          >
            <option value="" disabled>
              Seleccionar un producto
            </option>
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

 <label className="block sm:col-span-2">
          <span className={fieldLabelClassName}>Plan de cultivo</span>
          <select className={fieldControlClassName} defaultValue="">
            <option value="">Seleccionar el plan de cultivo</option>
            {filteredCropPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.crop_plan_number} —{" "}
                {formatVegetableName(
                  vegetables.find((item) => item.id === plan.culture_id)
                    ?.spanish_display_name ?? "",
                )}{" "}
                —{" "}
                {fields.find(
                  (field) => Number(field.id) === Number(plan.field_id),
                )?.field ?? "Campo sin asignar"}
              </option>
            ))}
          </select>
          <span className="mt-1.5 block text-xs leading-5 text-slate-400">
            Los planes se filtran según el campo y el cultivo seleccionados.
          </span>
        </label>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={fieldLabelClassName}>Número de cajas</span>
          <input
            type="number"
            min="1"
            value={amountOfBoxes}
            onChange={(event) => onAmountOfBoxesChange(event.target.value)}
            placeholder="0"
            inputMode="numeric"
            required
            className={fieldControlClassName}
          />
        </label>
      </div>
    </>
  );
}
