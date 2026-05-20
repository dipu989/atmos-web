// Atmos — Trips page

const { useState: useStateTrips, useMemo: useMemoTrips } = React;
const { ALL_TRIPS, TRANSPORT_MODES, TRIP_STATS } = window.AtmosData;
const { Card, PageShell } = window.AtmosShared;

const MODE_META = Object.fromEntries(TRANSPORT_MODES.map(m => [m.id, m]));

// ---- COMPACT STAT (top strip) -------------------------------------------
function CompactStat({ label, value, unit, accent, icon, sub }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      borderTop: `3px solid ${accent}`,
      padding: "18px 20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 14, minHeight: 96,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 11.5, fontWeight: 500,
          color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
        }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: 26, fontWeight: 600,
            color: "#1A2332", letterSpacing: -0.5, lineHeight: 1,
          }}>{value}</span>
          {unit && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500, color: "#6B7A8D" }}>{unit}</span>
          )}
        </div>
        {sub && (
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D", marginTop: 1 }}>{sub}</div>
        )}
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${accent}1A`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <Icon name={icon} size={18} color={accent} />
      </div>
    </div>
  );
}

// ---- FILTER CHIPS -------------------------------------------------------
function ModeChips({ value, onChange }) {
  const items = [
    { id: "all",   label: "All modes", color: "#1A2332", count: ALL_TRIPS.length },
    ...TRANSPORT_MODES.map(m => ({
      id: m.id, label: m.name, color: m.color, icon: m.icon,
      count: ALL_TRIPS.filter(t => t.mode === m.id).length,
    })),
  ];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map(it => {
        const active = value === it.id;
        return (
          <button
            key={it.id}
            onClick={() => onChange(it.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 12px",
              borderRadius: 999,
              border: active ? `1px solid ${it.color}` : "1px solid #F0F2F5",
              background: active ? `${it.color}14` : "#fff",
              color: active ? it.color : "#1A2332",
              fontFamily: "Inter, sans-serif", fontSize: 12.5,
              fontWeight: active ? 600 : 500,
              cursor: "pointer", transition: "background 0.15s, border-color 0.15s",
            }}
          >
            {it.icon && <Icon name={it.icon} size={14} color={active ? it.color : "#6B7A8D"} />}
            {it.label}
            <span style={{
              fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
              color: active ? it.color : "#6B7A8D", opacity: active ? 0.8 : 1,
            }}>{it.count}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---- SOURCE TOGGLE ------------------------------------------------------
function SourceToggle({ value, onChange }) {
  const opts = [
    { id: "all",    label: "All" },
    { id: "auto",   label: "Detected" },
    { id: "manual", label: "Manual" },
  ];
  return (
    <div style={{
      display: "inline-flex", padding: 3,
      background: "#F0F2F5", borderRadius: 9,
    }}>
      {opts.map(o => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            style={{
              padding: "6px 12px",
              border: "none",
              background: active ? "#fff" : "transparent",
              color: active ? "#1A2332" : "#6B7A8D",
              fontFamily: "Inter, sans-serif", fontSize: 12.5,
              fontWeight: active ? 600 : 500,
              borderRadius: 7, cursor: "pointer",
              boxShadow: active ? "0 1px 2px rgba(26,35,50,0.08)" : "none",
              transition: "background 0.15s",
            }}
          >{o.label}</button>
        );
      })}
    </div>
  );
}

// ---- SEARCH INPUT -------------------------------------------------------
function SearchInput({ value, onChange }) {
  return (
    <div style={{
      position: "relative", display: "inline-flex", alignItems: "center",
      background: "#fff", border: "1px solid #F0F2F5", borderRadius: 9,
      padding: "0 12px", height: 36, width: 280,
    }}>
      <Icon name="search" size={15} color="#6B7A8D" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by route or place…"
        style={{
          flex: 1, border: "none", outline: "none",
          padding: "0 8px", fontFamily: "Inter, sans-serif", fontSize: 13,
          color: "#1A2332", background: "transparent",
          minWidth: 0,
        }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{
          border: "none", background: "transparent", cursor: "pointer", color: "#6B7A8D",
          fontFamily: "Inter, sans-serif", fontSize: 12, padding: 4,
        }}>×</button>
      )}
    </div>
  );
}

// ---- SORT HEADER --------------------------------------------------------
function SortHeader({ label, k, sort, setSort, align = "left" }) {
  const active = sort.key === k;
  const dir = active ? sort.dir : null;
  return (
    <button
      onClick={() => setSort(s => ({ key: k, dir: s.key === k && s.dir === "desc" ? "asc" : "desc" }))}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        background: "transparent", border: "none", cursor: "pointer",
        padding: 0,
        fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
        letterSpacing: 0.4, textTransform: "uppercase",
        color: active ? "#1A2332" : "#6B7A8D",
        marginLeft: align === "right" ? "auto" : 0,
      }}
    >
      {label}
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 0.4, opacity: 0.8, marginLeft: 2 }}>
        <span style={{ fontSize: 8, color: dir === "asc" ? "#1A2332" : "#C5CCD6" }}>▲</span>
        <span style={{ fontSize: 8, color: dir === "desc" ? "#1A2332" : "#C5CCD6" }}>▼</span>
      </span>
    </button>
  );
}

// ---- ROW ----------------------------------------------------------------
const COLS = "36px minmax(0, 1.6fr) 150px 90px 90px 90px 104px 28px";

function TripRow({ t }) {
  const m = MODE_META[t.mode];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: COLS, gap: 12,
      alignItems: "center",
      padding: "14px 16px",
      borderBottom: "1px solid #F0F2F5",
      cursor: "pointer", transition: "background 0.12s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = "#F5F7FA"}
    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 9,
        background: `${m.color}1F`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={m.icon} size={16} color={m.color} />
      </div>
      <div style={{ minWidth: 0, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#1A2332", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.from}</span>
        <Icon name="arrow-right" size={12} color="#6B7A8D" strokeWidth={2} />
        <span style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.to}</span>
      </div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>{t.datetime}</div>
      <div style={{ textAlign: "right", fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2332" }}>
        {t.km.toFixed(1)} <span style={{ color: "#6B7A8D", fontSize: 11 }}>km</span>
      </div>
      <div style={{ textAlign: "right", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
        {t.duration} <span style={{ fontSize: 11 }}>min</span>
      </div>
      <div style={{
        textAlign: "right",
        fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
        color: t.kg === 0 ? "#3DAB82" : (t.kg > 2 ? "#F0956A" : "#1A2332"),
      }}>
        {t.kg.toFixed(1)} <span style={{ color: "#6B7A8D", fontSize: 11, fontWeight: 400 }}>kg</span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 8px", borderRadius: 999,
          fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
          letterSpacing: 0.3, textTransform: "uppercase",
          background: t.source === "auto" ? "rgba(74,144,196,0.10)" : "#F0F2F5",
          color: t.source === "auto" ? "#4A90C4" : "#6B7A8D",
        }}>
          <Icon name={t.source} size={10} color={t.source === "auto" ? "#4A90C4" : "#6B7A8D"} strokeWidth={2.4} />
          {t.source === "auto" ? "Detected" : "Manual"}
        </span>
      </div>
      <Icon name="chevron-right" size={16} color="#C5CCD6" />
    </div>
  );
}

// ---- TRIPS PAGE ---------------------------------------------------------
const PAGE_SIZE = 12;

function TripsPage() {
  // Read URL params once on mount so links from Insights can pre-filter the view
  const initial = (() => {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    return {
      mode: p.get("mode") || "all",
      source: p.get("source") || "all",
      search: p.get("q") || "",
    };
  })();

  const [range, setRange] = useStateTrips("Last 30 days");
  const [search, setSearch] = useStateTrips(initial.search);
  const [mode, setMode] = useStateTrips(initial.mode);
  const [source, setSource] = useStateTrips(initial.source);
  const [sort, setSort] = useStateTrips({ key: "date", dir: "desc" });
  const [page, setPage] = useStateTrips(1);

  const filtered = useMemoTrips(() => {
    const q = search.trim().toLowerCase();
    return ALL_TRIPS.filter(t => {
      if (mode !== "all" && t.mode !== mode) return false;
      if (source !== "all" && t.source !== source) return false;
      if (q && !(`${t.from} ${t.to}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [search, mode, source]);

  const sorted = useMemoTrips(() => {
    const arr = [...filtered];
    const k = sort.key;
    arr.sort((a, b) => {
      let av, bv;
      if (k === "date") { av = a.dateISO; bv = b.dateISO; }
      else if (k === "route") { av = `${a.from}${a.to}`; bv = `${b.from}${b.to}`; }
      else { av = a[k]; bv = b[k]; }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ?  1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sort]);

  const totalKm = filtered.reduce((s, t) => s + t.km, 0);
  const totalKg = filtered.reduce((s, t) => s + t.kg, 0);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageTrips = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [search, mode, source, sort]);

  const exportBtn = (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 12px", borderRadius: 9,
      background: "#fff", border: "1px solid #F0F2F5",
      fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: "#1A2332",
      cursor: "pointer",
    }}>
      <Icon name="arrow-down" size={14} color="#6B7A8D" strokeWidth={2.2} />
      Export CSV
    </button>
  );

  return (
    <PageShell
      active="trips"
      title="Trips"
      subtitle="Browse and filter every trip Atmos has logged for you."
      range={range} setRange={setRange}
      rightExtra={exportBtn}
    >
      {/* Stat strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <CompactStat
          accent="#4A90C4" icon="trips"
          label="Total trips"
          value={TRIP_STATS.totalTrips}
          sub={`${TRIP_STATS.autoCount} detected · ${TRIP_STATS.manualCount} manual`}
        />
        <CompactStat
          accent="#3DAB82" icon="bike"
          label="Total distance"
          value={TRIP_STATS.totalKm.toFixed(1)} unit="km"
          sub={`Avg ${TRIP_STATS.avgKm.toFixed(1)} km / trip`}
        />
        <CompactStat
          accent="#F0956A" icon="leaf"
          label="Total CO₂"
          value={TRIP_STATS.totalKg.toFixed(1)} unit="kg"
          sub={`Avg ${TRIP_STATS.avgKg.toFixed(2)} kg / trip`}
        />
        <CompactStat
          accent="#6B7A8D" icon="calendar"
          label="Active days"
          value={20} unit="of 30"
          sub="Last logged · today"
        />
      </div>

      {/* Filters card */}
      <Card padding="18px 20px" style={{ gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <SearchInput value={search} onChange={setSearch} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D", fontWeight: 500 }}>Source</span>
            <SourceToggle value={source} onChange={setSource} />
          </div>
        </div>
        <ModeChips value={mode} onChange={setMode} />
      </Card>

      {/* Trips list */}
      <Card padding="0" style={{ gap: 0, overflow: "hidden" }}>
        {/* Result summary */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 20px",
          borderBottom: "1px solid #F0F2F5",
        }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, color: "#1A2332" }}>
              {sorted.length === ALL_TRIPS.length ? "All trips" : `${sorted.length} of ${ALL_TRIPS.length} trips`}
            </div>
            <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
              {totalKm.toFixed(1)} km · {totalKg.toFixed(1)} kg CO₂ in current filter
            </div>
          </div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D" }}>
            Sorted by <span style={{ color: "#1A2332", fontWeight: 500 }}>{sort.key === "date" ? "Date" : sort.key === "kg" ? "CO₂" : sort.key === "km" ? "Distance" : sort.key === "duration" ? "Duration" : "Route"}</span> ({sort.dir === "desc" ? "newest first" : "oldest first"})
          </div>
        </div>

        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: COLS, gap: 12,
          alignItems: "center",
          padding: "10px 16px",
          background: "#FAFBFC", borderBottom: "1px solid #F0F2F5",
        }}>
          <div />
          <SortHeader label="Route" k="route" sort={sort} setSort={setSort} />
          <SortHeader label="Date" k="date" sort={sort} setSort={setSort} />
          <div style={{ textAlign: "right" }}><SortHeader label="Distance" k="km" sort={sort} setSort={setSort} align="right" /></div>
          <div style={{ textAlign: "right" }}><SortHeader label="Duration" k="duration" sort={sort} setSort={setSort} align="right" /></div>
          <div style={{ textAlign: "right" }}><SortHeader label="CO₂" k="kg" sort={sort} setSort={setSort} align="right" /></div>
          <div style={{
            textAlign: "right",
            fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
            color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
          }}>Source</div>
          <div />
        </div>

        {/* Rows */}
        {pageTrips.length === 0 ? (
          <div style={{
            padding: "60px 16px", textAlign: "center",
            fontFamily: "Inter, sans-serif", color: "#6B7A8D",
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1A2332" }}>No trips match these filters</div>
            <div style={{ marginTop: 4, fontSize: 12.5 }}>Try widening the date range or clearing the search.</div>
          </div>
        ) : (
          pageTrips.map(t => <TripRow key={t.id} t={t} />)
        )}

        {/* Pagination */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "#FAFBFC",
        }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
            Showing <span style={{ color: "#1A2332", fontWeight: 500 }}>{pageTrips.length === 0 ? 0 : ((safePage - 1) * PAGE_SIZE + 1)}–{(safePage - 1) * PAGE_SIZE + pageTrips.length}</span> of {sorted.length}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <PageBtn disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              <Icon name="chevron-right" size={14} color="#6B7A8D" style={{ transform: "rotate(180deg)" }} />
            </PageBtn>
            {Array.from({ length: pageCount }).map((_, i) => (
              <PageBtn key={i} active={i + 1 === safePage} onClick={() => setPage(i + 1)}>{i + 1}</PageBtn>
            ))}
            <PageBtn disabled={safePage === pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>
              <Icon name="chevron-right" size={14} color="#6B7A8D" />
            </PageBtn>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

function PageBtn({ children, onClick, active, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 30, height: 30, padding: "0 8px",
        background: active ? "rgba(74,144,196,0.10)" : "#fff",
        border: active ? "1px solid rgba(74,144,196,0.25)" : "1px solid #F0F2F5",
        color: active ? "#4A90C4" : disabled ? "#C5CCD6" : "#1A2332",
        fontFamily: "Inter, sans-serif", fontSize: 12.5,
        fontWeight: active ? 600 : 500,
        borderRadius: 7,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >{children}</button>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TripsPage />);
