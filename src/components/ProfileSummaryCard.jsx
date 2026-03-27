import { useNavigate } from "react-router-dom";

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const STATS = [
  { label: "Applied",    value: "3"   },
  { label: "Interviews", value: "1"   },
  { label: "Saved",      value: "7"   },
  { label: "Resume",     value: "74%" },
];

export default function ProfileSummaryCard({ userName }) {
  const navigate  = useNavigate();
  const initials  = getInitials(userName);

  return (
    <div className="flex flex-col gap-3 h-full">

      {/* Avatar + name + progress */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-base font-bold text-primary-600 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-neutral-900">{userName}</p>
          <p className="text-[12px] text-neutral-400">Pune, India</p>
          <div className="h-1 bg-neutral-100 rounded-full mt-2 w-32">
            <div className="h-1 bg-primary-400 rounded-full" style={{ width: "60%" }} />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1">Profile 60% complete</p>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 shrink-0 transition-colors"
        >
          Edit →
        </button>
      </div>

      {/* 4 mini stat tiles */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-neutral-100 rounded-xl p-4"
          >
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              {s.label}
            </p>
            <p className="text-[22px] font-extrabold text-neutral-900 tracking-tight">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}