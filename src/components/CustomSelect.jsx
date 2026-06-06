import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({ value, onChange, children, className = "", style = {}, id, name, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  /* Parse <option> children into { value, label } objects */
  const options = [];
  const parseChildren = (nodes) => {
    const arr = Array.isArray(nodes) ? nodes : [nodes];
    arr.forEach((child) => {
      if (!child) return;
      if (child.type === "option") {
        options.push({
          value: child.props.value ?? child.props.children,
          label: child.props.children,
        });
      } else if (child.props?.children) {
        parseChildren(child.props.children);
      }
    });
  };
  parseChildren(children);

  const selected = options.find((o) => String(o.value) === String(value));
  const displayLabel = selected?.label ?? options[0]?.label ?? "Select…";

  /* Close dropdown when clicking outside */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (optValue) => {
    onChange({ target: { value: optValue, name } });
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", ...style }}
      className={className}
    >
      {/* Trigger button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: "10px 14px",
          fontSize: 14,
          fontFamily: "inherit",
          fontWeight: 500,
          color: "#0d1117",
          background: open ? "#ffffff" : "#f9fafb",
          border: open ? "1px solid #0d1117" : "1px solid #e5e7eb",
          borderRadius: 8,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
          boxShadow: open ? "0 0 0 3px rgba(13,17,23,0.06)" : "none",
          outline: "none",
          textAlign: "left",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayLabel}
        </span>
        <ChevronDown
          size={15}
          color="#64748b"
          style={{
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            overflow: "hidden",
            animation: "csSelectOpen 0.12s ease-out",
          }}
        >
          {options.map((opt, i) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={i}
                onClick={() => handleSelect(opt.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  fontSize: 13.5,
                  fontFamily: "inherit",
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? "#0d1117" : "#374151",
                  background: isSelected ? "#f1f5f9" : "transparent",
                  cursor: "pointer",
                  borderBottom: i < options.length - 1 ? "1px solid #f9fafb" : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} color="#0d1117" />}
              </div>
            );
          })}
        </div>
      )}

      {/* keyframe animation injected once */}
      <style>{`
        @keyframes csSelectOpen {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
