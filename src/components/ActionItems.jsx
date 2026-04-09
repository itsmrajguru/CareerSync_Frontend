const ACTION_ITEMS = [
  {
    id: 1,
    dot: "#02bcf0",
    title: "Follow up on your KPMG application",
    sub: "Applied 5 days ago — no response yet",
    tag: "Urgent",
    tagBg: "#FAEEDA",
    tagcolor: "#0d1117",
  },
  {
    id: 2,
    dot: "#EF9F27",
    title: "Complete your work experience section",
    sub: "Boosts your match rate by ~30%",
    tag: "Profile",
    tagBg: "#E6F1FB",
    tagcolor: "#0d1117",
  },
  {
    id: 3,
    dot: "#97C459",
    title: "24 new job matches since yesterday",
    sub: "Based on your skills and location",
    tag: "New",
    tagBg: "#EAF3DE",
    tagcolor: "#0d1117",
  },
];

export default function ActionItems() {
  return (
    <div
      className="cs-card h-full"
      style={{ borderLeft: "3px solid #02bcf0" }}
    >
      <p className="text-xs font-semibold text-black uppercase tracking-widest mb-4">
        Today's actions
      </p>
      <div className="flex flex-col divide-y divide-neutral-100">
        {ACTION_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: item.dot }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-black leading-snug">
                {item.title}
              </p>
              <p className="text-[11px] text-black mt-0.5">{item.sub}</p>
            </div>
            <span
              className="cs-badge !rounded-full !px-2 !py-0.5 !text-[11px] shrink-0 !border-none"
              style={{ background: item.tagBg, color: item.tagColor }}
            >
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

