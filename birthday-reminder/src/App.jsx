
import {
  Cake,
  Heart,
  CalendarDays,
  Users,
  Gift,
  Search,
  Plus,
  ChevronRight,
  Settings,
  LayoutDashboard,
  Calendar,
  LoaderCircle,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { mockBirthdays } from "./data/mockBirthdays";
import AuthScreen from "./components/AuthScreen";

function getNextBirthday(birthday) {
  const today = new Date();

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  let nextDate = new Date(
    today.getFullYear(),
    birthday.month - 1,
    birthday.day
  );

  if (nextDate < todayDate) {
    nextDate = new Date(
      today.getFullYear() + 1,
      birthday.month - 1,
      birthday.day
    );
  }

  return nextDate;
}

function getDaysUntilBirthday(birthday) {
  const today = new Date();

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const nextDate = getNextBirthday(birthday);

  return Math.round(
    (nextDate.getTime() - todayDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function getTurningAge(birthday) {
  return getNextBirthday(birthday).getFullYear() -
    birthday.year;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div>
          <p className="stat-label">{title}</p>
          <h2 className="stat-value">
            {value}
          </h2>
        </div>

        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>

      <p className="stat-description">
        {description}
      </p>
    </div>
  );
}

function BirthdayCard({ birthday }) {
  const days = getDaysUntilBirthday(birthday);
  const age = getTurningAge(birthday);

  return (
    <div className="birthday-row">
      <div className="person-avatar">
        {getInitials(birthday.name)}
      </div>

      <div className="person-details">
        <h3 className="person-name">
          {birthday.name}
        </h3>

        <p className="person-meta">
          {birthday.category} · Turning {age}
        </p>
      </div>

      <div className="birthday-date">
        {days === 0 ? (
          <span className="today-label">
            Today!
          </span>
        ) : (
          <p className="birthday-countdown">
            {days} {days === 1 ? "day" : "days"}
          </p>
        )}

        <p className="birthday-day">
          {birthday.day}/{birthday.month}
        </p>
      </div>
    </div>
  );
}

function App() {
  const { currentUser, loading, authError, signOut } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    setSignOutError("");

    try {
      await signOut();
    } catch (error) {
      setSignOutError(error.message);
    }
  }

  const todayBirthdays = useMemo(
    () =>
      mockBirthdays.filter(
        (birthday) => getDaysUntilBirthday(birthday) === 0
      ),
    []
  );

  const upcomingBirthdays = useMemo(
    () =>
      [...mockBirthdays]
        .filter(
          (birthday) => getDaysUntilBirthday(birthday) !== 0
        )
        .sort(
          (a, b) =>
            getDaysUntilBirthday(a) -
            getDaysUntilBirthday(b)
        ),
    []
  );

  const filteredBirthdays = upcomingBirthdays.filter(
    (birthday) =>
      birthday.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const greetingName =
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "there";

  if (loading) {
    return (
      <main className="loading-screen">
        <LoaderCircle size={28} />
        <p>Loading your account...</p>
      </main>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <div className="app-shell">
        <aside className="sidebar">

          <div className="brand">
            <div className="brand-mark">
              <Cake size={22} />
            </div>

            <div>
              <h1 className="brand-name">
                Birthday Reminder
              </h1>
              <p className="brand-caption">
                Celebrate every moment
              </p>
            </div>
          </div>

          <nav className="side-nav">

            <a
              href="#/"
              className="nav-link active"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </a>

            <a
              href="#/birthdays"
              className="nav-link"
            >
              <Calendar size={19} />
              Birthdays
            </a>

            <a
              href="#/settings"
              className="nav-link"
            >
              <Settings size={19} />
              Settings
            </a>

          </nav>

          <div className="sidebar-note">
            <Gift size={24} />

            <h3>Make someone feel special today</h3>

            <p>
              A thoughtful birthday wish can make a special day even better.
            </p>
          </div>

        </aside>

       
        <main className="main-area">

         
          <header className="topbar">

            <div>
              <h2>
                Dashboard
                <span className="breadcrumb-separator">
                  <ChevronRight size={14} />
                </span>
                <span className="breadcrumb-current">
                  Overview
                </span>
              </h2>

              <p>
              Here is a quick overview of your birthday reminders.
              </p>

            </div>

            <div className="topbar-actions">
              <div className="user-avatar">
                {getInitials(greetingName)}
              </div>

              <button
                type="button"
                className="sign-out-button"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>

          </header>

          <div className="dashboard-content">
            <section className="welcome-section">

              <div>
                <h1 className="welcome-title">
                  Welcome, {greetingName}!
                </h1>

                <p className="welcome-copy">
                  Here is what's happening with your birthdays.
                </p>
              </div>

              <button
                type="button"
                disabled
                title="Birthday management will be enabled in Sprint 5"
                className="primary-button"
              >
                <Plus size={18} />
                Add Birthday
              </button>

            </section>

            {(signOutError || authError) && (
              <div className="auth-error">
                Authentication error: {signOutError || authError}
              </div>
            )}

            
            <section className="stats-grid">

              <StatCard
                title="Total Birthdays"
                value={mockBirthdays.length}
                description="Sample birthday records"
                icon={Users}
              />

              <StatCard
                title="Today's Birthdays"
                value={todayBirthdays.length}
                description="People celebrating today"
                icon={Cake}
              />

              <StatCard
                title="Upcoming Birthdays"
                value={upcomingBirthdays.length}
                description="People with upcoming birthdays"
                icon={CalendarDays}
              />

              <StatCard
                title="Categories"
                value={
                  new Set(
                    mockBirthdays.map((item) => item.category)
                  ).size
                }
                description="Different contact groups"
                icon={Heart}
              />

            </section>

            {/* Today's birthdays */}
            <section className="content-card">

              <div className="section-heading">
                <div>
                  <h2>
                    Today's Birthdays
                  </h2>

                  <p>
                    Don't forget to send your loved ones there wishes and gifts.
                  </p>
                </div>

                <Gift className="section-icon" />
              </div>

              {todayBirthdays.length > 0 ? (
                <div className="birthday-list">
                  {todayBirthdays.map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Cake size={30} />

                  <p>
                    No birthdays today
                  </p>

                  <p>
                    Your next celebration is coming soon.
                  </p>
                </div>
              )}

            </section>
            <section className="content-card">

              <div className="section-heading with-search">

                <div>
                  <h2>
                    Upcoming Birthdays
                  </h2>

                  <p>
                    Keep track of upcoming celebrations.
                  </p>
                </div>

                <div className="search-wrap">

                  <Search className="search-icon" size={16} />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search birthdays..."
                    aria-label="Search birthdays"
                    className="search-input"
                  />
                </div>

              </div>

              {filteredBirthdays.length > 0 ? (
                <div className="birthday-list">
                  {filteredBirthdays.map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                    />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Search size={30} />

                  <p>
                    No matching birthdays found.
                  </p>
                </div>
              )}

            </section>

            <footer className="app-footer">
              Birthday Reminder
            </footer>

          </div>

        </main>
    </div>
  );
}

export default App;