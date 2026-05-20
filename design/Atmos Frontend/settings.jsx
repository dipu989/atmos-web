// Atmos — Settings page

const { useState: useStateSet } = React;
const { Sidebar, Header } = window.AtmosShared;
const {
  SettingsSection, FormRow, TextInput, Select, Toggle, Segmented, Slider, Checkbox, Button,
} = window.AtmosForms;

// ---- Sub-nav ------------------------------------------------------------
const SUB_NAV = [
  { id: "profile",       label: "Profile",          icon: "user" },
  { id: "goals",         label: "Goals & tracking", icon: "target" },
  { id: "notifications", label: "Notifications",    icon: "bell" },
  { id: "privacy",       label: "Privacy & data",   icon: "shield" },
  { id: "connections",   label: "Connected apps",   icon: "plug" },
  { id: "billing",       label: "Plan & billing",   icon: "credit-card" },
  { id: "account",       label: "Account",          icon: "lock" },
];

function SubNav({ active, setActive }) {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {SUB_NAV.map(it => {
        const isActive = it.id === active;
        return (
          <button key={it.id} onClick={() => setActive(it.id)}
            style={{
              display: "flex", alignItems: "center", gap: 11,
              padding: "9px 12px",
              background: isActive ? "rgba(74,144,196,0.10)" : "transparent",
              color: isActive ? "#4A90C4" : "#6B7A8D",
              border: "none", borderRadius: 9, cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontSize: 13.5,
              fontWeight: isActive ? 600 : 500, textAlign: "left",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F5F7FA"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            <Icon name={it.icon} size={17} color={isActive ? "#4A90C4" : "#6B7A8D"} />
            {it.label}
          </button>
        );
      })}
    </nav>
  );
}

// ---- PROFILE ------------------------------------------------------------
function ProfileSection() {
  const [name, setName] = useStateSet("Maya Okafor");
  const [email, setEmail] = useStateSet("maya@okafor.studio");
  const [city, setCity] = useStateSet("San Francisco");
  const [tz, setTz] = useStateSet("America/Los_Angeles");
  const [unit, setUnit] = useStateSet("km");

  return (
    <SettingsSection
      title="Profile"
      description="How Atmos refers to you and where it expects you to be."
      footer={<><Button variant="secondary">Cancel</Button><Button variant="primary">Save changes</Button></>}
    >
      <FormRow label="Photo" hint="JPG or PNG, max 2 MB.">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "#E8DCC7", color: "#5A4A2A",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 22,
          }}>MO</div>
          <Button variant="secondary" size="sm">Upload new</Button>
          <Button variant="ghost" size="sm">Remove</Button>
        </div>
      </FormRow>

      <FormRow label="Full name">
        <TextInput value={name} onChange={setName} />
      </FormRow>

      <FormRow label="Email" hint="Used for sign-in and your weekly digest.">
        <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 460 }}>
          <TextInput value={email} onChange={setEmail} type="email" />
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 8px", borderRadius: 999,
            background: "rgba(61,171,130,0.10)", color: "#3DAB82",
            fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
            letterSpacing: 0.3, textTransform: "uppercase",
          }}>
            <Icon name="check" size={11} color="#3DAB82" strokeWidth={2.4} />
            Verified
          </span>
        </div>
      </FormRow>

      <FormRow label="City">
        <TextInput value={city} onChange={setCity} />
      </FormRow>

      <FormRow label="Time zone">
        <Select value={tz} onChange={setTz}
          options={[
            { value: "America/Los_Angeles", label: "Pacific — Los Angeles" },
            { value: "America/Denver",      label: "Mountain — Denver" },
            { value: "America/Chicago",     label: "Central — Chicago" },
            { value: "America/New_York",    label: "Eastern — New York" },
            { value: "Europe/London",       label: "GMT — London" },
          ]} />
      </FormRow>

      <FormRow label="Distance unit" divider={false}>
        <Segmented value={unit} onChange={setUnit}
          options={[{ value: "km", label: "Kilometres" }, { value: "mi", label: "Miles" }]} />
      </FormRow>
    </SettingsSection>
  );
}

