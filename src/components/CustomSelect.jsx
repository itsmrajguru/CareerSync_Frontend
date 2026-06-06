import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({ value, onChange, children, className = "", style = {}, id, name, disabled }) {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
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
          disabled: child.props.disabled,
        });
      } else if (child.props?.children) {
        parseChildren(child.props.children);
      }
    });
  };
  parseChildren(children);

  const selected = options.find((o) => String(o.value) === String(value));
  const displayLabel = selected?.label ?? options[0]?.label ?? "Select…";

  /* Calculate the fixed position of the dropdown relative to the viewport */
  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleOpen = () => {
    if (disabled) return;
    calculatePosition();
    setOpen((o) => !o);
  };

  /* Recalculate on scroll/resize while open */
  useEffect(() => {
    if (!open) return;
    const update = () => calculatePosition();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  /* Close when clicking outside */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const panel = document.getElementById("cs-select-portal-panel");
      const inTrigger = containerRef.current?.contains(e.target);
      const inPanel = panel?.contains(e.target);
      if (!inTrigger && !inPanel) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (optValue, isDisabled) => {
    if (isDisabled) return;
    onChange({ target: { value: optValue, name } });
    setOpen(false);
  };

  /* Dropdown panel rendered via portal so it escapes overflow containers */
  const dropdownPanel = open && createPortal(
    <div
      id="cs-select-portal-panel"
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: dropdownPos.width,
        zIndex: 99999,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.07)",
        overflow: "hidden",
        animation: "csSelectOpen 0.12s ease-out",
        maxHeight: 280,
        overflowY: "auto",
      }}
    >
      <style>{`
        @keyframes csSelectOpen {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {options.map((opt, i) => {
        const isSelected = String(opt.value) === String(value);
        return (
          <div
            key={i}
            onClick={() => handleSelect(opt.value, opt.disabled)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 14px",
              fontSize: 13.5,
              fontFamily: "inherit",
              fontWeight: isSelected ? 700 : 500,
              color: opt.disabled ? "#94a3b8" : isSelected ? "#0d1117" : "#374151",
              background: isSelected ? "#f1f5f9" : "transparent",
              cursor: opt.disabled ? "not-allowed" : "pointer",
              borderBottom: i < options.length - 1 ? "1px solid #f9fafb" : "none",
              transition: "background 0.1s",
              opacity: opt.disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!isSelected && !opt.disabled) e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={(e) => { if (!isSelected && !opt.disabled) e.currentTarget.style.background = "transparent"; }}
          >
            <span>{opt.label}</span>
            {isSelected && <Check size={14} color="#0d1117" />}
          </div>
        );
      })}
    </div>,
    document.body
  );

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", ...style }}
      className={className}
    >
      {/* Trigger button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleOpen}
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

      {/* Portal dropdown */}
      {dropdownPanel}
    </div>
  );
}
