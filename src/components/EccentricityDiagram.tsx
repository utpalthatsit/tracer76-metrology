import React from 'react';
import { EccentricityPosition, InstrumentSpecs } from '../types/metrology';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

interface EccentricityDiagramProps {
  positions: EccentricityPosition[];
  selectedPosNumber: number;
  onSelectPos: (posNumber: number) => void;
  specs: InstrumentSpecs;
  eccentricLoad: number;
}

export const EccentricityDiagram: React.FC<EccentricityDiagramProps> = ({
  positions,
  selectedPosNumber,
  onSelectPos,
  specs,
  eccentricLoad
}) => {
  const isCircular = specs.loadReceptorShape === 'circular';

  // Position definitions for rectangular pan
  // Pan coordinate space: 400 x 300
  const rectPosCoords: Record<number, { x: number; y: number; label: string; name: string }> = {
    1: { x: 200, y: 150, label: '1', name: 'Center' },
    2: { x: 90,  y: 220, label: '2', name: 'Front Left' },
    3: { x: 90,  y: 80,  label: '3', name: 'Back Left' },
    4: { x: 310, y: 80,  label: '4', name: 'Back Right' },
    5: { x: 310, y: 220, label: '5', name: 'Front Right' },
  };

  // Position definitions for circular pan
  const circPosCoords: Record<number, { x: number; y: number; label: string; name: string }> = {
    1: { x: 200, y: 150, label: '1', name: 'Center' },
    2: { x: 200, y: 80,  label: '2', name: 'North Quadrant' },
    3: { x: 270, y: 150, label: '3', name: 'East Quadrant' },
    4: { x: 200, y: 220, label: '4', name: 'South Quadrant' },
    5: { x: 130, y: 150, label: '5', name: 'West Quadrant' },
  };

  const coordsMap = isCircular ? circPosCoords : rectPosCoords;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-3 text-xs">
        <span className="font-semibold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
          <span>Load Receptor Placement</span>
          <span className="text-slate-400 font-normal">({isCircular ? 'Circular Pan' : 'Rectangular Pan'})</span>
        </span>
        <span className="text-blue-700 font-mono font-bold bg-blue-50 px-2 py-1 rounded border border-blue-200">
          Target Load L = {eccentricLoad} {specs.unit} (≈ Max/3)
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full max-w-[420px] aspect-[4/3] bg-white rounded-xl shadow-inner border border-slate-300 p-2 overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 400 300" className="w-full h-full select-none">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
            </pattern>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#64748b" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="400" height="300" fill="url(#grid)" />

          {/* Pan Outline */}
          {isCircular ? (
            <circle
              cx="200"
              cy="150"
              r="115"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth="3"
              strokeDasharray="4 2"
              filter="url(#shadow)"
            />
          ) : (
            <rect
              x="45"
              y="35"
              width="310"
              height="230"
              rx="16"
              fill="#f8fafc"
              stroke="#94a3b8"
              strokeWidth="3"
              filter="url(#shadow)"
            />
          )}

          {/* Guidelines / Axis */}
          <line x1="200" y1="45" x2="200" y2="255" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="55" y1="150" x2="345" y2="150" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* 5 Interactive Load Positions */}
          {[1, 2, 3, 4, 5].map((num) => {
            const posData = positions.find(p => p.positionNumber === num);
            const coord = coordsMap[num];
            const isSelected = selectedPosNumber === num;
            const hasData = !!posData && posData.indication !== undefined && posData.indication > 0;
            const isPass = posData?.isPass ?? true;

            let circleFill = '#ffffff';
            let circleStroke = '#cbd5e1';
            let textColor = '#475569';

            if (isSelected) {
              circleFill = '#3b82f6';
              circleStroke = '#1d4ed8';
              textColor = '#ffffff';
            } else if (hasData) {
              if (isPass) {
                circleFill = '#ecfdf5';
                circleStroke = '#10b981';
                textColor = '#047857';
              } else {
                circleFill = '#fef2f2';
                circleStroke = '#ef4444';
                textColor = '#b91c1c';
              }
            }

            return (
              <g
                key={num}
                onClick={() => onSelectPos(num)}
                className="cursor-pointer transition-transform duration-150 hover:scale-110"
                style={{ transformOrigin: `${coord.x}px ${coord.y}px` }}
              >
                {/* Target ring */}
                {isSelected && (
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r="32"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '6s', transformOrigin: `${coord.x}px ${coord.y}px` }}
                  />
                )}

                {/* Main point circle */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="24"
                  fill={circleFill}
                  stroke={circleStroke}
                  strokeWidth={isSelected ? '3' : '2'}
                  filter="url(#shadow)"
                />

                {/* Number Label */}
                <text
                  x={coord.x}
                  y={coord.y + 5}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize="15"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {num}
                </text>

                {/* Small indicator icon if recorded */}
                {hasData && (
                  <g transform={`translate(${coord.x + 10}, ${coord.y - 22})`}>
                    <circle cx="6" cy="6" r="7" fill={isPass ? '#10b981' : '#ef4444'} />
                    <text x="6" y="9.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      {isPass ? '✓' : '✗'}
                    </text>
                  </g>
                )}

                {/* Name Label */}
                <text
                  x={coord.x}
                  y={coord.y + (num === 1 ? -28 : 36)}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontWeight="600"
                >
                  {coord.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Help */}
      <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Selected</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Recorded & Pass</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
            <span>Pending</span>
          </span>
        </div>
        <div className="text-[11px] text-slate-400">Click any position to record / view error</div>
      </div>
    </div>
  );
};
