export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-100 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500">
              Overview of your contacts and interactions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-600">Welcome, User</span>
            <button className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50">
              Logout
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">Total Contacts</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">12</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">Recent Interactions</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">5</p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm text-zinc-500">Upcoming Reminders</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">3</p>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Activity */}
          <div className="lg:col-span-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <h2 className="mb-4 text-lg font-medium text-zinc-900">
              Recent Activity
            </h2>

            <ul className="divide-y divide-zinc-100 text-sm">
              <li className="flex items-center justify-between py-3">
                <span className="text-zinc-700">Called John Doe</span>
                <span className="text-zinc-400">2 days ago</span>
              </li>
              <li className="flex items-center justify-between py-3">
                <span className="text-zinc-700">Met with Jane Smith</span>
                <span className="text-zinc-400">4 days ago</span>
              </li>
              <li className="flex items-center justify-between py-3">
                <span className="text-zinc-700">Sent follow-up email</span>
                <span className="text-zinc-400">1 week ago</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <h2 className="mb-4 text-lg font-medium text-zinc-900">
              Quick Actions
            </h2>

            <div className="flex flex-col gap-3">
              <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Log Interaction
              </button>

              <button className="rounded-md border border-zinc-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100">
                Add Contact
              </button>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}
