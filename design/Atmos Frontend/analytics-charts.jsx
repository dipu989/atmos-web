// Charts for the Analytics page: DailyBars, MoMBars, ModeStackedArea, WeekdayBars

const { useState: useStateAnalytics, useRef: useRefAnalytics, useMemo: useMemoAnalytics } = React;

// ---- DAILY BARS (30 days) -----------------------------------------------
function DailyBarChart({ data, goal = 5.0 }) {
  const W = 1100, H = 280;
  const PAD = { top: 28, right: 24, bottom: 36, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const yMax = Math.max(goal + 2, ...data.map(d => d.kg)) + 1;
  const yTicks = [];
  const step = yMax > 8 ? 2 : 1;
  for (let v = 0; v <= yMax; v += step) yTicks.push(v);

  const barW = (innerW / data.length) * 0.62;
  const xFor = (i) => PAD.left + (innerW / data.length) * (i + 0.5) - barW / 2;
  const yFor = (v) => PAD.top + innerH - (v / yMax) * innerH;

  const [hover, setHover] = useStateAnalytics(null);
  const svgRef = useRefAnalytics(null);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {/* gridlines */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yFor(v)} y2={yFor(v)} stroke="#F0F2F5" />
            <text x={PAD.left - 10} y={yFor(v) + 4} fontSize="11" fill="#6B7A8D" textAnchor="end" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}

        {/* goal line */}
        <line x1={PAD.left} x2={W - PAD.right} y1={yFor(goal)} y2={yFor(goal)}
              stroke="#3DAB82" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={W - PAD.right} y={yFor(goal) - 6} fontSize="10.5" fill="#3DAB82"
              textAnchor="end" fontFamily="Inter, sans-serif" fontWeight="600">DAILY GOAL · {goal} kg</text>

        {/* bars */}
        {data.map((d, i) => {
          const overGoal = d.kg > goal;
          const isHov = hover === i;
          const fill = overGoal ? "#F0956A" : "#4A90C4";
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
              <rect
                x={xFor(i) - 4} y={PAD.top}
                width={barW + 8} height={innerH}
                fill="transparent"
              />
              <rect
                x={xFor(i)} y={yFor(d.kg)}
                width={barW} height={innerH - (yFor(d.kg) - PAD.top)}
                rx={2}
                fill={fill}
                opacity={hover !== null && !isHov ? 0.45 : (d.weekend ? 0.85 : 1)}
              />
            </g>
          );
        })}

        {/* x labels — every 5 days */}
        {data.map((d, i) => (
          (i % 5 === 0 || i === data.length - 1) ? (
            <text key={i} x={xFor(i) + barW / 2} y={H - 12}
                  fontSize="11" fill="#6B7A8D" textAnchor="middle" fontFamily="Inter, sans-serif">
              {d.day}
            </text>
          ) : null
        ))}
      </svg>

      {hover !== null && (() => {
        const d = data[hover];
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        const cx = (xFor(hover) + barW / 2) / W * rect.width;
        const cy = yFor(d.kg) / H * rect.height;
        const overGoal = d.kg > goal;
        return (
          <div style={{
            position: "absolute", left: cx, top: cy - 14,
            transform: "translate(-50%, -100%)", pointerEvents: "none",
          }}>
            <div style={{
              background: "#1A2332", color: "#fff",
              padding: "10px 12px", borderRadius: 10,
              boxShadow: "0 4px 14px rgba(26,35,50,0.2)",
              minWidth: 120, fontFamily: "Inter, sans-serif",
            }}>
              <div style={{ fontSize: 11, opacity: 0.65, letterSpacing: 0.3, textTransform: "uppercase" }}>{d.label}</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
                {d.kg.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.65 }}>kg CO₂</span>
              </div>
              <div style={{ fontSize: 11, marginTop: 4, color: overGoal ? "#F0956A" : "#3DAB82" }}>
                {overGoal ? `+${(d.kg - goal).toFixed(1)} over goal` : `${(goal - d.kg).toFixed(1)} under goal`}
              </div>
            </div>
            <div style={{
              width: 0, height: 0,
              borderLeft: "6px solid transparent", borderRight: "6px solid transparent",
              borderTop: "6px solid #1A2332",
              margin: "0 auto",
            }} />
          </div>
        );
      })()}
    </div>
  );
}

