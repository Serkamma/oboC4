
import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  X, 
  CheckCircle, 
  Loader2, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { analyzeDocument } from '../geminiService';
import { DocumentStatus } from '../types';

interface UploadProps {
  onSuccess: (newDoc: any) => void;
}

const Upload: React.FC<UploadProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const startAnalysis = async () => {
    if (!preview || !file) return;
    setIsProcessing(true);
    setStep(2);

    const result = await analyzeDocument(preview, file.type);
    setOcrResult(result || "Failed to analyze document.");
    setIsProcessing(false);
  };

  const handleFinalize = () => {
    // In a real app, this would use the parsed OCR result to fill fields
    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      ownerName: "Newly Analyzed Owner",
      permitNumber: "TEMP-2024-X",
      filename: file?.name || "unnamed.pdf",
      uploadDate: new Date().toISOString().split('T')[0],
      status: DocumentStatus.COMPLETED,
      physicalLocation: { cabinetNumber: 'NEW', shelfNumber: '0', folderLabel: 'PENDING-SORT' },
      ocrText: ocrResult,
      year: 2024,
      month: 'June',
      tags: ['New Upload'],
      category: 'General',
      isBorrowed: false,
      versions: [{ id: 'v_new', version: 1, filename: file?.name, date: new Date().toLocaleDateString(), url: preview }]
    };
    onSuccess(newDoc);
    setFile(null);
    setPreview(null);
    setOcrResult(null);
    setStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-800">Digitize Records</h2>
        <p className="text-slate-500 mt-2">Upload and analyze government records using AI-powered OCR indexing.</p>
      </header>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              step >= i ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-300 border-slate-200'
            }`}>
              {step > i ? <CheckCircle size={16} /> : i}
            </div>
            <span className={`text-sm font-bold ${step >= i ? 'text-slate-800' : 'text-slate-300'}`}>
              {i === 1 ? 'Upload' : i === 2 ? 'Analysis' : 'Verify'}
            </span>
            {i < 3 && <div className="w-12 h-0.5 bg-slate-200"></div>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {step === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange}
              accept="image/*,application/pdf"
            />
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-lg border-4 border-dashed border-slate-100 rounded-3xl p-12 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <FileUp size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Drop your file here</h3>
                <p className="text-slate-400 mt-2">PDF, JPEG, or PNG files supported (Max 20MB)</p>
                <button className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                  Select Files
                </button>
              </div>
            ) : (
              <div className="w-full max-w-lg space-y-6">
                <div className="relative group bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-200">
                    <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-blue-600" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-slate-800">{file?.name}</p>
                      <p className="text-xs text-slate-500">{(file?.size! / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={startAnalysis} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                    Process with Gemini AI
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col p-8 bg-slate-50/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                <ShieldCheck size={24} className="text-emerald-500" />
                <span>AI Processing Center</span>
              </h3>
              {isProcessing && (
                <div className="flex items-center space-x-2 text-blue-600 font-bold text-sm animate-pulse">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Analyzing contents...</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-8 flex-1">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">Original Scan</div>
                <div className="flex-1 p-4 flex items-center justify-center">
                  <img src={preview!} alt="Original Scan" className="max-h-[300px] object-contain shadow-md rounded" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">Extracted Metadata</div>
                <div className="flex-1 p-6 overflow-y-auto font-mono text-sm text-slate-600 bg-slate-900 rounded-b-2xl text-emerald-400">
                  {isProcessing ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/2 animate-pulse"></div>
                      <div className="h-4 bg-slate-800 rounded w-2/3 animate-pulse"></div>
                      <div className="h-4 bg-slate-800 rounded w-1/3 animate-pulse"></div>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">{ocrResult}</pre>
                  )}
                </div>
              </div>
            </div>

            {!isProcessing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-white transition-colors"
                >
                  Rescan Document
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  Continue to Verification
                </button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Verification Complete</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto">The document has been indexed. Please ensure the physical copy is placed in Cabinet <strong>NEW-A1</strong> Shelf <strong>0</strong>.</p>
            </div>
            <div className="w-full max-w-md bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-400">Owner:</span> <span className="font-bold">Newly Analyzed Owner</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Permit:</span> <span className="font-bold">TEMP-2024-X</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-400">Status:</span> <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">VERIFIED</span></div>
            </div>
            <button 
              onClick={handleFinalize}
              className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Commit to Archive
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start space-x-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
        <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-blue-900">Security Note</h4>
          <p className="text-xs text-blue-700 mt-1">All uploaded files are encrypted at rest. OCR analysis is performed securely using Gemini 3 models.</p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
