// Atmos Dashboard page

const { useState } = React;
const { WEEKLY_DATA, DAILY_GOAL, TRANSPORT_MODES, RECENT_TRIPS, INSIGHTS, STATS } = window.AtmosData;
const { Card, Legend, PageShell } = window.AtmosShared;

// ---- STAT CARDS ----------------------------------------------------------
function StatCard({ accent, label, value, unit, sub, icon }) {
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
        {icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `${accent}1A`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name={icon} size={15} color={accent} />
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
        <span style={{
          fontFamily: "Inter, sans-serif", fontSize: 30, fontWeight: 600,
          color: "#1A2332", letterSpacing: -0.6, lineHeight: 1,
        }}>{value}</span>
        {unit && (
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: "#6B7A8D" }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 4 }}>{sub}</div>
    </div>
  );
}

function StatCards() {
  const trendNeg = STATS.monthlyTrend < 0;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      <StatCard
        accent="#4A90C4" label="CO₂ this month"
        value={STATS.monthlyCO2.toFixed(1)} unit="kg" icon="leaf"
        sub={
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: trendNeg ? "#3DAB82" : "#F0956A", fontWeight: 500 }}>
            <Icon name={trendNeg ? "arrow-down" : "arrow-up"} size={13} color={trendNeg ? "#3DAB82" : "#F0956A"} strokeWidth={2.2} />
            {Math.abs(STATS.monthlyTrend)}%
            <span style={{ color: "#6B7A8D", fontWeight: 400 }}>vs last month</span>
          </div>
        }
      />
      <StatCard
        accent="#3DAB82" label="Daily goal"
        value={STATS.todayKg.toFixed(1)} unit={`/ ${STATS.goalKg.toFixed(1)} kg`} icon="target"
        sub={
          <div>
            <div style={{ height: 6, background: "#F0F2F5", borderRadius: 4, overflow: "hidden", marginTop: 4 }}>
              <div style={{
                width: `${Math.min(100, (STATS.todayKg / STATS.goalKg) * 100)}%`,
                height: "100%",
                background: STATS.todayKg <= STATS.goalKg ? "#3DAB82" : "#F0956A",
                borderRadius: 4, transition: "width 0.4s",
              }} />
            </div>
            <div style={{ marginTop: 6, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D" }}>
              {(STATS.goalKg - STATS.todayKg).toFixed(1)} kg under today
            </div>
          </div>
        }
      />
      <StatCard
        accent="#F0956A" label="Current streak"
        value={STATS.streak} unit="days" icon="flame"
        sub={
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
            Longest: <span style={{ color: "#1A2332", fontWeight: 500 }}>21 days</span>
          </div>
        }
      />
      <StatCard
        accent="#6B7A8D" label="Days tracked"
        value={STATS.daysTracked} unit="total" icon="calendar"
        sub={
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
            Since <span style={{ color: "#1A2332", fontWeight: 500 }}>Feb 21</span>
          </div>
        }
      />
    </div>
  );
}

