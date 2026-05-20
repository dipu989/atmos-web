// Mock data for Atmos

// ---- WEEKLY TREND (dashboard line chart) --------------------------------
const WEEKLY_DATA = [
  { day: "Mon", date: "May 12", kg: 4.2 },
  { day: "Tue", date: "May 13", kg: 6.8 },
  { day: "Wed", date: "May 14", kg: 3.1 },
  { day: "Thu", date: "May 15", kg: 5.4 },
  { day: "Fri", date: "May 16", kg: 7.9 },
  { day: "Sat", date: "May 17", kg: 2.3 },
  { day: "Sun", date: "May 18", kg: 3.8 },
];

const DAILY_GOAL = 5.0;

// ---- TRANSPORT MODES ----------------------------------------------------
const TRANSPORT_MODES = [
  { id: "car",    name: "Car",       kg: 38.4, km: 142, color: "#F0956A", icon: "car" },
  { id: "train",  name: "Train",     kg: 12.1, km: 218, color: "#4A90C4", icon: "train" },
  { id: "bus",    name: "Bus",       kg: 8.6,  km: 94,  color: "#7BA9D4", icon: "bus" },
  { id: "bike",   name: "Bike",      kg: 0.0,  km: 47,  color: "#3DAB82", icon: "bike" },
  { id: "walk",   name: "Walk",      kg: 0.0,  km: 18,  color: "#8AC9A8", icon: "walk" },
];

// ---- TRIPS --------------------------------------------------------------
// Recent 5 trips shown on the dashboard
const RECENT_TRIPS = [
  { id: 1, mode: "car",   from: "Home",            to: "Office",          datetime: "Today, 8:42 AM",      km: 12.4, kg: 2.8, source: "auto" },
  { id: 2, mode: "bike",  from: "Office",          to: "Lunch · Mira's",  datetime: "Today, 12:15 PM",     km: 2.1,  kg: 0.0, source: "auto" },
  { id: 3, mode: "train", from: "Mission St",      to: "Civic Center",    datetime: "Yesterday, 6:18 PM",  km: 8.9,  kg: 0.5, source: "auto" },
  { id: 4, mode: "car",   from: "Home",            to: "Whole Foods",     datetime: "Yesterday, 4:02 PM",  km: 6.7,  kg: 1.5, source: "manual" },
  { id: 5, mode: "bus",   from: "Bart · Powell",   to: "Pier 39",         datetime: "May 16, 7:30 PM",     km: 4.3,  kg: 0.4, source: "auto" },
];

