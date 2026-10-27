
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sprout,
  Wheat,
  ClipboardCheck,
} from "lucide-react";

const actions = [
  {
    label: "Esparcimiento de fertilizantes",
    to: "/",
    icon: Sprout,
  },
  {
    label: "Nueva cosecha",
    to: "nueva-cosecha",
    icon: Wheat,
  },
  {
    label: "Inspección de la cosecha",
    to: "/",
    icon: ClipboardCheck,
  },
];

const Home = () => {




  return (
   <div className="mt-5 flex w-[min(98%,600px)] flex-col gap-2">
      {actions.map(({ label, to, icon: Icon }) => (
        <Link
          key={label}
          to={to}
          className="
            group relative flex min-h-20 w-full
            items-center gap-4 overflow-hidden
            rounded-xl border border-[#b4db68]
            bg-linear-to-br
            from-primary via-secondary to-secondary
            px-5 py-4 text-white
            shadow-[0_4px_10px_rgba(57,94,12,0.18)]
            transition-all duration-200
            hover:-translate-y-0.5
            hover:brightness-105
            hover:shadow-[0_8px_20px_rgba(57,94,12,0.25)]
            active:translate-y-0
            active:scale-[0.99]
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-secondary
          "
        >
          {/* Top highlight */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" />

          {/* Icon */}
          <div
            className="
              flex size-12 shrink-0 items-center
              justify-center rounded-lg
              border border-white/20 bg-white/15
              transition-colors duration-200
              group-hover:bg-white/25
            "
          >
            <Icon size={26} strokeWidth={1.8} />
          </div>

          {/* Text */}
          <span className="flex-1 text-[1.1rem] font-semibold tracking-wide sm:text-lg">
            {label}
          </span>

          {/* Arrow */}
          <ArrowRight
            size={22}
            className="
              shrink-0 opacity-70
              transition-all duration-200
              group-hover:translate-x-1
              group-hover:opacity-100
            "
          />
        </Link>
      ))}
    </div>
  )
}

export default Home
