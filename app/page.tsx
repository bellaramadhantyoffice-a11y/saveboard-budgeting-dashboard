"use client";

import { useMemo, useState } from "react";

type View = "dashboard" | "reporting" | "goals" | "settings";

const navItems: { id: View; label: string; glyph: string }[] = [
  { id: "dashboard", label: "Dashboard", glyph: "D" },
  { id: "reporting", label: "Monthly reporting", glyph: "R" },
  { id: "goals", label: "Budget goals", glyph: "G" },
  { id: "settings", label: "Settings", glyph: "S" },
];

const monthData = [
  { month: "Jan", income: 5100, spending: 3820, saved: 1280 },
  { month: "Feb", income: 5350, spending: 4040, saved: 1310 },
  { month: "Mar", income: 5200, spending: 3890, saved: 1310 },
  { month: "Apr", income: 5700, spending: 4120, saved: 1580 },
  { month: "May", income: 5500, spending: 4360, saved: 1140 },
  { month: "Jun", income: 5900, spending: 4210, saved: 1690 },
];

const categories = [
  { name: "Housing", spent: 1650, budget: 1800 },
  { name: "Food", spent: 670, budget: 760 },
  { name: "Transport", spent: 310, budget: 420 },
  { name: "Personal", spent: 540, budget: 500 },
  { name: "Subscriptions", spent: 118, budget: 150 },
];

