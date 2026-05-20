// Reusable form primitives for the Settings page

const { useState: useStateForm } = React;

// ---- Section ------------------------------------------------------------
function SettingsSection({ title, description, children, footer }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #F0F2F5" }}>
        <h2 style={{
          margin: 0,
          fontFamily: "Inter, sans-serif", fontSize: 17, fontWeight: 600,
          color: "#1A2332", letterSpacing: -0.2,
        }}>{title}</h2>
        {description && (
          <p style={{
            margin: "4px 0 0",
            fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7A8D",
            lineHeight: 1.5, maxWidth: 620,
          }}>{description}</p>
        )}
      </div>
      <div style={{ padding: "22px 28px" }}>{children}</div>
      {footer && (
        <div style={{
          padding: "16px 28px",
          background: "#FAFBFC",
          borderTop: "1px solid #F0F2F5",
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
        }}>{footer}</div>
      )}
    </div>
  );
}

// ---- Form row -----------------------------------------------------------
function FormRow({ label, hint, children, inline, divider = true }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "220px minmax(0, 1fr)",
      gap: 24,
      padding: divider ? "16px 0" : "16px 0 0",
      borderBottom: divider ? "1px solid #F5F7FA" : "none",
      alignItems: inline ? "center" : "flex-start",
    }}>
      <div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600,
          color: "#1A2332",
        }}>{label}</div>
        {hint && (
          <div style={{
            marginTop: 3,
            fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D",
            lineHeight: 1.5, maxWidth: 220,
          }}>{hint}</div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

// ---- Inputs -------------------------------------------------------------
const inputStyle = {
  width: "100%", maxWidth: 360,
  height: 38, padding: "0 12px",
  border: "1px solid #E5E8EE", borderRadius: 9,
  fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#1A2332",
  background: "#fff", outline: "none",
};

function TextInput({ value, onChange, placeholder, type = "text", suffix, prefix, maxWidth }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", width: "100%", maxWidth: maxWidth || 360 }}>
      {prefix && (
        <span style={{
          position: "absolute", left: 12,
          fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#6B7A8D",
        }}>{prefix}</span>
      )}
      <input
        type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...inputStyle, maxWidth: "100%",
          paddingLeft: prefix ? 30 : 12,
          paddingRight: suffix ? 60 : 12,
        }}
        onFocus={(e) => e.target.style.borderColor = "#4A90C4"}
        onBlur={(e) => e.target.style.borderColor = "#E5E8EE"}
      />
      {suffix && (
        <span style={{
          position: "absolute", right: 12,
          fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D",
        }}>{suffix}</span>
      )}
    </div>
  );
}

function Select({ value, onChange, options, maxWidth }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", width: "100%", maxWidth: maxWidth || 240 }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle, maxWidth: "100%",
          appearance: "none", paddingRight: 32, cursor: "pointer",
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span style={{
        position: "absolute", right: 10, pointerEvents: "none",
        display: "flex", alignItems: "center",
      }}>
        <Icon name="chevron-down" size={14} color="#6B7A8D" />
      </span>
    </div>
  );
}

