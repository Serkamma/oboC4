
import React, { useState } from 'react';
import { 
  Folder, 
  ChevronRight, 
  Library, 
  Calendar,
  Grid,
  List as ListIcon,
  ChevronLeft
} from 'lucide-react';
import { AppState, DigitalDocument } from '../types';
import { Link } from 'react-router-dom';

interface BookshelfProps {
  state: AppState;
}

const Bookshelf: React.FC<BookshelfProps> = ({ state }) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const years = Array.from(new Set(state.documents.map(d => d.year))).sort((a, b) => b - a);
  const monthsForYear = selectedYear 
    ? Array.from(new Set(state.documents.filter(d => d.year === selectedYear).map(d => d.month)))
    : [];

  const filteredDocs = state.documents.filter(d => 
    (!selectedYear || d.year === selectedYear) && 
    (!selectedMonth || d.month === selectedMonth)
  );

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
            <Library size={24} className="text-blue-600" />
            <span>Digital Bookshelf</span>
          </h2>
          <p className="text-slate-500">Explore and retrieve records through chronological categorization.</p>
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
          <button className="p-1.5 bg-slate-100 rounded text-slate-600"><Grid size={18} /></button>
          <button className="p-1.5 hover:bg-slate-50 rounded text-slate-400"><ListIcon size={18} /></button>
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm">
        <button 
          onClick={() => { setSelectedYear(null); setSelectedMonth(null); }}
          className="text-blue-600 hover:underline font-medium"
        >
          All Years
        </button>
        {selectedYear && (
          <>
            <ChevronRight size={14} className="text-slate-400" />
            <button 
              onClick={() => setSelectedMonth(null)}
              className="text-blue-600 hover:underline font-medium"
            >
              {selectedYear}
            </button>
          </>
        )}
        {selectedMonth && (
          <>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-600 font-semibold">{selectedMonth}</span>
          </>
        )}
      </nav>

      {/* Main Grid View */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {!selectedYear ? (
          // Year Selection
          years.map(year => (
            <button 
              key={year}
              onClick={() => setSelectedYear(year)}
              className="group aspect-square bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">{year}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">
                  {state.documents.filter(d => d.year === year).length} Records
                </p>
              </div>
            </button>
          ))
        ) : !selectedMonth ? (
          // Month Selection
          monthsForYear.map(month => (
            <button 
              key={month}
              onClick={() => setSelectedMonth(month)}
              className="group aspect-square bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Folder size={32} />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">{month}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">
                  {state.documents.filter(d => d.year === selectedYear && d.month === month).length} Records
                </p>
              </div>
            </button>
          ))
        ) : (
          // Document/Owner Selection
          filteredDocs.map(doc => (
            <Link 
              key={doc.id}
              to={`/document/${doc.id}`}
              className="group aspect-square bg-white border border-slate-200 rounded-2xl flex flex-col p-4 space-y-2 hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 rounded-xl flex items-center justify-center transition-colors">
                <Folder size={24} />
              </div>
              <div className="flex-1 flex flex-col justify-end overflow-hidden">
                <p className="font-bold text-slate-800 text-sm truncate">{doc.ownerName}</p>
                <p className="text-[10px] text-slate-500 truncate">{doc.permitNumber}</p>
                <p className="text-[9px] mt-1 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded w-fit">{doc.category}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {selectedYear && (
        <button 
          onClick={() => {
            if (selectedMonth) setSelectedMonth(null);
            else setSelectedYear(null);
          }}
          className="flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">Go Back</span>
        </button>
      )}
    </div>
  );
};

export default Bookshelf;