const transactions = [
  { merchant: "Payroll deposit", date: "Jun 28", amount: 2950, type: "Income" },
  { merchant: "Apartment rent", date: "Jun 26", amount: -1650, type: "Housing" },
  { merchant: "Fresh market", date: "Jun 24", amount: -86, type: "Food" },
  { merchant: "Metro card", date: "Jun 21", amount: -44, type: "Transport" },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [monthlyIncome, setMonthlyIncome] = useState(5900);
  const [monthlyBudget, setMonthlyBudget] = useState(4210);
  const [savingsTarget, setSavingsTarget] = useState(1800);
  const [autoRoundups, setAutoRoundups] = useState(true);
  const [quietMode, setQuietMode] = useState(false);
  const [goalName, setGoalName] = useState("Emergency fund");

  const currentSavings = monthlyIncome - monthlyBudget;
  const saveRate = Math.max(0, Math.round((currentSavings / monthlyIncome) * 100));
  const goalProgress = Math.min(100, Math.round((currentSavings / savingsTarget) * 100));
  const remaining = Math.max(0, savingsTarget - currentSavings);
  const selectedReport = monthData[monthData.length - 1];

  const budgetHealth = useMemo(() => {
    const totalSpent = categories.reduce((sum, item) => sum + item.spent, 0);
    const totalBudget = categories.reduce((sum, item) => sum + item.budget, 0);
    return Math.round((totalSpent / totalBudget) * 100);
  }, []);

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="Primary">
        <a className="brand" href="#dashboard" onClick={() => setActiveView("dashboard")}>
          <span className="brand-mark" aria-hidden="true" />
          Saveboard
        </a>
        <nav className="topnav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeView === item.id ? "nav-link is-active" : "nav-link"}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="sign-in">Sync account</button>
      </header>

      <section className="hero-panel" id="dashboard">
        <div className="confetti confetti-left" aria-hidden="true" />
        <div className="confetti confetti-right" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow">Interactive money workspace</span>
          <h1>Plan spending, protect savings, and steer the month.</h1>
          <p>
            A focused budgeting dashboard for household cash flow, monthly reports,
            savings goals, and account preferences.
          </p>
          <div className="hero-actions">
            <button className="hero-cta" onClick={() => setActiveView("goals")}>
              Review goals
            </button>
            <button className="hero-link" onClick={() => setActiveView("reporting")}>
              See monthly report
            </button>
          </div>
        </div>
        <div className="hero-card" aria-label="Savings snapshot">
          <div className="mini-toolbar">
            <span />
            <span />
            <span />
          </div>
          <div className="snapshot-grid">
            <div>
              <small>June saved</small>
              <strong>{money(currentSavings)}</strong>
            </div>
            <div>
              <small>Save rate</small>
              <strong>{saveRate}%</strong>
            </div>
          </div>
          <div className="line-chart" aria-hidden="true">
            {monthData.map((item) => (
              <i key={item.month} style={{ height: `${28 + item.saved / 34}px` }} />
            ))}
          </div>
          <div className="snapshot-footer">
            <span>{goalProgress}% of target</span>
            <b>{money(remaining)} left</b>
          </div>
        </div>
      </section>

      <div className="workspace">
        <aside className="side-menu" aria-label="Budget menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeView === item.id ? "menu-item is-active" : "menu-item"}
              onClick={() => setActiveView(item.id)}
            >
              <span>{item.glyph}</span>
              {item.label}
            </button>
          ))}
        </aside>

        <section className="content-panel" aria-live="polite">
          {activeView === "dashboard" && (
            <div className="view-grid">
              <div className="section-heading">
                <span className="badge">Dashboard</span>
                <h2>This month at a glance</h2>
              </div>
              <div className="metric-grid">
                <Metric title="Income" value={money(monthlyIncome)} detail="+7% from May" />
                <Metric title="Planned spend" value={money(monthlyBudget)} detail={`${budgetHealth}% of category plan`} />
                <Metric title="Projected savings" value={money(currentSavings)} detail={`${saveRate}% save rate`} />
              </div>
              <div className="two-column">
                <section className="card">
                  <div className="card-title">
                    <h3>Budget categories</h3>
                    <span className="badge blue">Live</span>
                  </div>
                  <div className="category-list">
                    {categories.map((item) => {
                      const percent = Math.min(100, Math.round((item.spent / item.budget) * 100));
                      return (
                        <div className="category-row" key={item.name}>
                          <div>
                            <b>{item.name}</b>
                            <span>{money(item.spent)} of {money(item.budget)}</span>
                          </div>
                          <div className="progress"><i style={{ width: `${percent}%` }} /></div>
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section className="card">
                  <div className="card-title">
                    <h3>Recent activity</h3>
                    <button className="text-button">Export</button>
                  </div>
                  <div className="transaction-list">
                    {transactions.map((item) => (
                      <div className="transaction" key={item.merchant}>
                        <span>{item.type.slice(0, 1)}</span>
                        <div>
                          <b>{item.merchant}</b>
                          <small>{item.date} · {item.type}</small>
                        </div>
                        <strong className={item.amount > 0 ? "positive" : ""}>
                          {money(item.amount)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeView === "reporting" && (
            <div className="view-grid">
              <div className="section-heading">
                <span className="badge">Monthly reporting</span>
                <h2>June performance report</h2>
              </div>
              <section className="card report-card">
                <div className="report-summary">
                  <div>
                    <span>Income</span>
                    <strong>{money(selectedReport.income)}</strong>
                  </div>
                  <div>
                    <span>Spending</span>
                    <strong>{money(selectedReport.spending)}</strong>
                  </div>
                  <div>
                    <span>Saved</span>
                    <strong>{money(selectedReport.saved)}</strong>
                  </div>
                </div>
                <div className="bar-chart" aria-label="Monthly savings chart">
                  {monthData.map((item) => (
                    <div className="bar-group" key={item.month}>
                      <div className="bar-stack">
                        <i className="income-bar" style={{ height: `${item.income / 80}px` }} />
                        <i className="spend-bar" style={{ height: `${item.spending / 80}px` }} />
                        <i className="save-bar" style={{ height: `${item.saved / 28}px` }} />
                      </div>
                      <span>{item.month}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section className="lavender-band">
                <h3>Monthly insight</h3>
                <p>
                  You are on track to beat the current savings target if personal
                  spending stays below {money(510)} for the rest of the cycle.
                </p>
              </section>
            </div>
          )}

          {activeView === "goals" && (
            <div className="view-grid">
              <div className="section-heading">
                <span className="badge">Budget goals</span>
                <h2>Set the target and tune the plan</h2>
              </div>
              <section className="card goal-card">
                <label className="field">
                  Goal name
                  <input value={goalName} onChange={(event) => setGoalName(event.target.value)} />
                </label>
                <div className="slider-grid">
                  <Range label="Monthly income" value={monthlyIncome} min={3500} max={9000} step={100} onChange={setMonthlyIncome} />
                  <Range label="Spending plan" value={monthlyBudget} min={1800} max={8000} step={50} onChange={setMonthlyBudget} />
                  <Range label="Savings target" value={savingsTarget} min={500} max={4500} step={50} onChange={setSavingsTarget} />
                </div>
                <div className="goal-meter">
                  <div>
                    <span>{goalName || "Savings goal"}</span>
                    <strong>{goalProgress}%</strong>
                  </div>
                  <div className="progress large"><i style={{ width: `${goalProgress}%` }} /></div>
                  <p>{money(currentSavings)} projected this month · {money(remaining)} remaining</p>
                </div>
              </section>
            </div>
          )}

          {activeView === "settings" && (
            <div className="view-grid">
              <div className="section-heading">
                <span className="badge">Settings</span>
                <h2>Budget workspace preferences</h2>
              </div>
              <section className="card settings-card">
                <Toggle
                  title="Automatic roundups"
                  description="Round eligible purchases and move the extra amount into savings."
                  enabled={autoRoundups}
                  onClick={() => setAutoRoundups(!autoRoundups)}
                />
                <Toggle
                  title="Quiet spending alerts"
                  description="Group alerts into one daily summary instead of sending each one."
                  enabled={quietMode}
                  onClick={() => setQuietMode(!quietMode)}
                />
                <label className="field">
                  Monthly report delivery
                  <select defaultValue="email">
                    <option value="email">Email summary</option>
                    <option value="download">Download only</option>
                    <option value="both">Email and download</option>
                  </select>
                </label>
              </section>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <section className="metric-card">
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </section>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-field">
      <span>
        {label}
        <b>{money(value)}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function Toggle({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button className="toggle-row" onClick={onClick} aria-pressed={enabled}>
      <span>
        <b>{title}</b>
        <small>{description}</small>
      </span>
      <i className={enabled ? "toggle is-on" : "toggle"} aria-hidden="true" />
    </button>
  );
}
