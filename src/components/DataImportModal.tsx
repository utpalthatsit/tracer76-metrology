import React, { useState } from 'react';
import { X, FileSpreadsheet, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { parseSpreadsheetData } from '../services/webSerialSimulator';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: { nominalLoad: number; indication: number; addedDeltaL: number }[]) => void;
  unit?: string;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
  unit = 'kg'
}) => {
  const [pasteText, setPasteText] = useState('');
  const [parsedRows, setParsedRows] = useState<{ nominalLoad: number; indication: number; addedDeltaL: number }[]>([]);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setPasteText(text);
    const parsed = parseSpreadsheetData(text);
    setParsedRows(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleTextChange(content);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    const sample = `0.000\t0.000\t0.0025
0.100\t0.100\t0.0025
2.500\t2.500\t0.0024
5.000\t5.000\t0.0023
10.000\t10.000\t0.0021
15.000\t15.000\t0.0020
10.000\t10.000\t0.0022
5.000\t5.000\t0.0024
2.500\t2.500\t0.0025
0.100\t0.100\t0.0025
0.000\t0.000\t0.0025`;
    handleTextChange(sample);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2 text-slate-800">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base">Import Test Data (CSV / Excel Paste)</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">
              Format: <span className="font-mono font-semibold">Load (L), Indication (I), Added Load (ΔL)</span>
            </span>
            <button
              onClick={loadSampleData}
              type="button"
              className="text-blue-600 hover:underline font-semibold"
            >
              Insert sample 11-point sequence
            </button>
          </div>

          {/* Textarea */}
          <textarea
            value={pasteText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={6}
            placeholder={`Paste directly from Excel or CSV here...\nExample:\n0.000, 0.000, 0.0025\n2.500, 2.500, 0.0024\n15.000, 15.000, 0.0020`}
            className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {/* File Upload drag */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
            <input
              type="file"
              accept=".csv,.txt,.tsv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <span className="text-xs text-slate-600 font-medium">
              Click to choose CSV file or drag & drop here
            </span>
          </div>

          {/* Parsed Preview */}
          {parsedRows.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Preview Parsed Rows ({parsedRows.length} points detected):</span>
                <span className="text-emerald-700 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid format</span>
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto font-mono text-[11px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-200">
                      <th className="py-1">#</th>
                      <th className="py-1">Load L ({unit})</th>
                      <th className="py-1">Indication I ({unit})</th>
                      <th className="py-1">Added ΔL ({unit})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-0.5 text-slate-400">{i + 1}</td>
                        <td className="py-0.5 font-bold text-slate-800">{r.nominalLoad.toFixed(4)}</td>
                        <td className="py-0.5 text-slate-700">{r.indication.toFixed(4)}</td>
                        <td className="py-0.5 text-slate-700">{r.addedDeltaL.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (parsedRows.length > 0) {
                onImport(parsedRows);
                onClose();
              }
            }}
            disabled={parsedRows.length === 0}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
          >
            Import {parsedRows.length} Rows
          </button>
        </div>

      </div>
    </div>
  );
};
