// Line chart + Donut chart components for Atmos dashboard.

const { useState, useMemo, useRef, useEffect } = React;

// ---- LINE CHART ----------------------------------------------------------
function WeeklyLineChart({ data, goal }) {
  const W = 760, H = 280;
  const PAD = { top: 28, right: 28, bottom: 36, left: 44 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const yMax = Math.max(goal + 1, ...data.map(d => d.kg)) + 1;
  const yStep = 2;
  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const xFor = (i) => PAD.left + (innerW * i) / (data.length - 1);
  const yFor = (v) => PAD.top + innerH - (v / yMax) * innerH;

  // smooth path (catmull-rom -> bezier)
  const linePath = useMemo(() => {
    const pts = data.map((d, i) => [xFor(i), yFor(d.kg)]);
    if (pts.length < 2) return "";
    let p = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const t = 0.18;
      const c1x = p1[0] + (p2[0] - p0[0]) * t;
      const c1y = p1[1] + (p2[1] - p0[1]) * t;
      const c2x = p2[0] - (p3[0] - p1[0]) * t;
      const c2y = p2[1] - (p3[1] - p1[1]) * t;
      p += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
    }
    return p;
  }, [data]);

  const areaPath = linePath
    ? `${linePath} L ${xFor(data.length - 1)} ${yFor(0)} L ${xFor(0)} ${yFor(0)} Z`
    : "";

  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  const handleMove = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = W / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    // nearest index
    let best = 0, bestD = Infinity;
    for (let i = 0; i < data.length; i++) {
      const d = Math.abs(xFor(i) - x);
      if (d < bestD) { bestD = d; best = i; }
    }
    setHover(best);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#4A90C4" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4A90C4" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* y gridlines */}
        {yTicks.map(v => (
          <g key={v}>
            <line
              x1={PAD.left} x2={W - PAD.right}
              y1={yFor(v)} y2={yFor(v)}
              stroke="#F0F2F5" strokeWidth="1"
            />
            <text
              x={PAD.left - 10} y={yFor(v) + 4}
              fontSize="11" fill="#6B7A8D" textAnchor="end"
              fontFamily="Inter, sans-serif"
            >
              {v}
            </text>
          </g>
        ))}

        {/* goal line */}
        <line
          x1={PAD.left} x2={W - PAD.right}
          y1={yFor(goal)} y2={yFor(goal)}
          stroke="#3DAB82" strokeWidth="1.5" strokeDasharray="4 4"
        />
        <text
          x={W - PAD.right} y={yFor(goal) - 6}
          fontSize="10.5" fill="#3DAB82" textAnchor="end"
          fontFamily="Inter, sans-serif" fontWeight="600"
        >
          DAILY GOAL · {goal} kg
        </text>

        {/* area + line */}
        <path d={areaPath} fill="url(#areaFill)" />
        <path d={linePath} stroke="#4A90C4" strokeWidth="2.25" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* x labels */}
        {data.map((d, i) => (
          <text
            key={d.day}
            x={xFor(i)} y={H - 14}
            fontSize="11.5" fill="#6B7A8D" textAnchor="middle"
            fontFamily="Inter, sans-serif"
            fontWeight={hover === i ? 600 : 400}
          >
            {d.day}
          </text>
        ))}

        {/* dots */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xFor(i)} cy={yFor(d.kg)}
            r={hover === i ? 5 : 3.2}
            fill="#fff" stroke="#4A90C4" strokeWidth="2"
          />
        ))}

        {/* hover guide line */}
        {hover !== null && (
          <line
            x1={xFor(hover)} x2={xFor(hover)}
            y1={PAD.top} y2={H - PAD.bottom}
            stroke="#4A90C4" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 3"
          />
        )}
      </svg>

      {/* tooltip */}
      {hover !== null && (() => {
        const d = data[hover];
        const svg = svgRef.current;
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        const px = (xFor(hover) / W) * rect.width;
        const py = (yFor(d.kg) / H) * rect.height;
        const overGoal = d.kg > goal;
        return (
          <div style={{
            position: "absolute",
            left: px, top: py - 14,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
          }}>
            <div style={{
              background: "#1A2332", color: "#fff",
              padding: "10px 12px", borderRadius: 10,
              boxShadow: "0 4px 14px rgba(26,35,50,0.2)",
              minWidth: 120, fontFamily: "Inter, sans-serif",
            }}>
              <div style={{ fontSize: 11, opacity: 0.65, letterSpacing: 0.3 }}>
                {d.date.toUpperCase()}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2, display: "flex", alignItems: "baseline", gap: 4 }}>
                {d.kg.toFixed(1)} <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.65 }}>kg CO₂</span>
              </div>
              <div style={{ fontSize: 11, marginTop: 4, color: overGoal ? "#F0956A" : "#3DAB82" }}>
                {overGoal ? `+${(d.kg - goal).toFixed(1)} over goal` : `${(goal - d.kg).toFixed(1)} under goal`}
              </div>
            </div>
            <div style={{
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #1A2332",
              margin: "0 auto",
            }} />
          </div>
        );
      })()}
    </div>
  );
}

