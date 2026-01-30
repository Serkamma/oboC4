
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  History, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Share2
} from 'lucide-react';
import { AppState, DocumentStatus } from '../types';
import StatusBadge from '../components/StatusBadge';

interface DocumentDetailsProps {
  state: AppState;
  updateStatus: (docId: string, status: DocumentStatus) => void;
  markBorrowed: (docId: string, borrower: string, returnDate: string) => void;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ state, updateStatus, markBorrowed }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doc = state.documents.find(d => d.id === id);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [returnDate, setReturnDate] = useState('');

  if (!doc) return <div className="p-8 text-center text-slate-500">Document not found</div>;

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    markBorrowed(doc.id, borrowerName, returnDate);
    setIsBorrowing(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Records</span>
        </button>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Printer size={18} />
            <span className="text-sm font-bold">Print Record</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
            <Download size={18} />
            <span className="text-sm font-bold">Download PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Content / Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{doc.filename}</h3>
                <p className="text-sm text-slate-500">Uploaded on {doc.uploadDate} by Administrator</p>
              </div>
              <StatusBadge status={doc.status} />
            </div>
            <div className="aspect-[4/5] bg-slate-100 flex items-center justify-center relative overflow-hidden group">
              <img src={doc.versions[0].url} alt="Document Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <button className="bg-white p-4 rounded-full shadow-2xl text-blue-600 hover:scale-110 transition-transform">
                  <ExternalLink size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <h4 className="text-lg font-bold text-slate-800 mb-4">AI-Powered OCR Analysis</h4>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {doc.ocrText || "Perform OCR to extract text from this document. Click 'Process' in the action menu."}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
              <span>Owner Details</span>
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Owner Name</p>
                <p className="text-sm font-semibold text-slate-700">{doc.ownerName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Permit Number</p>
                <p className="text-sm font-semibold text-slate-700">{doc.permitNumber}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Category</p>
                <p className="text-sm font-semibold text-slate-700">{doc.category}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {doc.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Physical Location Card */}
          <div className="bg-slate-800 text-white rounded-3xl p-6 shadow-xl">
            <h4 className="font-bold mb-4 flex items-center space-x-2 text-blue-400">
              <MapPin size={18} />
              <span>Physical Location</span>
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Cabinet</p>
                <p className="text-xl font-bold">{doc.physicalLocation.cabinetNumber}</p>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Shelf</p>
                <p className="text-xl font-bold">{doc.physicalLocation.shelfNumber}</p>
              </div>
              <div className="col-span-2 bg-slate-700/50 p-3 rounded-2xl border border-slate-600">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-1">Folder Label</p>
                <p className="text-sm font-mono truncate">{doc.physicalLocation.folderLabel}</p>
              </div>
            </div>
          </div>

          {/* Borrowing Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
              <Share2 size={18} className="text-amber-500" />
              <span>Borrowing Status</span>
            </h4>
            {doc.isBorrowed ? (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <p className="text-sm font-bold text-amber-800">Currently Borrowed</p>
                  <p className="text-xs text-amber-600 mt-1">Expected return by July 12, 2024</p>
                </div>
                <button 
                  onClick={() => updateStatus(doc.id, DocumentStatus.COMPLETED)}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  Mark as Returned
                </button>
              </div>
            ) : isBorrowing ? (
              <form onSubmit={handleBorrow} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Borrower Name</label>
                  <input 
                    required 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" 
                    placeholder="Enter full name"
                    value={borrowerName}
                    onChange={e => setBorrowerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Return Date</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <button type="button" onClick={() => setIsBorrowing(false)} className="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md shadow-blue-200">Confirm</button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsBorrowing(true)}
                className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
              >
                <Share2 size={16} />
                <span>Borrow This File</span>
              </button>
            )}
          </div>

          {/* Issue Reporting */}
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
            <h4 className="text-red-800 font-bold mb-3 flex items-center space-x-2">
              <AlertTriangle size={18} />
              <span>Report Issue</span>
            </h4>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(doc.id, DocumentStatus.DAMAGED)} className="flex-1 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-50">Damaged</button>
              <button onClick={() => updateStatus(doc.id, DocumentStatus.MISSING)} className="flex-1 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900">Missing</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
