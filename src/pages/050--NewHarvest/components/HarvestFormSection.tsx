import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type HarvestFormSectionProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
};

export function HarvestFormSection({
  icon: Icon,
  title,
  description,
  children,
}: HarvestFormSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(38,63,8,0.06)] sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-secondary ring-1 ring-primary/20">
          <Icon aria-hidden="true" size={20} strokeWidth={2.2} />
        </div>

        <div>
          <h2 className="text-base font-bold text-deepgreen">{title}</h2>
          <p className="mt-0.5 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  );
}
