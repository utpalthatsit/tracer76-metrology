import React, { useState } from 'react';
import { Layers, Plus, Calendar, AlertTriangle, CheckCircle2, ShieldAlert, FileText, Search } from 'lucide-react';
import { EquipmentRecord, UserProfile } from '../../types/metrology';
import { storageService } from '../../services/storage';

interface EquipmentViewProps {
  onNavigate: (path: string) => void;
  currentUser: UserProfile;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({ onNavigate, currentUser }) => {
  const [equipment, setEquipment] = useState<EquipmentRecord[]>(() => storageService.getEquipment());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEq, setNewEq] = useState<Partial<EquipmentRecord>>({
    name: '',
    type: 'standard_weight_set',
    serialNumber: '',
    accuracyClass: 'F1',
    calibrationCertNumber: '',
    calibratedBy: 'National Metrology Institute',
    calibrationDate: '2025-01-01',
    expiryDate: '2027-01-01',
    status: 'valid'
  });

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEq.name || !newEq.serialNumber) return;

    const record: EquipmentRecord = {
      id: `EQ-${Date.now().toString(36)}`,
      name: newEq.name!,
      type: newEq.type as any,
      serialNumber: newEq.serialNumber!,
      accuracyClass: newEq.accuracyClass,
      calibrationCertNumber: newEq.calibrationCertNumber || 'CAL-2025-001',
      calibratedBy: newEq.calibratedBy || 'National Lab',
      calibrationDate: newEq.calibrationDate || '2025-01-01',
      expiryDate: newEq.expiryDate || '2027-01-01',
      status: (new Date(newEq.expiryDate || '') < new Date() ? 'expired' : 'valid') as any
    };

    const updated = [record, ...equipment];
    storageService.saveEquipment(updated);
    setEquipment(updated);
    setShowAddModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase">
            <Layers className="w-4 h-4" />
            <span>Traceable Calibration Standards Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Reference Weights & Measurement Instruments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ISO/IEC 17025 equipment traceability. Expired items are strictly blocked from test allocation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Standard Weight / Sensor</span>
        </button>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Standard / Equipment Name</th>
                <th className="py-3 px-4">Serial No.</th>
                <th className="py-3 px-4">Accuracy Class</th>
                <th className="py-3 px-4">Calibration Certificate</th>
                <th className="py-3 px-4">Calibrated By</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {equipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {eq.name}
                    <span className="block text-[10px] text-slate-400 capitalize font-normal">{eq.type.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">{eq.serialNumber}</td>
                  <td className="py-3.5 px-4 text-blue-700 font-semibold">{eq.accuracyClass || '-'}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{eq.calibrationCertNumber}</td>
                  <td className="py-3.5 px-4 text-slate-600">{eq.calibratedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800">{eq.expiryDate}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      eq.status === 'valid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : eq.status === 'due_soon'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}>
                      {eq.status === 'valid' ? 'Valid' : eq.status === 'due_soon' ? 'Due Soon' : 'Expired (Blocked)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding new equipment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Register Reference Standard</h3>
            <form onSubmit={handleAddEquipment} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Equipment / Standard Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Class F1 Weight Set (1g - 10kg)"
                  value={newEq.name}
                  onChange={(e) => setNewEq({ ...newEq, name: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Serial Number</label>
                <input
                  required
                  type="text"
                  placeholder="SN-2025-..."
                  value={newEq.serialNumber}
                  onChange={(e) => setNewEq({ ...newEq, serialNumber: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Accuracy Class</label>
                  <input
                    type="text"
                    placeholder="E2, F1, M1..."
                    value={newEq.accuracyClass}
                    onChange={(e) => setNewEq({ ...newEq, accuracyClass: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Calibration Cert #</label>
                  <input
                    type="text"
                    placeholder="CAL-..."
                    value={newEq.calibrationCertNumber}
                    onChange={(e) => setNewEq({ ...newEq, calibrationCertNumber: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Calibration Date</label>
                  <input
                    type="date"
                    value={newEq.calibrationDate}
                    onChange={(e) => setNewEq({ ...newEq, calibrationDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newEq.expiryDate}
                    onChange={(e) => setNewEq({ ...newEq, expiryDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Save Standard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
