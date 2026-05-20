// Analytics-page mock data. Loaded separately so Dashboard/Trips don't pay for it.

// ---- 30 days of daily kg ------------------------------------------------
// Synthetic but realistic — commute pattern, weekend dips, one anomaly.
const _seed = (i) => Math.sin(i * 12.9898) * 43758.5453;
const _rand = (i) => (_seed(i) - Math.floor(_seed(i)));

function buildDays(offsetMonths, label) {
  const days = [];
  for (let i = 0; i < 30; i++) {
    const dow = (i + (offsetMonths ? 1 : 4)) % 7; // shift so weekends differ
    const isWeekend = dow === 0 || dow === 6;
    const base = isWeekend ? 2.0 : 5.2;
    const jitter = (_rand(i * 7 + offsetMonths * 31) - 0.5) * 3.5;
    let kg = Math.max(0.4, base + jitter);
    if (!offsetMonths && i === 16) kg = 9.4; // Friday anomaly current month
    if (offsetMonths && i === 22) kg = 8.7;  // last month anomaly
    days.push({
      day: i + 1,
      label: `${label} ${i + 1}`,
      kg: Math.round(kg * 10) / 10,
      weekend: isWeekend,
      dow,
    });
  }
  return days;
}

const DAILY_30 = buildDays(0, "May");          // current month so far
const DAILY_30_PREV = buildDays(1, "Apr");     // last month

// ---- Month-over-month (by week) -----------------------------------------
// 4 weeks of totals
function weekTotals(days) {
  const out = [];
  for (let w = 0; w < 4; w++) {
    const slice = days.slice(w * 7, w * 7 + 7);
    out.push(Math.round(slice.reduce((s, d) => s + d.kg, 0) * 10) / 10);
  }
  return out;
}
const MOM_WEEKS = [
  { label: "Week 1", curr: weekTotals(DAILY_30)[0], prev: weekTotals(DAILY_30_PREV)[0] },
  { label: "Week 2", curr: weekTotals(DAILY_30)[1], prev: weekTotals(DAILY_30_PREV)[1] },
  { label: "Week 3", curr: weekTotals(DAILY_30)[2], prev: weekTotals(DAILY_30_PREV)[2] },
  { label: "Week 4", curr: weekTotals(DAILY_30)[3], prev: weekTotals(DAILY_30_PREV)[3] },
];

// ---- Weekly mode mix (stacked over 8 weeks) -----------------------------
// kg per mode per week — synthetic
const MODE_WEEKS = [
  { label: "W1", car: 24.4, train: 5.1, bus: 3.2, bike: 0, walk: 0 },
  { label: "W2", car: 22.1, train: 6.4, bus: 4.1, bike: 0, walk: 0 },
  { label: "W3", car: 28.8, train: 4.0, bus: 5.0, bike: 0, walk: 0 },
  { label: "W4", car: 26.3, train: 7.2, bus: 2.8, bike: 0, walk: 0 },
  { label: "W5", car: 31.2, train: 6.8, bus: 3.4, bike: 0, walk: 0 },
  { label: "W6", car: 18.9, train: 9.4, bus: 6.1, bike: 0, walk: 0 },
  { label: "W7", car: 22.4, train: 8.2, bus: 4.6, bike: 0, walk: 0 },
  { label: "W8", car: 14.6, train: 11.1, bus: 5.8, bike: 0, walk: 0 },
];

// ---- Weekday averages ---------------------------------------------------
const WEEKDAY_AVG = [
  { day: "Mon", kg: 5.2, trips: 3.2 },
  { day: "Tue", kg: 5.8, trips: 3.4 },
  { day: "Wed", kg: 4.6, trips: 3.0 },
  { day: "Thu", kg: 5.4, trips: 3.3 },
  { day: "Fri", kg: 7.2, trips: 3.8 },
  { day: "Sat", kg: 2.8, trips: 2.1 },
  { day: "Sun", kg: 2.1, trips: 1.8 },
];

// ---- Top recurring routes ----------------------------------------------
const TOP_ROUTES = [
  { id: 1, from: "Home",        to: "Office",      mode: "car",   count: 18, kg: 50.4, km: 223.2 },
  { id: 2, from: "Office",      to: "Home",        mode: "car",   count: 17, kg: 47.6, km: 210.8 },
  { id: 3, from: "Home",        to: "Office",      mode: "bike",  count: 6,  kg: 0.0,  km: 22.8  },
  { id: 4, from: "Mission St",  to: "Civic Center",mode: "train", count: 8,  kg: 4.0,  km: 71.2  },
  { id: 5, from: "Office",      to: "Lunch · Mira's", mode: "bike", count: 5,  kg: 0.0, km: 10.5  },
];

// ---- Analytics summary --------------------------------------------------
const ANALYTICS_STATS = (() => {
  const curr = DAILY_30.reduce((s, d) => s + d.kg, 0);
  const prev = DAILY_30_PREV.reduce((s, d) => s + d.kg, 0);
  const best = DAILY_30.reduce((a, b) => b.kg < a.kg ? b : a);
  const worst = DAILY_30.reduce((a, b) => b.kg > a.kg ? b : a);
  const goalHits = DAILY_30.filter(d => d.kg <= 5.0).length;
  return {
    curr: Math.round(curr * 10) / 10,
    prev: Math.round(prev * 10) / 10,
    trend: Math.round(((curr - prev) / prev) * 1000) / 10, // %, signed
    best,
    worst,
    goalHitRate: Math.round((goalHits / DAILY_30.length) * 100),
    goalHitDays: goalHits,
    totalDays: DAILY_30.length,
  };
})();

window.AtmosAnalytics = {
  DAILY_30, DAILY_30_PREV,
  MOM_WEEKS, MODE_WEEKS,
  WEEKDAY_AVG, TOP_ROUTES,
  ANALYTICS_STATS,
};