// ---- GOALS --------------------------------------------------------------
function GoalsSection() {
  const [daily, setDaily] = useStateSet(5.0);
  const [monthly, setMonthly] = useStateSet(150);
  const [autoDetect, setAutoDetect] = useStateSet(true);
  const [sensitivity, setSensitivity] = useStateSet("balanced");
  const [minDist, setMinDist] = useStateSet(0.5);
  const [modes, setModes] = useStateSet({ car: true, train: true, bus: true, bike: true, walk: true, flight: false });

  return (
    <SettingsSection
      title="Goals & tracking"
      description="Set the targets Atmos compares you against and tune how trips are auto-detected."
      footer={<><Button variant="secondary">Reset to defaults</Button><Button variant="primary">Save changes</Button></>}
    >
      <FormRow label="Daily CO₂ goal" hint="Atmos compares each day's emissions to this target.">
        <Slider value={daily} onChange={setDaily} min={1} max={15} step={0.5} unit=" kg" />
      </FormRow>

      <FormRow label="Monthly CO₂ goal" hint="Used for the trend on your dashboard.">
        <Slider value={monthly} onChange={setMonthly} min={30} max={400} step={10} unit=" kg" accent="#3DAB82" />
      </FormRow>

      <FormRow label="Auto-detect trips" hint="Use motion, location, and connected apps to log trips automatically.">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Toggle value={autoDetect} onChange={setAutoDetect} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: autoDetect ? "#1A2332" : "#6B7A8D", fontWeight: 500 }}>
            {autoDetect ? "On" : "Off — log trips manually only"}
          </span>
        </div>
      </FormRow>

      <FormRow label="Detection sensitivity" hint="Conservative misses short trips; Aggressive may double-log.">
        <Segmented value={sensitivity} onChange={setSensitivity}
          options={[
            { value: "conservative", label: "Conservative" },
            { value: "balanced",     label: "Balanced" },
            { value: "aggressive",   label: "Aggressive" },
          ]} />
      </FormRow>

      <FormRow label="Minimum trip distance" hint="Trips shorter than this won't be logged.">
        <Slider value={minDist} onChange={setMinDist} min={0.1} max={3.0} step={0.1} unit=" km" />
      </FormRow>

      <FormRow label="Tracked modes" hint="Modes Atmos will detect and include in totals." divider={false}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 520 }}>
          <Checkbox value={modes.car}    onChange={(v) => setModes({ ...modes, car: v })}    icon="car"   iconColor="#F0956A" label="Car"     hint="Petrol, diesel, hybrid" />
          <Checkbox value={modes.train}  onChange={(v) => setModes({ ...modes, train: v })}  icon="train" iconColor="#4A90C4" label="Train"   hint="BART, Caltrain, MUNI rail" />
          <Checkbox value={modes.bus}    onChange={(v) => setModes({ ...modes, bus: v })}    icon="bus"   iconColor="#7BA9D4" label="Bus"     hint="MUNI, AC Transit" />
          <Checkbox value={modes.bike}   onChange={(v) => setModes({ ...modes, bike: v })}   icon="bike"  iconColor="#3DAB82" label="Bike"    hint="Personal or rideshare" />
          <Checkbox value={modes.walk}   onChange={(v) => setModes({ ...modes, walk: v })}   icon="walk"  iconColor="#8AC9A8" label="Walk"    hint="Counts as zero-emission" />
          <Checkbox value={modes.flight} onChange={(v) => setModes({ ...modes, flight: v })} icon="trips" iconColor="#E05252" label="Flight"  hint="Via calendar integration" />
        </div>
      </FormRow>
    </SettingsSection>
  );
}

