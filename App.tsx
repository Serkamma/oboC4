
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bookshelf from './pages/Bookshelf';
import DocumentDetails from './pages/DocumentDetails';
import Upload from './pages/Upload';
import { AppState, DocumentStatus, DigitalDocument } from './types';
import { INITIAL_STATE } from './mockData';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('obo_archive_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('obo_archive_state', JSON.stringify(state));
  }, [state]);

  const updateDocumentStatus = (docId: string, status: DocumentStatus) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, status, isBorrowed: status === DocumentStatus.COMPLETED ? false : d.isBorrowed } : d),
      activityLogs: [
        { 
          id: `act_${Date.now()}`, 
          userId: 'u1', 
          userName: prev.currentUser.name, 
          action: 'Status Change', 
          timestamp: new Date().toLocaleString(), 
          details: `Changed document status to ${status}` 
        },
        ...prev.activityLogs
      ]
    }));
  };

  const markAsBorrowed = (docId: string, borrower: string, returnDate: string) => {
    setState(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, isBorrowed: true } : d),
      borrowLogs: [
        ...prev.borrowLogs,
        { id: `l_${Date.now()}`, documentId: docId, borrowerName: borrower, dateBorrowed: new Date().toISOString().split('T')[0], expectedReturnDate: returnDate }
      ],
      activityLogs: [
        { 
          id: `act_${Date.now()}`, 
          userId: 'u1', 
          userName: prev.currentUser.name, 
          action: 'Borrow', 
          timestamp: new Date().toLocaleString(), 
          details: `Document borrowed by ${borrower}` 
        },
        ...prev.activityLogs
      ]
    }));
  };

  const handleNewUpload = (newDoc: DigitalDocument) => {
    setState(prev => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
      activityLogs: [
        { 
          id: `act_${Date.now()}`, 
          userId: 'u1', 
          userName: prev.currentUser.name, 
          action: 'Upload', 
          timestamp: new Date().toLocaleString(), 
          details: `Uploaded new record: ${newDoc.filename}` 
        },
        ...prev.activityLogs
      ]
    }));
  };

  return (
    <Router>
      <Layout user={state.currentUser}>
        <Routes>
          <Route path="/" element={<Dashboard state={state} />} />
          <Route path="/bookshelf" element={<Bookshelf state={state} />} />
          <Route path="/document/:id" element={<DocumentDetails state={state} updateStatus={updateDocumentStatus} markBorrowed={markAsBorrowed} />} />
          <Route path="/upload" element={<Upload onSuccess={handleNewUpload} />} />
          <Route path="/records" element={<Bookshelf state={state} />} />
          <Route path="/reports" element={
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-800">Operational Reports</h2>
              <p className="text-slate-500">The reporting module is currently generating scheduled data visualizations.</p>
              <div className="animate-pulse flex space-x-4 justify-center">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 max-w-[200px] space-y-6 py-1">
                  <div className="h-2 bg-slate-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