// ---- DONUT CHART ---------------------------------------------------------
function DonutChart({ modes, hovered, setHovered }) {
  const size = 200;
  const R = 88;
  const r = 60;
  const c = size / 2;

  const total = modes.reduce((s, m) => s + m.kg, 0);
  const totalKm = modes.reduce((s, m) => s + m.km, 0);

  // build arc segments with small gaps
  const GAP = 0.012; // radians
  let angle = -Math.PI / 2;
  const segments = modes
    .filter(m => m.kg > 0 || true) // include zero-kg with min slice
    .map((m) => {
      // weight by kg, but give zero-kg modes a tiny visible sliver via km
      const weight = m.kg > 0 ? m.kg / total : 0;
      return { ...m, weight };
    });

  // segments with weight > 0
  const visible = segments.filter(s => s.weight > 0);
  const arcs = [];
  for (const seg of visible) {
    const sweep = seg.weight * (Math.PI * 2) - GAP;
    const a0 = angle + GAP / 2;
    const a1 = a0 + sweep;
    angle += seg.weight * (Math.PI * 2);

    const x0 = c + R * Math.cos(a0), y0 = c + R * Math.sin(a0);
    const x1 = c + R * Math.cos(a1), y1 = c + R * Math.sin(a1);
    const xi1 = c + r * Math.cos(a1), yi1 = c + r * Math.sin(a1);
    const xi0 = c + r * Math.cos(a0), yi0 = c + r * Math.sin(a0);
    const large = sweep > Math.PI ? 1 : 0;
    const d = `M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${r} ${r} 0 ${large} 0 ${xi0} ${yi0} Z`;
    arcs.push({ d, color: seg.color, id: seg.id, kg: seg.kg, name: seg.name });
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {arcs.map((a) => (
          <path
            key={a.id}
            d={a.d}
            fill={a.color}
            opacity={hovered && hovered !== a.id ? 0.35 : 1}
            style={{ transition: "opacity 0.15s, transform 0.15s", cursor: "pointer", transformOrigin: `${c}px ${c}px`, transform: hovered === a.id ? "scale(1.03)" : "scale(1)" }}
            onMouseEnter={() => setHovered(a.id)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* centre text */}
        <text x={c} y={c - 4} textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="32" fontWeight="600" fill="#1A2332">
          {total.toFixed(1)}
        </text>
        <text x={c} y={c + 16} textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="11" fontWeight="500" fill="#6B7A8D" letterSpacing="0.3">
          kg CO₂ · this month
        </text>
      </svg>
    </div>
  );
}

window.WeeklyLineChart = WeeklyLineChart;
window.DonutChart = DonutChart;
