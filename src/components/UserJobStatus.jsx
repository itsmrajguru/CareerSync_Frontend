const STATS = [
  { label: "Applied", value: "3" },
  { label: "Interviews", value: "1" },
  { label: "Saved", value: "7" },
  { label: "Resume", value: "74%" },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white border border-neutral-100 rounded-xl p-4">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            {s.label}
          </p>
          <p className="text-[22px] font-extrabold text-neutral-900 tracking-tight">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}