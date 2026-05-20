// Atmos — Insights page

const { useState: useStateI, useMemo: useMemoI } = React;
const { Card, PageShell } = window.AtmosShared;
const { FEATURED_INSIGHT, ALL_INSIGHTS, ACHIEVEMENTS, INSIGHT_STATS } = window.AtmosInsightsData;

// ---- Sparkline (tiny SVG line) ------------------------------------------
function Sparkline({ values, highlight = null, color = "#4A90C4", w = 220, h = 56 }) {
  const max = Math.max(...values);
  const min = 0;
  const stepX = w / (values.length - 1);
  const yFor = (v) => h - 6 - ((v - min) / (max - min || 1)) * (h - 12);
  const pts = values.map((v, i) => [i * stepX, yFor(v)]);

  // smoothed path
  let p = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const t = 0.2;
    p += ` C ${p1[0] + (p2[0] - p0[0]) * t} ${p1[1] + (p2[1] - p0[1]) * t}, ${p2[0] - (p3[0] - p1[0]) * t} ${p2[1] - (p3[1] - p1[1]) * t}, ${p2[0]} ${p2[1]}`;
  }
  const area = `${p} L ${pts[pts.length - 1][0]} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={`spark-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color.slice(1)})`} />
      <path d={p} stroke={color} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y}
          r={highlight === i ? 4 : 2.2}
          fill={highlight === i ? "#F0956A" : "#fff"}
          stroke={highlight === i ? "#F0956A" : color}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

// ---- Featured Hero ------------------------------------------------------
function FeaturedHero() {
  const f = FEATURED_INSIGHT;
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #1A2332 0%, #2A3F5C 100%)",
      borderRadius: 18, padding: "32px 36px",
      color: "#fff",
      display: "grid", gridTemplateColumns: "1fr 280px",
      gap: 32, alignItems: "center",
    }}>
      {/* faint background accent */}
      <div style={{
        position: "absolute", right: -40, top: -40,
        width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,144,196,0.25) 0%, rgba(74,144,196,0) 70%)",
      }} />
      <div style={{ position: "relative" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 11px", borderRadius: 999,
          background: "rgba(74,144,196,0.18)", color: "#9ECAEE",
          fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
          letterSpacing: 0.5, textTransform: "uppercase",
        }}>
          <Icon name="insights" size={12} color="#9ECAEE" />
          {f.type} · This week
        </div>
        <h2 style={{
          margin: "16px 0 10px",
          fontFamily: "Inter, sans-serif", fontSize: 28, fontWeight: 600,
          letterSpacing: -0.5, lineHeight: 1.15,
          maxWidth: 580,
        }}>{f.title}</h2>
        <p style={{
          margin: 0,
          fontFamily: "Inter, sans-serif", fontSize: 14.5, lineHeight: 1.55,
          color: "rgba(255,255,255,0.75)",
          maxWidth: 580,
        }}>{f.body}</p>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button style={{
            padding: "9px 16px", borderRadius: 9,
            background: "#4A90C4", border: "none",
            color: "#fff", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
          }}>View full digest</button>
          <button style={{
            padding: "9px 16px", borderRadius: 9,
            background: "transparent", border: "1px solid rgba(255,255,255,0.18)",
            color: "rgba(255,255,255,0.85)", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
          }}>Share</button>
        </div>
      </div>

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
        <div>
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
            color: "rgba(255,255,255,0.5)", letterSpacing: 0.4, textTransform: "uppercase",
          }}>This week</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 600, letterSpacing: -1, lineHeight: 1 }}>{f.metric.primary}</span>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
              color: f.metric.delta < 0 ? "#5BD49F" : "#F0956A",
            }}>
              <Icon name={f.metric.delta < 0 ? "arrow-down" : "arrow-up"} size={13}
                    color={f.metric.delta < 0 ? "#5BD49F" : "#F0956A"} strokeWidth={2.4} />
              {Math.abs(f.metric.delta)}%
            </span>
          </div>
          <div style={{ marginTop: 4, fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{f.metric.sub}</div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.06)", borderRadius: 12,
          padding: "12px 14px",
        }}>
          <Sparkline values={f.spark} color="#9ECAEE" w={240} h={70} />
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 4,
            fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "rgba(255,255,255,0.55)",
          }}>
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Insight Card -------------------------------------------------------
function InsightCard({ ins, onAction }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: ins.spark ? "44px 1fr 240px" : "44px 1fr",
      gap: 16,
      background: "#fff",
      borderRadius: 14,
      padding: "20px 22px",
      borderLeft: `4px solid ${ins.color}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.15s, transform 0.15s",
      cursor: "default",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${ins.color}1F`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={ins.icon} size={18} color={ins.color} />
      </div>

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
            color: ins.color, letterSpacing: 0.5, textTransform: "uppercase",
          }}>{ins.type}</span>
          {ins.new && (
            <span style={{
              padding: "2px 7px", borderRadius: 999,
              background: "#E05252", color: "#fff",
              fontFamily: "Inter, sans-serif", fontSize: 9.5, fontWeight: 700,
              letterSpacing: 0.5, textTransform: "uppercase",
            }}>New</span>
          )}
          <span style={{ marginLeft: "auto", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D" }}>{ins.date}</span>
        </div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 600,
          color: "#1A2332", letterSpacing: -0.2,
        }}>{ins.title}</div>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#6B7A8D",
          marginTop: 6, lineHeight: 1.55,
        }}>{ins.body}</div>

        {ins.impact && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            marginTop: 10,
            padding: "5px 10px", borderRadius: 8,
            background: "rgba(61,171,130,0.10)",
            fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 600,
            color: "#3DAB82",
          }}>
            <Icon name="leaf" size={12} color="#3DAB82" />
            {ins.impact}
          </div>
        )}

        {ins.progress && (
          <div style={{ marginTop: 12 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D",
              marginBottom: 6,
            }}>
              <span>{ins.progress.label}</span>
              <span><span style={{ color: "#1A2332", fontWeight: 600 }}>{ins.progress.current}</span> / {ins.progress.target} days</span>
            </div>
            <div style={{ height: 6, background: "#F0F2F5", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                width: `${(ins.progress.current / ins.progress.target) * 100}%`,
                height: "100%", background: ins.color, borderRadius: 4,
              }} />
            </div>
          </div>
        )}

        {ins.actions && ins.actions.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {ins.actions.map((a, i) => {
              const primary = i === 0;
              return (
                <button key={a} onClick={() => onAction && onAction(a, ins)} style={{
                  padding: "7px 12px", borderRadius: 8,
                  border: primary ? "none" : "1px solid #F0F2F5",
                  background: primary ? `${ins.color}14` : "#fff",
                  color: primary ? ins.color : "#6B7A8D",
                  fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer",
                }}>{a}</button>
              );
            })}
          </div>
        )}
      </div>

      {ins.spark && (
        <div style={{
          alignSelf: "stretch",
          background: "#FAFBFC", borderRadius: 10,
          padding: "10px 12px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 500,
            color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
            marginBottom: 4,
          }}>Last 7 days</div>
          <Sparkline values={ins.spark} highlight={ins.sparkHighlight} color={ins.color} w={216} h={56} />
        </div>
      )}
    </div>
  );
}

// ---- Modal --------------------------------------------------------------
function Modal({ open, onClose, title, eyebrow, eyebrowColor = "#4A90C4", children, footer, width = 520 }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(26,35,50,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: width,
          background: "#fff", borderRadius: 18,
          boxShadow: "0 24px 60px rgba(26,35,50,0.25)",
          overflow: "hidden",
          animation: "atmosModalIn 0.18s ease-out",
        }}
      >
        <style>{`
          @keyframes atmosModalIn {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div style={{
          padding: "22px 28px 0",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            {eyebrow && (
              <div style={{
                fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
                color: eyebrowColor, letterSpacing: 0.5, textTransform: "uppercase",
              }}>{eyebrow}</div>
            )}
            <h3 style={{
              margin: "6px 0 0",
              fontFamily: "Inter, sans-serif", fontSize: 20, fontWeight: 600,
              color: "#1A2332", letterSpacing: -0.3,
            }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#F5F7FA", border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 18, color: "#6B7A8D",
            display: "flex", alignItems: "center", justifyContent: "center",
            lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: "18px 28px 22px" }}>{children}</div>
        {footer && (
          <div style={{
            padding: "16px 28px",
            background: "#FAFBFC",
            borderTop: "1px solid #F0F2F5",
            display: "flex", justifyContent: "flex-end", gap: 10,
          }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// Body content for each modal kind
function ShowRouteContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{
        margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#6B7A8D", lineHeight: 1.6,
      }}>
        We compared your usual Friday car commute with the closest Caltrain option. Taking the 8:12 from 4th & King would cut your morning emissions roughly in half.
      </p>

      {/* Route card */}
      <div style={{
        border: "1px solid #F0F2F5", borderRadius: 12, padding: "14px 16px",
        background: "#FAFBFC", display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "rgba(74,144,196,0.10)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="train" size={17} color="#4A90C4" />
          </div>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1A2332" }}>Caltrain 213 · Local</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D" }}>4th &amp; King → Mountain View · 8:12 AM</div>
          </div>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
          paddingTop: 10, borderTop: "1px solid #F0F2F5",
        }}>
          <RouteStat label="Trip time" value="64 min" sub="vs 58 min by car" />
          <RouteStat label="CO₂ per round-trip" value="2.4 kg" sub="vs 4.6 kg by car" accent="#3DAB82" />
          <RouteStat label="Monthly save" value="8.8 kg" sub="if used every Friday" accent="#3DAB82" />
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{
        height: 140, borderRadius: 12,
        background: "repeating-linear-gradient(45deg, #F5F7FA, #F5F7FA 8px, #EEF1F5 8px, #EEF1F5 16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11, color: "#94A1B2",
      }}>Map preview · 4th & King → Mountain View</div>
    </div>
  );
}

