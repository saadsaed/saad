import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/dashboard";
import { 
  FolderGit, 
  Briefcase, 
  Cpu, 
  Wrench, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardStats();
      setData(result);
    } catch (err) {
      setError("Unable to load dashboard metrics. Check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-200 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-neutral-200 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="text-red-500" size={40} />
        <div>
          <h3 className="font-semibold text-red-900">Database Connection Failed</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  const { stats, recent } = data;
  const isDatabaseEmpty = 
    stats.projects.total === 0 && 
    stats.services.total === 0 && 
    stats.automations.total === 0 && 
    stats.technologies.total === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Projects</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.projects.total}</span>
            <span className="text-xs text-neutral-500">
              {stats.projects.published} Published &bull; {stats.projects.draft} Drafts
            </span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <FolderGit size={22} />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Services</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.services.total}</span>
            <span className="text-xs text-neutral-500">
              {stats.services.published} Published
            </span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Automations */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Automations</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.automations.total}</span>
            <span className="text-xs text-neutral-500">
              {stats.automations.published} Active Workflows
            </span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <Cpu size={22} />
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Technologies</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.technologies.total}</span>
            <span className="text-xs text-neutral-500">Global Tech Stack</span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <Wrench size={22} />
          </div>
        </div>
      </div>

      {/* Database Empty State or Recent Activity */}
      {isDatabaseEmpty ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-500 max-w-sm">
            Your database tables are currently empty. Seed records or add items once individual CMS modules are implemented.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm uppercase tracking-wider text-neutral-400">
            Recent Activity
          </h3>
          {recent.length === 0 ? (
            <p className="text-sm text-neutral-500">No recent updates detected.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recent.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-neutral-900">{item.title}</span>
                    <span className="ml-2 text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Updated {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