// ---- MONTH-OVER-MONTH GROUPED BARS --------------------------------------
function MoMBars({ data }) {
  const W = 520, H = 260;
  const PAD = { top: 28, right: 16, bottom: 36, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const yMax = Math.ceil(Math.max(...data.flatMap(d => [d.curr, d.prev])) / 10) * 10 + 5;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += 10) yTicks.push(v);

  const groupW = innerW / data.length;
  const barW = groupW * 0.28;
  const xFor = (i, which) => PAD.left + groupW * i + groupW / 2 + (which === "prev" ? -barW - 3 : 3);
  const yFor = (v) => PAD.top + innerH - (v / yMax) * innerH;

  const [hover, setHover] = useStateAnalytics(null); // { i, which }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yFor(v)} y2={yFor(v)} stroke="#F0F2F5" />
            <text x={PAD.left - 10} y={yFor(v) + 4} fontSize="11" fill="#6B7A8D" textAnchor="end" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}

        {data.map((d, i) => [
          <rect key={`p${i}`}
            x={xFor(i, "prev")} y={yFor(d.prev)}
            width={barW} height={innerH - (yFor(d.prev) - PAD.top)}
            rx={3} fill="#C5CCD6"
            opacity={hover && (hover.i !== i || hover.which !== "prev") ? 0.55 : 1}
            onMouseEnter={() => setHover({ i, which: "prev" })}
            onMouseLeave={() => setHover(null)}
          />,
          <rect key={`c${i}`}
            x={xFor(i, "curr")} y={yFor(d.curr)}
            width={barW} height={innerH - (yFor(d.curr) - PAD.top)}
            rx={3} fill="#4A90C4"
            opacity={hover && (hover.i !== i || hover.which !== "curr") ? 0.55 : 1}
            onMouseEnter={() => setHover({ i, which: "curr" })}
            onMouseLeave={() => setHover(null)}
          />,
        ])}

        {data.map((d, i) => (
          <text key={i} x={PAD.left + groupW * i + groupW / 2} y={H - 12}
                fontSize="11.5" fill="#6B7A8D" textAnchor="middle" fontFamily="Inter, sans-serif">
            {d.label}
          </text>
        ))}
      </svg>
      {hover && (() => {
        const d = data[hover.i];
        const v = hover.which === "curr" ? d.curr : d.prev;
        const other = hover.which === "curr" ? d.prev : d.curr;
        const diff = v - other;
        return (
          <div style={{
            position: "absolute", top: 10, right: 16,
            fontFamily: "Inter, sans-serif",
            background: "#1A2332", color: "#fff",
            padding: "10px 12px", borderRadius: 10,
            boxShadow: "0 4px 14px rgba(26,35,50,0.2)",
          }}>
            <div style={{ fontSize: 11, opacity: 0.65, letterSpacing: 0.3, textTransform: "uppercase" }}>
              {d.label} · {hover.which === "curr" ? "This month" : "Last month"}
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>
              {v.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.65 }}>kg</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 4, color: diff < 0 ? "#3DAB82" : "#F0956A" }}>
              {diff < 0 ? "↓" : "↑"} {Math.abs(diff).toFixed(1)} kg vs {hover.which === "curr" ? "last month" : "this month"}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ---- STACKED AREA (mode mix over weeks) ---------------------------------
function ModeStackedArea({ data, modes }) {
  const W = 520, H = 260;
  const PAD = { top: 24, right: 16, bottom: 36, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const totals = data.map(d => modes.reduce((s, m) => s + (d[m.id] || 0), 0));
  const yMax = Math.ceil(Math.max(...totals) / 5) * 5;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += 10) yTicks.push(v);

  const xFor = (i) => PAD.left + (innerW * i) / (data.length - 1);
  const yFor = (v) => PAD.top + innerH - (v / yMax) * innerH;

  // smooth path for each layer
  const smoothPath = (pts) => {
    let p = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const t = 0.2;
      const c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      const c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      p += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
    }
    return p;
  };

  // build cumulative layers
  const layers = useMemoAnalytics(() => {
    const cum = data.map(() => 0);
    const out = [];
    for (const m of modes) {
      const top = data.map((d, i) => cum[i] + (d[m.id] || 0));
      const topPts = top.map((v, i) => [xFor(i), yFor(v)]);
      const botPts = cum.map((v, i) => [xFor(i), yFor(v)]).reverse();
      const path = smoothPath(topPts) + " L " + botPts.map(p => `${p[0]} ${p[1]}`).join(" L ") + " Z";
      out.push({ id: m.id, color: m.color, name: m.name, path });
      cum.forEach((_, i) => cum[i] = top[i]);
    }
    return out;
  }, [data, modes]);

  const [hover, setHover] = useStateAnalytics(null);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yFor(v)} y2={yFor(v)} stroke="#F0F2F5" />
            <text x={PAD.left - 10} y={yFor(v) + 4} fontSize="11" fill="#6B7A8D" textAnchor="end" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}

        {layers.map(L => (
          <path key={L.id} d={L.path} fill={L.color}
                opacity={hover && hover !== L.id ? 0.25 : 0.85}
                onMouseEnter={() => setHover(L.id)} onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer", transition: "opacity 0.15s" }} />
        ))}

        {data.map((d, i) => (
          <text key={i} x={xFor(i)} y={H - 12}
                fontSize="11" fill="#6B7A8D" textAnchor="middle" fontFamily="Inter, sans-serif">
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ---- WEEKDAY AVERAGE BARS -----------------------------------------------
function WeekdayBars({ data, goal = 5.0 }) {
  const W = 520, H = 220;
  const PAD = { top: 24, right: 16, bottom: 36, left: 40 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const yMax = Math.max(goal + 1, ...data.map(d => d.kg)) + 1;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += 2) yTicks.push(v);

  const groupW = innerW / data.length;
  const barW = groupW * 0.45;
  const xFor = (i) => PAD.left + groupW * i + groupW / 2 - barW / 2;
  const yFor = (v) => PAD.top + innerH - (v / yMax) * innerH;

  const [hover, setHover] = useStateAnalytics(null);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {yTicks.map(v => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={yFor(v)} y2={yFor(v)} stroke="#F0F2F5" />
            <text x={PAD.left - 10} y={yFor(v) + 4} fontSize="11" fill="#6B7A8D" textAnchor="end" fontFamily="Inter, sans-serif">{v}</text>
          </g>
        ))}

        <line x1={PAD.left} x2={W - PAD.right} y1={yFor(goal)} y2={yFor(goal)}
              stroke="#3DAB82" strokeWidth="1.5" strokeDasharray="4 4" />

        {data.map((d, i) => {
          const overGoal = d.kg > goal;
          return (
            <rect key={i}
              x={xFor(i)} y={yFor(d.kg)}
              width={barW} height={innerH - (yFor(d.kg) - PAD.top)}
              rx={3}
              fill={overGoal ? "#F0956A" : "#4A90C4"}
              opacity={hover !== null && hover !== i ? 0.45 : 1}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}

        {data.map((d, i) => (
          <text key={i} x={PAD.left + groupW * i + groupW / 2} y={H - 12}
                fontSize="11.5" fill={hover === i ? "#1A2332" : "#6B7A8D"}
                fontWeight={hover === i ? 600 : 400}
                textAnchor="middle" fontFamily="Inter, sans-serif">
            {d.day}
          </text>
        ))}

        {hover !== null && (
          <g>
            <text x={PAD.left + groupW * hover + groupW / 2}
                  y={yFor(data[hover].kg) - 8}
                  fontSize="12" fill="#1A2332" textAnchor="middle"
                  fontFamily="Inter, sans-serif" fontWeight="600">
              {data[hover].kg.toFixed(1)} kg
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

window.AtmosCharts = { DailyBarChart, MoMBars, ModeStackedArea, WeekdayBars };