function RouteStat({ label, value, sub, accent = "#1A2332" }) {
  return (
    <div>
      <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 500, color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>
      <div style={{ marginTop: 4, fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 600, color: accent, letterSpacing: -0.3 }}>{value}</div>
      <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D" }}>{sub}</div>
    </div>
  );
}

function CarpoolMatchesContent() {
  const matches = [
    { name: "Sam Petrov",  initials: "SP", role: "Eng · Same office",      distance: "0.4 km from you", days: "Tue · Wed · Fri", color: "#C7D4E5" },
    { name: "Aisha Khan",  initials: "AK", role: "Design · Same building", distance: "0.9 km from you", days: "Mon · Tue · Wed",  color: "#E8DCC7" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 13.5, color: "#6B7A8D", lineHeight: 1.6 }}>
        These colleagues live close to you and drive on overlapping days. Send them a request — they decide whether to share their schedule back.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {matches.map((m) => (
          <div key={m.name} style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "12px 14px", borderRadius: 12,
            border: "1px solid #F0F2F5", background: "#fff",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: m.color, color: "#1A2332",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, flexShrink: 0,
            }}>{m.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: "#1A2332" }}>{m.name}</div>
              <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D" }}>{m.role} · {m.distance}</div>
              <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#94A1B2" }}>Drives {m.days}</div>
            </div>
            <button style={{
              padding: "8px 14px", borderRadius: 8, border: "none",
              background: "#4A90C4", color: "#fff",
              fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600,
              cursor: "pointer",
            }}>Request</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareMilestoneContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        position: "relative", overflow: "hidden",
        height: 180, borderRadius: 14,
        background: "linear-gradient(135deg, #3DAB82 0%, #8AC9A8 100%)",
        color: "#fff", padding: "22px 24px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: 0.6, textTransform: "uppercase", opacity: 0.9,
        }}>atmos · milestone</div>
        <div>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 28, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.1 }}>
            162 kg this month
          </div>
          <div style={{ marginTop: 6, fontFamily: "Inter, sans-serif", fontSize: 13.5, opacity: 0.85 }}>
            30% below the average San Francisco commuter
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["Copy link", "X (Twitter)", "LinkedIn", "Download image"].map((b, i) => (
          <button key={b} style={{
            flex: 1,
            padding: "9px 10px", borderRadius: 9,
            border: i === 0 ? "none" : "1px solid #F0F2F5",
            background: i === 0 ? "#4A90C4" : "#fff",
            color: i === 0 ? "#fff" : "#1A2332",
            fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 600,
            cursor: "pointer",
          }}>{b}</button>
        ))}
      </div>
    </div>
  );
}

function KeepGoingContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 18px", borderRadius: 12,
        background: "rgba(240,149,106,0.08)",
        border: "1px solid rgba(240,149,106,0.25)",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#F0956A", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="flame" size={24} color="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 600, color: "#1A2332", letterSpacing: -0.2 }}>
            12 days · 2 to go
          </div>
          <div style={{ marginTop: 3, fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7A8D", lineHeight: 1.5 }}>
            Keep logging trips for 2 more days to unlock the <b style={{ color: "#1A2332" }}>Two Weeks Strong</b> badge.
          </div>
        </div>
      </div>
      <div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D", marginBottom: 6,
        }}>
          <span>Streak progress</span>
          <span><span style={{ color: "#1A2332", fontWeight: 600 }}>12</span> / 14 days</span>
        </div>
        <div style={{ height: 8, background: "#F0F2F5", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${(12 / 14) * 100}%`, height: "100%", background: "#F0956A", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

// ---- Achievement badge --------------------------------------------------
function Badge({ a }) {
  const earned = a.earned;
  return (
    <div style={{
      position: "relative",
      background: "#fff",
      borderRadius: 14,
      padding: "16px 14px 14px",
      border: earned ? "1px solid #F0F2F5" : "1px dashed #E5E8EE",
      display: "flex", flexDirection: "column", alignItems: "center",
      textAlign: "center", gap: 6,
      opacity: earned ? 1 : 0.78,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: earned ? `${a.color}1F` : "#F0F2F5",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <Icon name={a.icon} size={22} color={earned ? a.color : "#94A1B2"} strokeWidth={2} />
        {earned && (
          <div style={{
            position: "absolute", bottom: -2, right: -2,
            width: 18, height: 18, borderRadius: "50%",
            background: "#3DAB82", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700,
            border: "2px solid #fff",
            fontFamily: "Inter, sans-serif",
          }}>✓</div>
        )}
      </div>
      <div style={{
        fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
        color: "#1A2332", marginTop: 4,
      }}>{a.name}</div>
      <div style={{
        fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D",
        lineHeight: 1.4,
      }}>{a.desc}</div>
      {earned ? (
        <div style={{
          marginTop: 4,
          fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
          color: a.color, letterSpacing: 0.4, textTransform: "uppercase",
        }}>Earned · {a.date}</div>
      ) : (
        <div style={{ marginTop: 6, width: "100%" }}>
          <div style={{
            height: 4, background: "#F0F2F5", borderRadius: 3, overflow: "hidden",
          }}>
            <div style={{
              width: `${Math.min(100, (a.progress / a.target) * 100)}%`,
              height: "100%", background: a.color, borderRadius: 3,
            }} />
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: "Inter, sans-serif", fontSize: 10.5, color: "#6B7A8D",
          }}>{a.progress} / {a.target}</div>
        </div>
      )}
    </div>
  );
}

// ---- Page ---------------------------------------------------------------
function InsightsPage() {
  const [filter, setFilter] = useStateI("all");
  const [range, setRange] = useStateI("This month");
  const [dismissed, setDismissed] = useStateI([]);
  const [modal, setModal] = useStateI(null); // { kind: "route" | "carpool" | "share" | "streak" }
  const [toast, setToast] = useStateI(null);

  const handleAction = (label, ins) => {
    if (label === "See trips") {
      window.location.href = "Trips.html?mode=car";
      return;
    }
    if (label === "See breakdown") {
      window.location.href = "Analytics.html#mom";
      return;
    }
    if (label === "Show route")       { setModal({ kind: "route", ins }); return; }
    if (label === "Find matches")     { setModal({ kind: "carpool", ins }); return; }
    if (label === "Share milestone")  { setModal({ kind: "share", ins }); return; }
    if (label === "Keep going")       { setModal({ kind: "streak", ins }); return; }
    // Dismiss-style actions
    if (["Dismiss", "Got it", "Not interested"].includes(label)) {
      setDismissed((d) => [...d, ins.id]);
      setToast(`Hidden · "${ins.title}"`);
      setTimeout(() => setToast(null), 2200);
      return;
    }
  };

  const filters = [
    { id: "all",        label: "All",         count: ALL_INSIGHTS.length },
    { id: "TIP",        label: "Tips",        count: ALL_INSIGHTS.filter(i => i.type === "TIP").length, color: "#3DAB82" },
    { id: "ANOMALY",    label: "Anomalies",   count: ALL_INSIGHTS.filter(i => i.type === "ANOMALY").length, color: "#F0956A" },
    { id: "STREAK",     label: "Streaks",     count: ALL_INSIGHTS.filter(i => i.type === "STREAK").length, color: "#4A90C4" },
    { id: "MILESTONE",  label: "Milestones",  count: ALL_INSIGHTS.filter(i => i.type === "MILESTONE").length, color: "#4A90C4" },
    { id: "COMPARISON", label: "Comparisons", count: ALL_INSIGHTS.filter(i => i.type === "COMPARISON").length, color: "#7BA9D4" },
    { id: "CONTEXT",    label: "Context",     count: ALL_INSIGHTS.filter(i => i.type === "CONTEXT").length, color: "#8AC9A8" },
  ];

  const filtered = useMemoI(() => {
    const base = ALL_INSIGHTS.filter(i => !dismissed.includes(i.id));
    return filter === "all" ? base : base.filter(i => i.type === filter);
  }, [filter, dismissed]);

  const earnedCount = ACHIEVEMENTS.filter(a => a.earned).length;

  return (
    <PageShell
      active="insights"
      title="Insights"
      subtitle="What Atmos noticed in your trip patterns this period."
      range={range} setRange={setRange}
    >
      <FeaturedHero />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)", gap: 20 }}>
        {/* LEFT: filter + feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Filter chips */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {filters.map(f => {
                const active = filter === f.id;
                const c = f.color || "#1A2332";
                return (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "7px 12px", borderRadius: 999,
                      border: active ? `1px solid ${c}` : "1px solid #F0F2F5",
                      background: active ? `${c}14` : "#fff",
                      color: active ? c : "#1A2332",
                      fontFamily: "Inter, sans-serif", fontSize: 12.5,
                      fontWeight: active ? 600 : 500, cursor: "pointer",
                    }}>
                    {f.label}
                    <span style={{ fontWeight: 500, color: active ? c : "#6B7A8D", opacity: active ? 0.8 : 1 }}>{f.count}</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D", fontWeight: 500,
              }}>{INSIGHT_STATS.newCount} new</span>
              <button style={{
                padding: "7px 12px", borderRadius: 9, border: "1px solid #F0F2F5",
                background: "#fff", color: "#1A2332",
                fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500,
                cursor: "pointer",
              }}>Mark all read</button>
            </div>
          </div>

          {/* Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.length === 0 ? (
              <div style={{
                background: "#fff", borderRadius: 14, padding: "40px 20px",
                textAlign: "center",
                fontFamily: "Inter, sans-serif", color: "#6B7A8D",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#1A2332" }}>No insights of this type yet</div>
                <div style={{ marginTop: 4, fontSize: 12.5 }}>Keep tracking — new insights generate weekly.</div>
              </div>
            ) : (
              filtered.map(ins => <InsightCard key={ins.id} ins={ins} onAction={handleAction} />)
            )}
          </div>
        </div>

        {/* RIGHT: stats + achievements */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Activity" subtitle="Your engagement with insights">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <SidebarStat label="Total" value={INSIGHT_STATS.total} accent="#4A90C4" />
              <SidebarStat label="New this week" value={INSIGHT_STATS.newCount} accent="#F0956A" />
              <SidebarStat label="Actions taken" value={INSIGHT_STATS.acted} accent="#3DAB82" />
              <SidebarStat label="Potential save" value={`${INSIGHT_STATS.potentialSave} kg`} accent="#8AC9A8" small />
            </div>
          </Card>

          <Card
            title="Achievements"
            subtitle={`${earnedCount} of ${ACHIEVEMENTS.length} earned`}
            action={
              <button onClick={(e) => e.preventDefault()} style={{
                background: "transparent", border: "none", padding: 0,
                fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
                color: "#4A90C4", cursor: "pointer",
              }}>See all</button>
            }
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ACHIEVEMENTS.map(a => <Badge key={a.id} a={a} />)}
            </div>
          </Card>
        </div>
      </div>

      {/* Action modals */}
      <Modal
        open={!!modal && modal.kind === "route"}
        onClose={() => setModal(null)}
        eyebrow="TIP · Try the train"
        eyebrowColor="#3DAB82"
        title="The 8:12 Caltrain from 4th & King"
        footer={
          <>
            <button onClick={() => setModal(null)} style={ghostBtn}>Not now</button>
            <button onClick={() => setModal(null)} style={primaryBtn}>Add to my routine</button>
          </>
        }
      ><ShowRouteContent /></Modal>

      <Modal
        open={!!modal && modal.kind === "carpool"}
        onClose={() => setModal(null)}
        eyebrow="TIP · Carpool matches"
        eyebrowColor="#3DAB82"
        title="2 colleagues match your schedule"
        footer={
          <>
            <button onClick={() => setModal(null)} style={ghostBtn}>Close</button>
            <button onClick={() => setModal(null)} style={primaryBtn}>Send all requests</button>
          </>
        }
      ><CarpoolMatchesContent /></Modal>

      <Modal
        open={!!modal && modal.kind === "share"}
        onClose={() => setModal(null)}
        eyebrow="CONTEXT · Share milestone"
        eyebrowColor="#8AC9A8"
        title="Share your impact"
        width={460}
      ><ShareMilestoneContent /></Modal>

      <Modal
        open={!!modal && modal.kind === "streak"}
        onClose={() => setModal(null)}
        eyebrow="STREAK · Keep going"
        eyebrowColor="#4A90C4"
        title="Two days from your next badge"
        width={460}
        footer={
          <>
            <button onClick={() => setModal(null)} style={ghostBtn}>Maybe later</button>
            <button onClick={() => setModal(null)} style={primaryBtn}>Remind me tomorrow</button>
          </>
        }
      ><KeepGoingContent /></Modal>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%",
          transform: "translateX(-50%)",
          background: "#1A2332", color: "#fff",
          padding: "10px 16px", borderRadius: 999,
          boxShadow: "0 6px 22px rgba(26,35,50,0.25)",
          fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500,
          zIndex: 200,
          animation: "atmosToastIn 0.18s ease-out",
        }}>{toast}</div>
      )}
      <style>{`
        @keyframes atmosToastIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </PageShell>
  );
}

const primaryBtn = {
  padding: "9px 16px", borderRadius: 9, border: "none",
  background: "#4A90C4", color: "#fff",
  fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
  cursor: "pointer",
};
const ghostBtn = {
  padding: "9px 16px", borderRadius: 9, border: "1px solid #E5E8EE",
  background: "#fff", color: "#1A2332",
  fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
  cursor: "pointer",
};

function SidebarStat({ label, value, accent, small }) {
  return (
    <div style={{
      background: "#FAFBFC", borderRadius: 10,
      padding: "12px 14px",
      borderLeft: `3px solid ${accent}`,
    }}>
      <div style={{
        fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
        color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
      }}>{label}</div>
      <div style={{
        marginTop: 4,
        fontFamily: "Inter, sans-serif", fontSize: small ? 18 : 22, fontWeight: 600,
        color: "#1A2332", letterSpacing: -0.3, lineHeight: 1,
      }}>{value}</div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<InsightsPage />);
