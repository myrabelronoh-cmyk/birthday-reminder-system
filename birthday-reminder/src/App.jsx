import {
  Cake,
  Heart,
  CalendarDays,
  Users,
  Gift,
  Search,
  Bell,
  Plus,
  Settings,
  LayoutDashboard,
  Calendar,
  LoaderCircle,
  AlertCircle,
  Cake,
} from "lucide-react";

import { useMemo, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { isFirebaseConfigured } from "./services/firebase";
import { mockBirthdays } from "./data/mockBirthdays";

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
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div className="rounded-xl bg-indigo-50 p-3">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function BirthdayCard({ birthday }) {
  const days = getDaysUntilBirthday(birthday);
  const age = getTurningAge(birthday);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
        {getInitials(birthday.name)}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-slate-800">
          {birthday.name}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {birthday.category} · Turning {age}
        </p>
      </div>

      <div className="text-right">
        {days === 0 ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Today!
          </span>
        ) : (
          <p className="text-sm font-semibold text-indigo-600">
            {days} {days === 1 ? "day" : "days"}
          </p>
        )}

        <p className="mt-1 text-xs text-slate-400">
          {birthday.day}/{birthday.month}
        </p>
      </div>
    </div>
  );
}

function App() {
  const { currentUser, loading, authError } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

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
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
          <p className="mt-3 text-sm text-slate-500">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600 p-2">
              <Balloons className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Birthday Reminder
              </h1>
              <p className="text-xs text-slate-400">
                Celebrate every moment
              </p>
            </div>
          </div>

          <nav className="mt-10 space-y-2">

            <a
              href="#/"
              className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700"
            >
              <LayoutDashboard size={22} />
              Dashboard
            </a>

            <a
              href="#/birthdays"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50"
            >
              <Calendar size={22} />
              Birthdays
            </a>

            <a
              href="#/settings"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-50"
            >
                <Settings size={22} />
                Settings
                </a>

            </nav>

            <div className="mt-12 rounded-2xl bg-indigo-50 p-4">
            <Gift className="h-7 w-7 text-indigo-600" />

            <h3 className="mt-3 font-semibold text-indigo-900">
              Make someone's day!
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-indigo-700">
              A thoughtful birthday wish can make a special day even better.
            </p>
          </div>

        </aside>

       
        <main className="min-w-0 flex-1">

         
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">

            <div>
              <h2 className="font-bold text-slate-900">
                Dashboard
              </h2>

              <p className="text-xs text-slate-500">
                Your birthday overview
              </p>
            </div>

            <div className="flex items-center gap-4">

              <button
                type="button"
                aria-label="Notifications"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              >
                <Bell size={20} />
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {getInitials(greetingName)}
              </div>

            </div>

          </header>

          <div className="mx-auto max-w-7xl space-y-8 p-5 md:p-8">

            {/* Welcome */}
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                  Welcome, {greetingName}! 
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                  Here is what's happening with your birthdays.
                </p>
              </div>

              <button
                type="button"
                disabled
                title="Birthday management will be enabled in Sprint 5"
                className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white opacity-70"
              >
                <Plus size={18} />
                Add Birthday
              </button>

            </section>
            <section
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                isFirebaseConfigured
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
              }`}
            >
              {isFirebaseConfigured ? (
                <Heart className="mt-0.5 h-5 w-5 text-emerald-600" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
              )}

              <div>
                <p className="text-sm font-semibold">
                  {isFirebaseConfigured
                    ? "Firebase configuration detected"
                    : "Firebase configuration required"}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {isFirebaseConfigured
                    ? "The Firebase configuration is available. Authentication and database operations still need to be tested."
                    : "Add your Firebase values to .env and restart the development server to connect your project."}
                </p>
              </div>
            </section>

            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                Authentication error: {authError}
              </div>
            )}

            
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Today's Birthdays 🎂
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Don't forget to send your wishes.
                  </p>
                </div>

                <Gift className="text-indigo-600" />
              </div>

              {todayBirthdays.length > 0 ? (
                <div className="space-y-3">
                  {todayBirthdays.map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <Cake className="mx-auto h-9 w-9 text-slate-300" />

                  <p className="mt-3 font-medium text-slate-700">
                    No birthdays today
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your next celebration is coming soon.
                  </p>
                </div>
              )}

            </section>
            <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Upcoming Birthdays
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Keep track of upcoming celebrations.
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    placeholder="Search birthdays..."
                    aria-label="Search birthdays"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 sm:w-64"
                  />
                </div>

              </div>

              {filteredBirthdays.length > 0 ? (
                <div className="space-y-3">
                  {filteredBirthdays.map((birthday) => (
                    <BirthdayCard
                      key={birthday.id}
                      birthday={birthday}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <Search className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm text-slate-600">
                    No matching birthdays found.
                  </p>
                </div>
              )}

            </section>

            <footer className="pb-4 text-center text-xs text-slate-400">
              Birthday Reminder · Never miss a special day.
            </footer>

          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