// ---- Toggle -------------------------------------------------------------
function Toggle({ value, onChange, size = "md" }) {
  const w = size === "sm" ? 36 : 44;
  const h = size === "sm" ? 20 : 24;
  const dot = h - 4;
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: w, height: h,
        background: value ? "#4A90C4" : "#D6DBE3",
        border: "none", borderRadius: h,
        position: "relative", cursor: "pointer",
        transition: "background 0.2s",
        padding: 0, flexShrink: 0,
      }}
      aria-pressed={value}
    >
      <span style={{
        position: "absolute",
        top: 2, left: value ? w - dot - 2 : 2,
        width: dot, height: dot, borderRadius: "50%",
        background: "#fff",
        transition: "left 0.2s",
        boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

// ---- Segmented (radio-style buttons) ------------------------------------
function Segmented({ value, onChange, options, accent = "#4A90C4" }) {
  return (
    <div style={{
      display: "inline-flex", padding: 3,
      background: "#F0F2F5", borderRadius: 10,
    }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              padding: "7px 14px", border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? accent : "#6B7A8D",
              fontFamily: "Inter, sans-serif", fontSize: 12.5,
              fontWeight: active ? 600 : 500, borderRadius: 8, cursor: "pointer",
              boxShadow: active ? "0 1px 2px rgba(26,35,50,0.08)" : "none",
              transition: "all 0.15s",
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
}

// ---- Slider -------------------------------------------------------------
function Slider({ value, onChange, min, max, step, unit, accent = "#4A90C4" }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, maxWidth: 440 }}>
      <div style={{ position: "relative", flex: 1, height: 24, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: 6, background: "#F0F2F5", borderRadius: 3 }} />
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: 6, background: accent, borderRadius: 3 }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            position: "absolute", left: 0, right: 0, width: "100%",
            opacity: 0, height: 24, cursor: "pointer",
          }}
        />
        <div style={{
          position: "absolute", left: `calc(${pct}% - 9px)`,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", border: `2px solid ${accent}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          pointerEvents: "none",
        }} />
      </div>
      <div style={{
        minWidth: 72,
        padding: "6px 10px",
        background: `${accent}10`, color: accent,
        borderRadius: 8, textAlign: "center",
        fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
      }}>{value}{unit && <span style={{ fontSize: 11, marginLeft: 2, opacity: 0.8 }}>{unit}</span>}</div>
    </div>
  );
}

// ---- Checkbox -----------------------------------------------------------
function Checkbox({ value, onChange, label, hint, icon, iconColor }) {
  return (
    <label style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 12px", borderRadius: 10,
      border: "1px solid #F0F2F5", background: "#fff",
      cursor: "pointer", minWidth: 0,
      transition: "border-color 0.15s, background 0.15s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "#FAFBFC"}
    onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
    >
      <input
        type="checkbox" checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: "none" }}
      />
      <span style={{
        width: 18, height: 18, borderRadius: 5,
        border: value ? "1.5px solid #4A90C4" : "1.5px solid #D6DBE3",
        background: value ? "#4A90C4" : "#fff",
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        marginTop: 1,
        transition: "all 0.15s",
      }}>
        {value && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1, fontWeight: 700 }}>✓</span>}
      </span>
      {icon && (
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${iconColor || "#4A90C4"}1F`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon name={icon} size={15} color={iconColor || "#4A90C4"} />
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, color: "#1A2332" }}>{label}</div>
        {hint && (
          <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D" }}>{hint}</div>
        )}
      </div>
    </label>
  );
}

// ---- Buttons ------------------------------------------------------------
function Button({ children, variant = "secondary", onClick, danger, size = "md", icon }) {
  const styles = {
    primary: { background: "#4A90C4", color: "#fff", border: "none" },
    secondary: { background: "#fff", color: "#1A2332", border: "1px solid #E5E8EE" },
    ghost: { background: "transparent", color: "#4A90C4", border: "none" },
    danger: { background: "#fff", color: "#E05252", border: "1px solid #F2C7C7" },
    "danger-solid": { background: "#E05252", color: "#fff", border: "none" },
  };
  const s = danger ? styles.danger : styles[variant];
  return (
    <button onClick={onClick} style={{
      ...s,
      padding: size === "sm" ? "7px 12px" : "9px 16px",
      borderRadius: 9,
      fontFamily: "Inter, sans-serif",
      fontSize: size === "sm" ? 12.5 : 13.5, fontWeight: 600,
      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
      transition: "transform 0.06s, filter 0.15s",
    }}>
      {icon && <Icon name={icon} size={14} color={s.color} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

window.AtmosForms = {
  SettingsSection, FormRow, TextInput, Select, Toggle, Segmented, Slider, Checkbox, Button,
};