// ---- NOTIFICATIONS ------------------------------------------------------
function NotificationsSection() {
  const [prefs, setPrefs] = useStateSet({
    digest:  { email: true,  push: false, label: "Weekly digest",      desc: "Sunday evening summary of your week." },
    anomaly: { email: false, push: true,  label: "Anomaly alerts",     desc: "When a day's emissions jump unexpectedly." },
    tip:     { email: true,  push: true,  label: "Tips",                desc: "Suggestions for cleaner trips, generated weekly." },
    streak:  { email: false, push: true,  label: "Streak reminders",    desc: "Nudge if you haven't logged a trip today." },
    goal:    { email: false, push: true,  label: "Goal achievements",   desc: "Celebrate when you hit a daily or monthly goal." },
    weekly:  { email: false, push: false, label: "Marketing & product", desc: "Atmos news, occasional updates. Off by default." },
  });
  const [quietStart, setQuietStart] = useStateSet("22:00");
  const [quietEnd, setQuietEnd] = useStateSet("07:00");

  return (
    <SettingsSection
      title="Notifications"
      description="Pick which updates Atmos sends and where. Quiet hours apply to push only."
      footer={<><Button variant="secondary">Cancel</Button><Button variant="primary">Save changes</Button></>}
    >
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 110px 110px", gap: 16,
        padding: "0 0 12px",
        borderBottom: "1px solid #F0F2F5",
        fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
        color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
      }}>
        <div>Notification</div>
        <div style={{ textAlign: "center" }}>Email</div>
        <div style={{ textAlign: "center" }}>Push</div>
      </div>

      {Object.entries(prefs).map(([k, p], i) => (
        <div key={k} style={{
          display: "grid", gridTemplateColumns: "1fr 110px 110px", gap: 16,
          alignItems: "center",
          padding: "14px 0",
          borderBottom: i < Object.keys(prefs).length - 1 ? "1px solid #F5F7FA" : "none",
        }}>
          <div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1A2332" }}>{p.label}</div>
            <div style={{ marginTop: 3, fontFamily: "Inter, sans-serif", fontSize: 12, color: "#6B7A8D" }}>{p.desc}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Toggle value={p.email} onChange={(v) => setPrefs({ ...prefs, [k]: { ...p, email: v } })} size="sm" />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Toggle value={p.push} onChange={(v) => setPrefs({ ...prefs, [k]: { ...p, push: v } })} size="sm" />
          </div>
        </div>
      ))}

      <FormRow label="Quiet hours" hint="No push notifications during this window." divider={false}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TextInput value={quietStart} onChange={setQuietStart} maxWidth={120} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7A8D" }}>to</span>
          <TextInput value={quietEnd} onChange={setQuietEnd} maxWidth={120} />
        </div>
      </FormRow>
    </SettingsSection>
  );
}

// ---- PRIVACY ------------------------------------------------------------
function PrivacySection() {
  const [shareAnon, setShareAnon] = useStateSet(true);
  const [precision, setPrecision] = useStateSet("city");
  const [retention, setRetention] = useStateSet("forever");

  return (
    <>
      <SettingsSection
        title="Privacy & data"
        description="Control what Atmos collects, how precise it is, and how long it's stored."
        footer={<Button variant="primary">Save changes</Button>}
      >
        <FormRow label="Anonymous research data" hint="Help us benchmark commute patterns. Never identifies you.">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Toggle value={shareAnon} onChange={setShareAnon} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, color: shareAnon ? "#1A2332" : "#6B7A8D" }}>
              {shareAnon ? "Sharing aggregate data" : "Not sharing"}
            </span>
          </div>
        </FormRow>

        <FormRow label="Trip location precision" hint="Exact stores GPS traces; City stores only origin/destination city.">
          <Segmented value={precision} onChange={setPrecision}
            options={[
              { value: "exact", label: "Exact" },
              { value: "city",  label: "City only" },
              { value: "none",  label: "Mode only" },
            ]} />
        </FormRow>

        <FormRow label="Trip history retention" divider={false}>
          <Select value={retention} onChange={setRetention}
            options={[
              { value: "forever", label: "Keep forever" },
              { value: "2y",      label: "Auto-delete after 2 years" },
              { value: "1y",      label: "Auto-delete after 1 year" },
              { value: "90d",     label: "Auto-delete after 90 days" },
            ]} maxWidth={280} />
        </FormRow>
      </SettingsSection>

      <SettingsSection
        title="Export your data"
        description="Atmos is yours. Take a copy whenever you'd like, in either format."
      >
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="secondary" icon="arrow-down">Export as CSV</Button>
          <Button variant="secondary" icon="arrow-down">Export as JSON</Button>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Danger zone"
        description="These actions are permanent and can't be undone."
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <DangerRow
            title="Delete all trip data"
            body="Removes every logged trip, but keeps your profile and goals."
            cta="Delete trips"
          />
          <DangerRow
            title="Delete your Atmos account"
            body="Removes your profile, trips, insights, and connected apps. We email you a final export first."
            cta="Delete account"
            solid
          />
        </div>
      </SettingsSection>
    </>
  );
}

