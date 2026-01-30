
import React from 'react';
import { 
  FileText, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Share2, 
  AlertTriangle,
  History
} from 'lucide-react';
import { AppState, DocumentStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const stats = [
    { label: 'Total Records', value: state.documents.length, icon: FileText, color: 'blue', change: '+12%', positive: true },
    { label: 'Borrowed Files', value: state.documents.filter(d => d.isBorrowed).length, icon: Share2, color: 'amber', change: '-2%', positive: false },
    { label: 'Pending Docs', value: state.documents.filter(d => d.status === DocumentStatus.PENDING).length, icon: Clock, color: 'emerald', change: '+5%', positive: true },
    { label: 'Flagged Issues', value: state.documents.filter(d => d.status === DocumentStatus.DAMAGED || d.status === DocumentStatus.MISSING).length, icon: AlertTriangle, color: 'red', change: '0%', positive: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
        <p className="text-slate-500">Welcome back, check the latest activity for the Office of the Building Official.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center space-x-1 text-xs font-semibold ${stat.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                <span>{stat.change}</span>
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
              <History size={20} className="text-blue-600" />
              <span>System Activity Log</span>
            </h3>
            <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="p-0 overflow-y-auto max-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.activityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        log.action === 'Upload' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{log.userName}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Added Files */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">New Digitized Records</h3>
          </div>
          <div className="p-4 space-y-4">
            {state.documents.slice(0, 4).map((doc) => (
              <div key={doc.id} className="group p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-500 truncate">{doc.ownerName} • {doc.permitNumber}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={doc.status} />
                  <span className="text-[10px] font-medium text-slate-400">{doc.uploadDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