// Full trip history — used by Trips page. dateISO included for sorting.
const ALL_TRIPS = [
  { id: 1,  mode: "car",   from: "Home",          to: "Office",         dateISO: "2026-05-18T08:42", datetime: "Today, 8:42 AM",       km: 12.4, kg: 2.8, source: "auto",   duration: 28 },
  { id: 2,  mode: "bike",  from: "Office",        to: "Lunch · Mira's", dateISO: "2026-05-18T12:15", datetime: "Today, 12:15 PM",      km:  2.1, kg: 0.0, source: "auto",   duration: 9  },
  { id: 3,  mode: "bike",  from: "Lunch · Mira's",to: "Office",         dateISO: "2026-05-18T13:08", datetime: "Today, 1:08 PM",       km:  2.1, kg: 0.0, source: "auto",   duration: 8  },
  { id: 4,  mode: "car",   from: "Office",        to: "Home",           dateISO: "2026-05-18T18:21", datetime: "Today, 6:21 PM",       km: 12.4, kg: 2.8, source: "auto",   duration: 32 },
  { id: 5,  mode: "train", from: "Mission St",    to: "Civic Center",   dateISO: "2026-05-17T18:18", datetime: "Yesterday, 6:18 PM",   km:  8.9, kg: 0.5, source: "auto",   duration: 14 },
  { id: 6,  mode: "walk",  from: "Civic Center",  to: "Hayes Valley",   dateISO: "2026-05-17T18:42", datetime: "Yesterday, 6:42 PM",   km:  1.4, kg: 0.0, source: "auto",   duration: 17 },
  { id: 7,  mode: "car",   from: "Home",          to: "Whole Foods",    dateISO: "2026-05-17T16:02", datetime: "Yesterday, 4:02 PM",   km:  6.7, kg: 1.5, source: "manual", duration: 18 },
  { id: 8,  mode: "car",   from: "Whole Foods",   to: "Home",           dateISO: "2026-05-17T17:11", datetime: "Yesterday, 5:11 PM",   km:  6.7, kg: 1.5, source: "auto",   duration: 21 },
  { id: 9,  mode: "bus",   from: "Bart · Powell", to: "Pier 39",        dateISO: "2026-05-16T19:30", datetime: "May 16, 7:30 PM",      km:  4.3, kg: 0.4, source: "auto",   duration: 22 },
  { id: 10, mode: "car",   from: "Home",          to: "SFO Airport",    dateISO: "2026-05-16T05:48", datetime: "May 16, 5:48 AM",      km: 24.2, kg: 5.4, source: "auto",   duration: 38 },
  { id: 11, mode: "train", from: "SFO BART",      to: "Embarcadero",    dateISO: "2026-05-16T07:22", datetime: "May 16, 7:22 AM",      km: 21.3, kg: 1.2, source: "auto",   duration: 32 },
  { id: 12, mode: "car",   from: "Office",        to: "Home",           dateISO: "2026-05-15T19:04", datetime: "May 15, 7:04 PM",      km: 12.4, kg: 2.8, source: "auto",   duration: 35 },
  { id: 13, mode: "train", from: "Caltrain · 4th",to: "Mountain View",  dateISO: "2026-05-15T13:10", datetime: "May 15, 1:10 PM",      km: 56.0, kg: 3.1, source: "auto",   duration: 64 },
  { id: 14, mode: "bike",  from: "Home",          to: "Office",         dateISO: "2026-05-15T08:11", datetime: "May 15, 8:11 AM",      km:  3.8, kg: 0.0, source: "auto",   duration: 17 },
  { id: 15, mode: "car",   from: "Home",          to: "Costco",         dateISO: "2026-05-14T11:32", datetime: "May 14, 11:32 AM",     km: 14.6, kg: 3.3, source: "manual", duration: 27 },
  { id: 16, mode: "bus",   from: "Geary & 6th",   to: "Sunset Blvd",    dateISO: "2026-05-14T16:48", datetime: "May 14, 4:48 PM",      km:  7.2, kg: 0.7, source: "auto",   duration: 31 },
  { id: 17, mode: "walk",  from: "Office",        to: "Coffee · Sextant",dateISO: "2026-05-14T10:02", datetime: "May 14, 10:02 AM",    km:  0.6, kg: 0.0, source: "auto",   duration: 8  },
  { id: 18, mode: "train", from: "Mission St",    to: "Civic Center",   dateISO: "2026-05-13T18:11", datetime: "May 13, 6:11 PM",      km:  8.9, kg: 0.5, source: "auto",   duration: 15 },
  { id: 19, mode: "car",   from: "Home",          to: "Dentist · Polk", dateISO: "2026-05-13T14:30", datetime: "May 13, 2:30 PM",      km:  5.4, kg: 1.2, source: "auto",   duration: 14 },
  { id: 20, mode: "bike",  from: "Office",        to: "Home",           dateISO: "2026-05-12T18:55", datetime: "May 12, 6:55 PM",      km:  3.8, kg: 0.0, source: "auto",   duration: 18 },
  { id: 21, mode: "bike",  from: "Home",          to: "Office",         dateISO: "2026-05-12T08:18", datetime: "May 12, 8:18 AM",      km:  3.8, kg: 0.0, source: "auto",   duration: 17 },
  { id: 22, mode: "car",   from: "Office",        to: "Gym · Marina",   dateISO: "2026-05-11T19:02", datetime: "May 11, 7:02 PM",      km:  8.1, kg: 1.8, source: "manual", duration: 22 },
  { id: 23, mode: "train", from: "Civic Center",  to: "Mission St",     dateISO: "2026-05-11T08:58", datetime: "May 11, 8:58 AM",      km:  8.9, kg: 0.5, source: "auto",   duration: 13 },
  { id: 24, mode: "walk",  from: "Mission St",    to: "Office",         dateISO: "2026-05-11T09:14", datetime: "May 11, 9:14 AM",      km:  0.8, kg: 0.0, source: "auto",   duration: 10 },
  { id: 25, mode: "car",   from: "Home",          to: "Stinson Beach",  dateISO: "2026-05-10T09:40", datetime: "May 10, 9:40 AM",      km: 38.7, kg: 8.7, source: "auto",   duration: 72 },
  { id: 26, mode: "car",   from: "Stinson Beach", to: "Home",           dateISO: "2026-05-10T17:22", datetime: "May 10, 5:22 PM",      km: 38.7, kg: 8.7, source: "auto",   duration: 81 },
  { id: 27, mode: "bus",   from: "Lombard & Van Ness", to: "Marina",    dateISO: "2026-05-09T14:20", datetime: "May 9, 2:20 PM",       km:  3.4, kg: 0.3, source: "auto",   duration: 16 },
  { id: 28, mode: "bike",  from: "Home",          to: "Farmers Market", dateISO: "2026-05-09T09:11", datetime: "May 9, 9:11 AM",       km:  2.6, kg: 0.0, source: "auto",   duration: 11 },
];

// ---- INSIGHTS -----------------------------------------------------------
const INSIGHTS = [
  {
    id: 1, type: "STREAK", color: "#4A90C4", icon: "flame",
    title: "12-day tracking streak",
    body: "You've logged trips every day for nearly two weeks — your longest streak yet.",
  },
  {
    id: 2, type: "TIP", color: "#3DAB82", icon: "lightbulb",
    title: "Try the train on Fridays",
    body: "Your Friday commute is 40% higher than weekday average. The 8:12 Caltrain would cut it in half.",
  },
  {
    id: 3, type: "ANOMALY", color: "#F0956A", icon: "alert",
    title: "Unusual spike on Friday",
    body: "7.9 kg CO₂ on May 16 — 58% above your weekly average. Two longer car trips contributed most.",
  },
];

// ---- STATS --------------------------------------------------------------
const STATS = {
  monthlyCO2: 162.4,
  monthlyTrend: -8.3,
  todayKg: 2.8,
  goalKg: DAILY_GOAL,
  streak: 12,
  daysTracked: 87,
};

// Aggregate stats for Trips page
const TRIP_STATS = {
  totalTrips: ALL_TRIPS.length,
  totalKm: ALL_TRIPS.reduce((s, t) => s + t.km, 0),
  totalKg: ALL_TRIPS.reduce((s, t) => s + t.kg, 0),
  avgKm: ALL_TRIPS.reduce((s, t) => s + t.km, 0) / ALL_TRIPS.length,
  avgKg: ALL_TRIPS.reduce((s, t) => s + t.kg, 0) / ALL_TRIPS.length,
  autoCount: ALL_TRIPS.filter(t => t.source === "auto").length,
  manualCount: ALL_TRIPS.filter(t => t.source === "manual").length,
};

window.AtmosData = {
  WEEKLY_DATA, DAILY_GOAL, TRANSPORT_MODES,
  RECENT_TRIPS, ALL_TRIPS,
  INSIGHTS, STATS, TRIP_STATS,
};