function DangerRow({ title, body, cta, solid }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 18px",
      border: "1px solid #F2C7C7", borderRadius: 12,
      background: "#FFF7F7", gap: 16,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1A2332" }}>{title}</div>
        <div style={{ marginTop: 3, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>{body}</div>
      </div>
      <Button variant={solid ? "danger-solid" : "danger"}>{cta}</Button>
    </div>
  );
}

// ---- CONNECTIONS --------------------------------------------------------
function ConnectionsSection() {
  const apps = [
    { id: "applehealth", name: "Apple Health",     desc: "Walk and bike trips, plus daily step counts.",  connected: true,  date: "Connected · Mar 4" },
    { id: "googlefit",   name: "Google Fit",       desc: "Cross-platform fitness data import.",            connected: false },
    { id: "calendar",    name: "Google Calendar",  desc: "Match trips to events for richer context.",      connected: true,  date: "Connected · Feb 21" },
    { id: "strava",      name: "Strava",           desc: "Sync rides and runs as zero-emission trips.",    connected: false },
    { id: "uber",        name: "Uber & Lyft",      desc: "Auto-import rideshare receipts.",                connected: false },
  ];

  return (
    <SettingsSection
      title="Connected apps"
      description="Atmos can pull trip data from these services. We only read what you choose."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {apps.map(a => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "14px 16px",
            border: "1px solid #F0F2F5", borderRadius: 12,
            background: "#fff",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: a.connected ? "rgba(61,171,130,0.10)" : "#F5F7FA",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon name="plug" size={18} color={a.connected ? "#3DAB82" : "#94A1B2"} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: "#1A2332" }}>{a.name}</span>
                {a.connected && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "2px 8px", borderRadius: 999,
                    background: "rgba(61,171,130,0.10)", color: "#3DAB82",
                    fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 600,
                    letterSpacing: 0.3, textTransform: "uppercase",
                  }}>Active</span>
                )}
              </div>
              <div style={{ marginTop: 3, fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B7A8D" }}>
                {a.desc}{a.date && <span style={{ marginLeft: 10, color: "#94A1B2" }}>· {a.date}</span>}
              </div>
            </div>
            {a.connected ? (
              <Button variant="secondary" size="sm">Disconnect</Button>
            ) : (
              <Button variant="primary" size="sm">Connect</Button>
            )}
          </div>
        ))}
      </div>
    </SettingsSection>
  );
}

// ---- BILLING ------------------------------------------------------------
function BillingSection() {
  return (
    <>
      <SettingsSection
        title="Plan & billing"
        description="You're on the free plan. Upgrade for advanced analytics, household tracking, and unlimited insights history."
      >
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
        }}>
          <PlanCard
            tier="Free"
            price="$0"
            current
            features={[
              "Unlimited trip logging",
              "30 days of insight history",
              "Weekly digest email",
              "1 connected app",
            ]}
            cta={<Button variant="secondary" size="sm">Current plan</Button>}
          />
          <PlanCard
            tier="Pro"
            price="$5"
            period="/ month"
            highlight
            features={[
              "Everything in Free",
              "Unlimited insights history",
              "Carpooling matches",
              "Household tracking · up to 4",
              "Unlimited connected apps",
              "CSV / JSON export",
            ]}
            cta={<Button variant="primary" size="sm">Upgrade to Pro</Button>}
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Billing history"
        description="No charges yet — you're on the free plan."
      >
        <div style={{
          padding: "32px 16px", textAlign: "center",
          background: "#FAFBFC", borderRadius: 12,
          fontFamily: "Inter, sans-serif", color: "#6B7A8D", fontSize: 13,
        }}>
          Once you upgrade, invoices and receipts will appear here.
        </div>
      </SettingsSection>
    </>
  );
}

function PlanCard({ tier, price, period, features, cta, current, highlight }) {
  return (
    <div style={{
      position: "relative",
      border: highlight ? "1.5px solid #4A90C4" : "1px solid #F0F2F5",
      background: highlight ? "rgba(74,144,196,0.04)" : "#fff",
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 14,
    }}>
      {highlight && (
        <span style={{
          position: "absolute", top: -10, right: 16,
          padding: "3px 9px", borderRadius: 999,
          background: "#4A90C4", color: "#fff",
          fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700,
          letterSpacing: 0.5, textTransform: "uppercase",
        }}>Recommended</span>
      )}
      <div>
        <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, color: "#6B7A8D", letterSpacing: 0.5, textTransform: "uppercase" }}>{tier}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 30, fontWeight: 600, color: "#1A2332", letterSpacing: -0.6 }}>{price}</span>
          {period && <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6B7A8D" }}>{period}</span>}
        </div>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {features.map((f, i) => (
          <li key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1A2332",
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: highlight ? "rgba(74,144,196,0.15)" : "#F0F2F5",
              color: highlight ? "#4A90C4" : "#6B7A8D",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700,
            }}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <div>{cta}</div>
    </div>
  );
}

