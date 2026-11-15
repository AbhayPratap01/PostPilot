
import { useState } from "react";
import axios from "axios";
import {
  LayoutDashboard,
  PenSquare,
  History,
  CalendarDays,
  Settings,
  Send,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Menu,
  Radio,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const publishPost = async () => {
    if (!message.trim()) {
      setError("Please enter a message before publishing.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await axios.post(`${API_URL}/posting`, {
        message: message.trim(),
      });

      setResults(response.data.results || []);

      if (!response.data.success) {
        setError("Some platforms failed to publish your post.");
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to connect to the backend. Check whether FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const publishedCount = results.filter(
    (item) => item.status === "Success"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 p-6 flex-col">

        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Send size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold">PostPilot</h1>
            <p className="text-xs text-slate-400">Social Publishing</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          WORKSPACE
        </p>

        <nav className="space-y-2">
          <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active />
          <SidebarItem icon={<PenSquare />} label="Create Post" />
          <SidebarItem icon={<History />} label="Publishing History" />
          <SidebarItem icon={<CalendarDays />} label="Scheduled Posts" />
          <SidebarItem icon={<Settings />} label="Settings" />
        </nav>

        <div className="mt-12">
          <p className="text-xs text-slate-500 mb-4">
            CONNECTED PLATFORMS
          </p>

          <PlatformItem
            icon={<Send size={17} />}
            name="Telegram"
            color="text-sky-400"
          />

          <PlatformItem
            icon={<MessageCircle size={17} />}
            name="Discord"
            color="text-indigo-400"
          />
        </div>

        <div className="mt-auto text-xs text-slate-500">
          PostPilot v1.0.0
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">

        <header className="flex justify-between items-center mb-10">
          <div>
            <p className="text-slate-400 text-sm">
              Workspace / Overview
            </p>
            <h2 className="text-3xl font-bold mt-2">
              Dashboard
            </h2>
            <p className="text-slate-400 mt-2">
              Manage all your social publishing from one place.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-xl">
            <Radio size={17} />
            <span className="text-sm">System Online</span>
          </div>

          <div className="sm:hidden text-slate-400">
            <Menu />
          </div>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

          <StatCard
            title="Connected Platforms"
            value="02"
            subtitle="Telegram + Discord"
          />

          <StatCard
            title="Successfully Published"
            value={publishedCount}
            subtitle="In the latest attempt"
          />

          <StatCard
            title="Characters"
            value={message.length}
            subtitle="Current message length"
          />

        </section>

        {/* Create Post */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold">
                Create a new post
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Compose once, publish everywhere.
              </p>
            </div>

            <PenSquare className="text-blue-400" />
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's happening? Write your message here..."
            className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-5 outline-none resize-none focus:border-blue-500 transition"
          />

          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-slate-500">
              {message.length} characters
            </span>

            <span className="text-xs text-slate-500">
              Telegram + Discord
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={publishPost}
              disabled={loading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Publishing...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Publish to All Platforms
                </>
              )}
            </button>

            <button
              onClick={() => {
                setMessage("");
                setResults([]);
                setError("");
              }}
              className="border border-slate-700 hover:bg-slate-800 px-6 py-3 rounded-xl transition"
            >
              Clear
            </button>

          </div>

          {error && (
            <div className="mt-5 bg-red-500/10 text-red-400 border border-red-500/20 p-4 rounded-xl flex gap-2">
              <AlertCircle size={19} />
              {error}
            </div>
          )}

        </section>

        {/* Publishing results */}
        {results.length > 0 && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

            <h3 className="font-semibold text-lg mb-5">
              Publishing Results
            </h3>

            <div className="space-y-4">
              {results.map((item, index) => (
                <div
                  key={`${item.platform}-${index}`}
                  className="flex justify-between items-center bg-slate-950 p-4 rounded-xl"
                >
                  <div>
                    <p className="font-medium">
                      {item.platform}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      {item.message || item.error || item.status}
                    </p>
                  </div>

                  {item.status === "Success" ? (
                    <CheckCircle2 className="text-emerald-400" />
                  ) : (
                    <AlertCircle className="text-red-400" />
                  )}
                </div>
              ))}
            </div>

          </section>
        )}

        {/* Platform cards */}
        <section>
          <h3 className="text-xl font-semibold mb-5">
            Your Platforms
          </h3>

          <div className="grid sm:grid-cols-2 gap-5">

            <PlatformCard
              name="Telegram"
              description="Publish messages to your Telegram channel."
              color="bg-sky-500/10 text-sky-400"
              icon={<Send size={25} />}
            />

            <PlatformCard
              name="Discord"
              description="Publish messages to your Discord channel."
              color="bg-indigo-500/10 text-indigo-400"
              icon={<MessageCircle size={25} />}
            />

          </div>
        </section>

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl text-sm cursor-pointer ${
        active
          ? "bg-blue-600 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function PlatformItem({ icon, name, color }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className={`flex items-center gap-3 ${color}`}>
        {icon}
        <span className="text-sm text-slate-300">{name}</span>
      </div>
      <span className="w-2 h-2 bg-emerald-400 rounded-full" />
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <p className="text-slate-400 text-sm">{title}</p>
      <h3 className="text-3xl font-bold mt-3">{value}</h3>
      <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
    </div>
  );
}

function PlatformCard({ name, description, color, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
      <div className={`inline-flex p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold mt-4">{name}</h4>
      <p className="text-sm text-slate-400 mt-2">{description}</p>
      <div className="flex items-center gap-2 mt-5 text-emerald-400 text-sm">
        <CheckCircle2 size={16} />
        Connected
      </div>
    </div>
  );
}

export default App;