// ---- TRANSPORT BREAKDOWN -------------------------------------------------
function TransportBreakdown() {
  const [hovered, setHovered] = useState(null);
  const total = TRANSPORT_MODES.reduce((s, m) => s + m.kg, 0);
  const sorted = [...TRANSPORT_MODES].sort((a, b) => b.kg - a.kg);

  return (
    <Card title="Transport mix" subtitle="By mode, this month">
      <DonutChart modes={TRANSPORT_MODES} hovered={hovered} setHovered={setHovered} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
        {sorted.map(m => {
          const pct = total > 0 ? (m.kg / total) * 100 : 0;
          const isHov = hovered === m.id;
          return (
            <div
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "grid", gridTemplateColumns: "28px 1fr auto",
                alignItems: "center", gap: 10,
                padding: "6px 4px", borderRadius: 8,
                background: isHov ? "#F5F7FA" : "transparent",
                transition: "background 0.15s",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `${m.color}1F`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={m.icon} size={15} color={m.color} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, color: "#1A2332" }}>{m.name}</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D" }}>{m.km} km</span>
                </div>
                <div style={{ height: 4, background: "#F0F2F5", borderRadius: 3, marginTop: 5, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 56 }}>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#1A2332" }}>
                  {m.kg.toFixed(1)} <span style={{ fontWeight: 400, color: "#6B7A8D", fontSize: 11 }}>kg</span>
                </div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B7A8D" }}>{pct.toFixed(0)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---- TRIPS TABLE ---------------------------------------------------------
function TripsTable() {
  const modeMeta = Object.fromEntries(TRANSPORT_MODES.map(m => [m.id, m]));
  return (
    <Card
      title="Recent trips"
      subtitle="Latest 5 trips · all detected unless flagged"
      action={
        <a href="Trips.html" style={{
          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
          color: "#4A90C4", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          View all trips
          <Icon name="arrow-right" size={13} color="#4A90C4" strokeWidth={2.2} />
        </a>
      }
    >
      <div style={{ marginTop: -4 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "36px 1fr 130px 80px 80px 92px",
          gap: 12, padding: "8px 4px",
          borderBottom: "1px solid #F0F2F5",
          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
          color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
        }}>
          <div />
          <div>Route</div>
          <div>When</div>
          <div style={{ textAlign: "right" }}>Distance</div>
          <div style={{ textAlign: "right" }}>CO₂</div>
          <div style={{ textAlign: "right" }}>Source</div>
        </div>

        {RECENT_TRIPS.map(t => {
          const m = modeMeta[t.mode];
          return (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 130px 80px 80px 92px",
                gap: 12, alignItems: "center",
                padding: "12px 4px",
                borderBottom: "1px solid #F0F2F5",
                cursor: "pointer", transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F5F7FA"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: `${m.color}1F`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={m.icon} size={15} color={m.color} />
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#1A2332", display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <span style={{ fontWeight: 500 }}>{t.from}</span>
                <Icon name="arrow-right" size={12} color="#6B7A8D" strokeWidth={2} />
                <span style={{ fontWeight: 500 }}>{t.to}</span>
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>{t.datetime}</div>
              <div style={{ textAlign: "right", fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2332" }}>
                {t.km.toFixed(1)} <span style={{ color: "#6B7A8D", fontSize: 11 }}>km</span>
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
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---- INSIGHTS FEED -------------------------------------------------------
function InsightsFeed() {
  return (
    <Card
      title="Insights"
      subtitle="Generated weekly from your trip patterns"
      action={
        <a href="Insights.html" style={{
          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
          color: "#4A90C4", textDecoration: "none",
        }}>See all</a>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {INSIGHTS.map(ins => (
          <div key={ins.id} style={{
            display: "flex", gap: 14,
            padding: "14px 16px",
            background: "#FAFBFC", borderRadius: 12,
            borderLeft: `4px solid ${ins.color}`,
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#F5F7FA"}
          onMouseLeave={(e) => e.currentTarget.style.background = "#FAFBFC"}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: `${ins.color}1F`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={ins.icon} size={16} color={ins.color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
                color: ins.color, letterSpacing: 0.5, textTransform: "uppercase",
              }}>{ins.type}</div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                color: "#1A2332", marginTop: 3,
              }}>{ins.title}</div>
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D",
                marginTop: 4, lineHeight: 1.5,
              }}>{ins.body}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---- APP -----------------------------------------------------------------
function App() {
  const [range, setRange] = useState("This month");
  return (
    <PageShell
      active="dashboard"
      title="Dashboard"
      subtitle="Welcome back, Maya — here's your impact this month."
      range={range} setRange={setRange}
    >
      <StatCards />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", gap: 20 }}>
        <Card
          title="Weekly CO₂ trend"
          subtitle="Last 7 days · kg CO₂ per day"
          action={
            <div style={{ display: "flex", gap: 16 }}>
              <Legend color="#4A90C4" label="Daily CO₂" />
              <Legend color="#3DAB82" label="Goal" dashed />
            </div>
          }
        >
          <WeeklyLineChart data={WEEKLY_DATA} goal={DAILY_GOAL} />
        </Card>
        <TransportBreakdown />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", gap: 20 }}>
        <TripsTable />
        <InsightsFeed />
      </div>
    </PageShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
