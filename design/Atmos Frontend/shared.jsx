// Shared layout: Sidebar, Header, Card, Legend
// Used across Dashboard / Trips / Analytics / Insights / Settings pages.

const { useState: useStateShared } = React;

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "Dashboard.html" },
  { id: "trips",     label: "Trips",     icon: "trips",     href: "Trips.html" },
  { id: "analytics", label: "Analytics", icon: "analytics", href: "Analytics.html" },
  { id: "insights",  label: "Insights",  icon: "insights",  href: "Insights.html" },
  { id: "settings",  label: "Settings",  icon: "settings",  href: "Settings.html" },
];

function Sidebar({ active }) {
  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: "#FFFFFF",
      borderRight: "1px solid #F0F2F5",
      display: "flex", flexDirection: "column",
      padding: "24px 16px",
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <a href="Dashboard.html" style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "0 8px 28px", textDecoration: "none",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "linear-gradient(135deg, #4A90C4 0%, #3DAB82 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 700, fontSize: 17, fontFamily: "Inter, sans-serif",
          letterSpacing: -0.5,
        }}>a</div>
        <span style={{
          fontSize: 18, fontWeight: 600, color: "#1A2332",
          fontFamily: "Inter, sans-serif", letterSpacing: -0.3,
        }}>atmos</span>
      </a>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(it => {
          const isActive = it.id === active;
          return (
            <a
              key={it.id}
              href={it.href}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                background: isActive ? "rgba(74,144,196,0.10)" : "transparent",
                color: isActive ? "#4A90C4" : "#6B7A8D",
                borderRadius: 10,
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F5F7FA"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name={it.icon} size={19} color={isActive ? "#4A90C4" : "#6B7A8D"} />
              {it.label}
            </a>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      {/* User */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "16px 8px 10px",
        borderTop: "1px solid #F0F2F5",
        marginTop: 16,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "#E8DCC7", color: "#5A4A2A",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13,
        }}>MO</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1A2332" }}>
            Maya Okafor
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D" }}>
            Free plan
          </div>
        </div>
      </div>
    </aside>
  );
}

function Header({ title, subtitle, range, setRange, rightExtra }) {
  const [open, setOpen] = useStateShared(false);
  const ranges = ["Today", "This week", "This month", "Last 30 days", "This year"];

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 36px",
      borderBottom: "1px solid #F0F2F5",
      background: "#F5F7FA",
      position: "sticky", top: 0, zIndex: 4,
    }}>
      <div>
        <h1 style={{
          margin: 0,
          fontFamily: "Inter, sans-serif",
          fontSize: 24, fontWeight: 600,
          color: "#1A2332", letterSpacing: -0.4,
        }}>{title}</h1>
        {subtitle && (
          <div style={{
            marginTop: 4,
            fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7A8D",
          }}>{subtitle}</div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {rightExtra}

        {range && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 12px",
                background: "#fff",
                border: "1px solid #F0F2F5",
                borderRadius: 9,
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
                color: "#1A2332", cursor: "pointer",
              }}
            >
              <Icon name="calendar" size={15} color="#6B7A8D" />
              {range}
              <Icon name="chevron-down" size={14} color="#6B7A8D" />
            </button>
            {open && (
              <>
                <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 5 }} />
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", right: 0,
                  background: "#fff", border: "1px solid #F0F2F5",
                  borderRadius: 10, boxShadow: "0 6px 22px rgba(26,35,50,0.10)",
                  padding: 6, minWidth: 160, zIndex: 10,
                }}>
                  {ranges.map(r => (
                    <button
                      key={r}
                      onClick={() => { setRange(r); setOpen(false); }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 10px", border: "none",
                        background: r === range ? "rgba(74,144,196,0.10)" : "transparent",
                        color: r === range ? "#4A90C4" : "#1A2332",
                        fontFamily: "Inter, sans-serif", fontSize: 13,
                        fontWeight: r === range ? 600 : 500,
                        borderRadius: 7, cursor: "pointer",
                      }}
                      onMouseEnter={(e) => { if (r !== range) e.currentTarget.style.background = "#F5F7FA"; }}
                      onMouseLeave={(e) => { if (r !== range) e.currentTarget.style.background = "transparent"; }}
                    >{r}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <button style={{
          position: "relative",
          width: 38, height: 38, borderRadius: 9,
          background: "#fff",
          border: "1px solid #F0F2F5",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}>
          <Icon name="bell" size={17} color="#6B7A8D" />
          <span style={{
            position: "absolute", top: 8, right: 9,
            width: 7, height: 7, borderRadius: "50%",
            background: "#E05252",
            border: "1.5px solid #fff",
          }} />
        </button>

        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#E8DCC7", color: "#5A4A2A",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13,
          cursor: "pointer",
        }}>MO</div>
      </div>
    </header>
  );
}

function Card({ title, subtitle, action, children, padding = "22px 24px", style }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      padding,
      display: "flex", flexDirection: "column", gap: 16,
      ...style,
    }}>
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            {title && (
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "#1A2332" }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
                {subtitle}
              </div>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function Legend({ color, label, dashed }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#6B7A8D", fontWeight: 500, fontFamily: "Inter, sans-serif", fontSize: 11.5 }}>
      <span style={{
        width: 18, height: 2,
        background: dashed ? "transparent" : color,
        borderTop: dashed ? `2px dashed ${color}` : "none",
      }} />
      {label}
    </span>
  );
}

// Page shell — sidebar + main + header
function PageShell({ active, title, subtitle, range, setRange, rightExtra, children }) {
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F5F7FA",
      fontFamily: "Inter, sans-serif",
      color: "#1A2332",
    }}>
      <Sidebar active={active} />
      <main data-screen-label={title} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header title={title} subtitle={subtitle} range={range} setRange={setRange} rightExtra={rightExtra} />
        <div style={{ padding: "28px 36px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
          {children}
        </div>
      </main>
    </div>
  );
}

window.AtmosShared = { Sidebar, Header, Card, Legend, PageShell };
