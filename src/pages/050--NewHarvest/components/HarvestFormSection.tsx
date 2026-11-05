import type { ReactNode } from "react";


type HarvestFormSectionProps = {

  children: ReactNode;
};

export function HarvestFormSection({

  children,
}: HarvestFormSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white py-4 px-3 shadow-[0_8px_30px_rgba(38,63,8,0.06)] sm:p-5">
   
      

      <div className="space-y-4">{children}</div>
    </section>
  );
}
