// Atmos — Analytics page

const { useState: useStateA } = React;
const { TRANSPORT_MODES } = window.AtmosData;
const { DAILY_30, MOM_WEEKS, MODE_WEEKS, WEEKDAY_AVG, TOP_ROUTES, ANALYTICS_STATS } = window.AtmosAnalytics;
const { Card, Legend, PageShell } = window.AtmosShared;
const { DailyBarChart, MoMBars, ModeStackedArea, WeekdayBars } = window.AtmosCharts;

const MODE_META = Object.fromEntries(TRANSPORT_MODES.map(m => [m.id, m]));

// Smaller analytics KPI tile (like Trips top strip, slightly larger).
function KPI({ accent, label, value, unit, sub, icon }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      borderTop: `3px solid ${accent}`,
      padding: "20px 22px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      display: "flex", flexDirection: "column", gap: 6,
      minHeight: 128,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500,
          color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
        }}>{label}</div>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `${accent}1A`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={15} color={accent} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
        <span style={{
          fontFamily: "Inter, sans-serif", fontSize: 30, fontWeight: 600,
          color: "#1A2332", letterSpacing: -0.6, lineHeight: 1,
        }}>{value}</span>
        {unit && (
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: "#6B7A8D" }}>{unit}</span>
        )}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 4 }}>{sub}</div>
    </div>
  );
}

