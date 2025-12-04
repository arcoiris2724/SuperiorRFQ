import { ChevronDown, ChevronUp, ArrowUp, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface Step {
  instruction: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  maneuver: string | null;
}

interface Leg {
  stopIndex: number;
  startAddress: string;
  endAddress: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  steps: Step[];
}

interface Props {
  legs: Leg[];
  stopNames: string[];
}

const ManeuverIcon = ({ maneuver }: { maneuver: string | null }) => {
  if (!maneuver) return <ArrowUp className="w-4 h-4" />;
  if (maneuver.includes('left')) return <ArrowLeft className="w-4 h-4" />;
  if (maneuver.includes('right')) return <ArrowRight className="w-4 h-4" />;
  if (maneuver.includes('uturn')) return <RotateCcw className="w-4 h-4" />;
  return <ArrowUp className="w-4 h-4" />;
};

export default function RouteDirections({ legs, stopNames }: Props) {
  const [expandedLeg, setExpandedLeg] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {legs.map((leg, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedLeg(expandedLeg === i ? null : i)}
            className="w-full p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1A8B06] text-white text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="font-medium text-sm">
                  {i === 0 ? 'Start' : stopNames[i - 1] || `Stop ${i}`} → {stopNames[i] || `Stop ${i + 1}`}
                </p>
                <p className="text-xs text-gray-500">{leg.distance.text} • {leg.duration.text}</p>
              </div>
            </div>
            {expandedLeg === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {expandedLeg === i && (
            <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
              {leg.steps.map((step, j) => (
                <div key={j} className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <ManeuverIcon maneuver={step.maneuver} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700">{step.instruction}</p>
                    <p className="text-xs text-gray-400">{step.distance.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
