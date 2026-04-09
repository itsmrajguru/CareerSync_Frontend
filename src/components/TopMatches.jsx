import { useNavigate } from "react-router-dom";

const FAKE_MATCHES = [
  { title: "Data Scientist",  company: "EXL",          location: "India",  match: 92 },
  { title: "GM Architect",    company: "Adani Realty",  location: "Pune",   match: 88 },
  { title: "Data Analyst",    company: "MetaMorph",     location: "Remote", match: 81 },
];

function matchStyle(score) {
  if (score >= 88) return { bg: "#EAF3DE", text: "#3B6D11" };
  if (score >= 80) return { bg: "#E6F1FB", text: "#185FA5" };
  return { bg: "#FAEEDA", text: "#854F0B" };
}

export default function TopMatches() {
  const navigate = useNavigate();

  return (
    <div className="cs-card">
      <p className="text-xs font-semibold text-black uppercase tracking-widest mb-4">
        Top matches for you
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {FAKE_MATCHES.map((job) => {
          const c = matchStyle(job.match);
          return (
            <div
              key={job.title}
              className="cs-inner-box cursor-pointer"
              onClick={() => navigate("/jobs")}
            >
              <p className="text-[13px] font-bold text-black mb-0.5">
                {job.title}
              </p>
              <p className="text-[11px] text-black mb-3">
                {job.company} · {job.location}
              </p>
              <span
                className="cs-badge !rounded-full !px-2 !py-0.5 !text-[11px] !border-none"
                style={{ background: c.bg, color: c.text }}
              >
                {job.match}% match
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
