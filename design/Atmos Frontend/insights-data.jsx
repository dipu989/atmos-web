// Insights, achievements, milestones for the Insights page

// Featured weekly insight (hero)
const FEATURED_INSIGHT = {
  type: "WEEKLY DIGEST",
  color: "#4A90C4",
  title: "Your week, in one breath",
  body: "You logged 33.5 kg CO₂ across 21 trips this week — 8% lower than your last weekly average. Most of the saving came from biking to the office twice instead of driving.",
  metric: {
    primary: "33.5 kg",
    sub: "21 trips · 7 days",
    delta: -8,
  },
  spark: [4.2, 6.8, 3.1, 5.4, 7.9, 2.3, 3.8],
};

// Extended insight feed
const ALL_INSIGHTS = [
  {
    id: 1, type: "ANOMALY", color: "#F0956A", icon: "alert",
    date: "2 days ago", new: true,
    title: "Unusual spike on Friday",
    body: "7.9 kg CO₂ on May 16 — 58% above your weekly average. Two longer car trips (Home → SFO Airport and SFO → Home, 24.2 km each) contributed most.",
    spark: [4.2, 6.8, 3.1, 5.4, 7.9, 2.3, 3.8],
    sparkHighlight: 4,
    actions: ["See trips", "Dismiss"],
  },
  {
    id: 2, type: "TIP", color: "#3DAB82", icon: "lightbulb",
    date: "3 days ago", new: true,
    title: "Try the train on Fridays",
    body: "Your Friday commute is 40% higher than your weekday average. Caltrain at 8:12 AM from 4th & King would cut roughly 2.2 kg per round-trip.",
    impact: "Potential save: 8.8 kg/month",
    actions: ["Show route", "Got it"],
  },
  {
    id: 3, type: "STREAK", color: "#4A90C4", icon: "flame",
    date: "Today", new: false,
    title: "12-day tracking streak",
    body: "You've logged trips every day for nearly two weeks — your longest streak yet. Two more days unlocks the 14-day badge.",
    progress: { current: 12, target: 14, label: "Streak goal" },
    actions: ["Keep going"],
  },
  {
    id: 4, type: "COMPARISON", color: "#7BA9D4", icon: "analytics",
    date: "1 week ago", new: false,
    title: "Down 8.3% vs last month",
    body: "You're trending lower than April — 162.4 kg this month so far versus 177.2 kg same time last month. Train trips up 27%, car trips down 14%.",
    actions: ["See breakdown"],
  },
  {
    id: 5, type: "TIP", color: "#3DAB82", icon: "lightbulb",
    date: "1 week ago", new: false,
    title: "Carpooling on Tuesdays could save 4 kg/week",
    body: "Two of your colleagues live within 1 km of your home and drive similar hours. Atmos could match you for shared rides on Tue/Wed.",
    impact: "Potential save: 16 kg/month",
    actions: ["Find matches", "Not interested"],
  },
  {
    id: 6, type: "MILESTONE", color: "#4A90C4", icon: "target",
    date: "2 weeks ago", new: false,
    title: "87 days tracked total",
    body: "You crossed the 12-week mark since you started tracking on Feb 21. Your overall daily average has dropped from 6.4 kg to 4.8 kg.",
    actions: [],
  },
  {
    id: 7, type: "CONTEXT", color: "#8AC9A8", icon: "leaf",
    date: "3 weeks ago", new: false,
    title: "30% below SF commuter average",
    body: "An average SF commuter logs around 234 kg CO₂ per month. Your 162 kg puts you in the bottom third — keep going.",
    actions: ["Share milestone"],
  },
];

// Achievements grid
const ACHIEVEMENTS = [
  { id: 1, name: "First Trip",       desc: "Logged your first trip",       icon: "leaf",     color: "#3DAB82", earned: true,  date: "Feb 21" },
  { id: 2, name: "Week Warrior",     desc: "7-day tracking streak",         icon: "flame",    color: "#F0956A", earned: true,  date: "Mar 4"  },
  { id: 3, name: "Pedal Power",      desc: "10 bike trips logged",          icon: "bike",     color: "#3DAB82", earned: true,  date: "Apr 12" },
  { id: 4, name: "Train Convert",    desc: "20 train trips logged",         icon: "train",    color: "#4A90C4", earned: true,  date: "Apr 28" },
  { id: 5, name: "Two Weeks Strong", desc: "14-day tracking streak",        icon: "flame",    color: "#F0956A", earned: false, progress: 12, target: 14 },
  { id: 6, name: "Carbon Saver",     desc: "Cut emissions by 10% MoM",      icon: "arrow-down", color: "#3DAB82", earned: false, progress: 8.3, target: 10 },
  { id: 7, name: "Century Club",     desc: "100 trips logged",              icon: "target",   color: "#4A90C4", earned: false, progress: 28, target: 100 },
  { id: 8, name: "Goal Crusher",     desc: "Hit goal 30 days in a row",     icon: "target",   color: "#3DAB82", earned: false, progress: 12, target: 30 },
];

// Summary stats
const INSIGHT_STATS = {
  total: ALL_INSIGHTS.length,
  newCount: ALL_INSIGHTS.filter(i => i.new).length,
  acted: 14,
  potentialSave: 24.8, // kg/month if all tips applied
};

window.AtmosInsightsData = {
  FEATURED_INSIGHT, ALL_INSIGHTS, ACHIEVEMENTS, INSIGHT_STATS,
};