// ---- ACCOUNT ------------------------------------------------------------
function AccountSection() {
  const [twofa, setTwofa] = useStateSet(false);

  return (
    <>
      <SettingsSection
        title="Sign in & security"
        description="Manage how you sign in to Atmos."
      >
        <FormRow label="Password" hint="Last changed 47 days ago.">
          <Button variant="secondary">Change password</Button>
        </FormRow>

        <FormRow label="Two-factor authentication" hint="Adds an authenticator code to every sign-in.">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Toggle value={twofa} onChange={setTwofa} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 500, color: twofa ? "#1A2332" : "#6B7A8D" }}>
              {twofa ? "Enabled" : "Disabled · we'll prompt you to set up"}
            </span>
          </div>
        </FormRow>

        <FormRow label="Active sessions" hint="Devices currently signed in." divider={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 480 }}>
            <SessionRow device="MacBook Pro · Chrome" location="San Francisco, CA" lastActive="Active now" current />
            <SessionRow device="iPhone 15 · Atmos iOS" location="San Francisco, CA" lastActive="2 hours ago" />
            <SessionRow device="iPad · Safari" location="San Francisco, CA" lastActive="3 days ago" />
          </div>
        </FormRow>
      </SettingsSection>

      <SettingsSection title="Sign out">
        <div style={{ display: "flex", gap: 10 }}>
          <Button variant="secondary">Sign out</Button>
          <Button variant="secondary">Sign out everywhere</Button>
        </div>
      </SettingsSection>
    </>
  );
}

function SessionRow({ device, location, lastActive, current }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 14px",
      border: "1px solid #F0F2F5", borderRadius: 10,
      background: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#F5F7FA",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon name="settings" size={15} color="#6B7A8D" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, fontWeight: 600, color: "#1A2332" }}>{device}</span>
            {current && (
              <span style={{
                padding: "2px 7px", borderRadius: 999,
                background: "rgba(61,171,130,0.10)", color: "#3DAB82",
                fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: 0.4, textTransform: "uppercase",
              }}>This device</span>
            )}
          </div>
          <div style={{ marginTop: 2, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: "#6B7A8D" }}>
            {location} · {lastActive}
          </div>
        </div>
      </div>
      {!current && <Button variant="ghost" size="sm">Revoke</Button>}
    </div>
  );
}

// ---- PAGE ---------------------------------------------------------------
function SettingsPage() {
  const [active, setActive] = useStateSet("profile");
  const currentItem = SUB_NAV.find(it => it.id === active);

  const content = (() => {
    switch (active) {
      case "profile":       return <ProfileSection />;
      case "goals":         return <GoalsSection />;
      case "notifications": return <NotificationsSection />;
      case "privacy":       return <PrivacySection />;
      case "connections":   return <ConnectionsSection />;
      case "billing":       return <BillingSection />;
      case "account":       return <AccountSection />;
      default: return null;
    }
  })();

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#F5F7FA", fontFamily: "Inter, sans-serif", color: "#1A2332",
    }}>
      <Sidebar active="settings" />
      <main data-screen-label={`Settings · ${currentItem?.label}`} style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header title="Settings" subtitle="Configure your profile, goals, notifications, and more." />
        <div style={{ display: "grid", gridTemplateColumns: "220px minmax(0, 1fr)", gap: 28, padding: "28px 36px 40px", flex: 1 }}>
          <div style={{
            position: "sticky", top: 92, alignSelf: "flex-start",
            background: "#fff", borderRadius: 14,
            padding: 8,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <SubNav active={active} setActive={setActive} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            <div style={{
              fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500,
              color: "#6B7A8D", letterSpacing: 0.4, textTransform: "uppercase",
            }}>
              Settings · {currentItem?.label}
            </div>
            {content}
          </div>
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SettingsPage />);