// ---- Top recurring routes -----------------------------------------------
function TopRoutes() {
  const maxKm = Math.max(...TOP_ROUTES.map(r => r.km));
  return (
    <Card title="Top recurring routes" subtitle="Most-repeated origin → destination this month">
      <div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "36px minmax(0, 1fr) 60px 80px 90px",
          gap: 12,
          padding: "0 4px 10px",
          borderBottom: "1px solid #F0F2F5",
          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
          color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
        }}>
          <div />
          <div>Route</div>
          <div style={{ textAlign: "right" }}>Trips</div>
          <div style={{ textAlign: "right" }}>Total km</div>
          <div style={{ textAlign: "right" }}>Total CO₂</div>
        </div>
        {TOP_ROUTES.map(r => {
          const m = MODE_META[r.mode];
          const widthPct = (r.km / maxKm) * 100;
          return (
            <div key={r.id} style={{
              display: "grid",
              gridTemplateColumns: "36px minmax(0, 1fr) 60px 80px 90px",
              gap: 12, alignItems: "center",
              padding: "14px 4px",
              borderBottom: "1px solid #F0F2F5",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9,
                background: `${m.color}1F`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={m.icon} size={16} color={m.color} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#1A2332", display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.from}</span>
                  <Icon name="arrow-right" size={12} color="#6B7A8D" strokeWidth={2} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.to}</span>
                </div>
                <div style={{ height: 4, background: "#F0F2F5", borderRadius: 3, marginTop: 7, overflow: "hidden" }}>
                  <div style={{ width: `${widthPct}%`, height: "100%", background: m.color, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: "#1A2332" }}>{r.count}</div>
              <div style={{ textAlign: "right", fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2332" }}>
                {r.km.toFixed(1)} <span style={{ color: "#6B7A8D", fontSize: 11 }}>km</span>
              </div>
              <div style={{
                textAlign: "right",
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
                color: r.kg === 0 ? "#3DAB82" : (r.kg > 20 ? "#F0956A" : "#1A2332"),
              }}>
                {r.kg.toFixed(1)} <span style={{ color: "#6B7A8D", fontSize: 11, fontWeight: 400 }}>kg</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---- Page ---------------------------------------------------------------
function AnalyticsPage() {
  const [range, setRange] = useStateA("This month");
  const s = ANALYTICS_STATS;
  const trendNeg = s.trend < 0;

  const compareToggle = (
    <div style={{
      display: "inline-flex", padding: 3,
      background: "#F0F2F5", borderRadius: 9,
    }}>
      {["Days", "Weeks", "Months"].map((o, i) => {
        const active = i === 0;
        return (
          <button key={o} style={{
            padding: "6px 12px", border: "none",
            background: active ? "#fff" : "transparent",
            color: active ? "#1A2332" : "#6B7A8D",
            fontFamily: "Inter, sans-serif", fontSize: 12.5,
            fontWeight: active ? 600 : 500, borderRadius: 7, cursor: "pointer",
            boxShadow: active ? "0 1px 2px rgba(26,35,50,0.08)" : "none",
          }}>{o}</button>
        );
      })}
    </div>
  );

  return (
    <PageShell
      active="analytics"
      title="Analytics"
      subtitle="Trends, patterns, and comparisons across your tracked period."
      range={range} setRange={setRange}
    >
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <KPI
          accent="#4A90C4" icon="leaf" label="CO₂ this month"
          value={s.curr.toFixed(1)} unit="kg"
          sub={
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: trendNeg ? "#3DAB82" : "#F0956A", fontWeight: 500 }}>
              <Icon name={trendNeg ? "arrow-down" : "arrow-up"} size={13} color={trendNeg ? "#3DAB82" : "#F0956A"} strokeWidth={2.2} />
              {Math.abs(s.trend)}%
              <span style={{ color: "#6B7A8D", fontWeight: 400 }}>vs last month ({s.prev} kg)</span>
            </div>
          }
        />
        <KPI
          accent="#3DAB82" icon="target" label="Goal hit rate"
          value={s.goalHitRate} unit="%"
          sub={
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
              <span style={{ color: "#1A2332", fontWeight: 500 }}>{s.goalHitDays}</span> of {s.totalDays} days at or under goal
            </div>
          }
        />
        <KPI
          accent="#8AC9A8" icon="arrow-down" label="Best day"
          value={s.best.kg.toFixed(1)} unit="kg"
          sub={
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
              <span style={{ color: "#1A2332", fontWeight: 500 }}>{s.best.label}</span> · lowest emissions
            </div>
          }
        />
        <KPI
          accent="#F0956A" icon="arrow-up" label="Worst day"
          value={s.worst.kg.toFixed(1)} unit="kg"
          sub={
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
              <span style={{ color: "#1A2332", fontWeight: 500 }}>{s.worst.label}</span> · peak emission
            </div>
          }
        />
      </div>

      {/* Daily bars */}
      <Card
        title="Daily emissions"
        subtitle="Last 30 days · bars colored by goal status"
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Legend color="#4A90C4" label="At or under goal" />
            <Legend color="#F0956A" label="Over goal" />
            <Legend color="#3DAB82" label="Goal" dashed />
            {compareToggle}
          </div>
        }
      >
        <DailyBarChart data={DAILY_30} goal={5.0} />
      </Card>

      {/* Row: MoM compare + mode stacked */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20 }}>
        <div id="mom" style={{ scrollMarginTop: 92 }}>
        <Card
          title="This month vs last month"
          subtitle="kg CO₂ by week"
          action={
            <div style={{ display: "flex", gap: 14 }}>
              <Legend color="#4A90C4" label="This month" />
              <Legend color="#C5CCD6" label="Last month" />
            </div>
          }
        >
          <MoMBars data={MOM_WEEKS} />
        </Card>
        </div>

        <Card
          title="Transport mix over time"
          subtitle="Last 8 weeks · stacked kg by mode"
          action={
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {TRANSPORT_MODES.filter(m => m.id !== "bike" && m.id !== "walk").map(m => (
                <Legend key={m.id} color={m.color} label={m.name} />
              ))}
            </div>
          }
        >
          <ModeStackedArea data={MODE_WEEKS} modes={TRANSPORT_MODES.filter(m => m.id !== "bike" && m.id !== "walk")} />
        </Card>
      </div>

      {/* Row: weekday averages + top routes */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20 }}>
        <Card
          title="By weekday"
          subtitle="Average kg CO₂ per day-of-week"
          action={<Legend color="#3DAB82" label="Goal" dashed />}
        >
          <WeekdayBars data={WEEKDAY_AVG} goal={5.0} />
          <div style={{
            display: "flex", justifyContent: "space-between", gap: 12,
            paddingTop: 8, borderTop: "1px solid #F0F2F5",
            fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D",
          }}>
            <div>
              Best weekday: <span style={{ color: "#1A2332", fontWeight: 600 }}>Sun · 2.1 kg</span>
            </div>
            <div>
              Worst weekday: <span style={{ color: "#F0956A", fontWeight: 600 }}>Fri · 7.2 kg</span>
            </div>
          </div>
        </Card>

        <TopRoutes />
      </div>
    </PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AnalyticsPage />);
