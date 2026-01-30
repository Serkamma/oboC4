
import React from 'react';
import { 
  LayoutDashboard, 
  Library, 
  Users, 
  FileUp, 
  ClipboardList, 
  Search, 
  Bell, 
  LogOut, 
  Menu,
  FileText
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; role: string };
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Digital Bookshelf', icon: Library, path: '/bookshelf' },
    { label: 'Owner Records', icon: Users, path: '/records' },
    { label: 'Upload Files', icon: FileUp, path: '/upload' },
    { label: 'Reports', icon: ClipboardList, path: '/reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-none">OBO Archive</h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Government Office</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-blue-600' : ''} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <button className="text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={20} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search permit #, owner, or files..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-80 focus:ring-2 focus:ring-blue-100 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-600">
              <span className="hidden sm:inline">Records Counter: </span>
              <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">1,248</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
