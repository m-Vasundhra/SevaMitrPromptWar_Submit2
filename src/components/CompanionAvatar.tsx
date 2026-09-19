import React from 'react';
import { AssistantVoiceState } from '../../shared/types.ts';
import { Sparkles, Mic, Volume2, ShieldAlert } from 'lucide-react';

interface CompanionAvatarProps {
  state: AssistantVoiceState;
  isHighRisk?: boolean;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({ state, isHighRisk }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Pulse Rings based on voice state */}
      {state === 'listening' && (
        <span className="absolute w-14 h-14 rounded-full bg-rose-400/40 animate-ping" />
      )}
      {state === 'speaking' && (
        <span className="absolute w-14 h-14 rounded-full bg-amber-400/40 animate-pulse" />
      )}
      {state === 'processing' && (
        <span className="absolute w-14 h-14 rounded-full bg-blue-400/40 animate-spin" />
      )}

      {/* Main Avatar Body */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md transition-all duration-300 ${
        isHighRisk 
          ? 'bg-amber-600 ring-4 ring-amber-300/60'
          : state === 'listening'
          ? 'bg-rose-600 ring-4 ring-rose-300'
          : state === 'speaking'
          ? 'bg-amber-600 ring-4 ring-amber-300'
          : state === 'processing'
          ? 'bg-blue-600 ring-4 ring-blue-300'
          : 'bg-amber-700 ring-2 ring-amber-200'
      }`}>
        {isHighRisk ? (
          <ShieldAlert className="w-6 h-6 animate-bounce text-white" />
        ) : state === 'listening' ? (
          <Mic className="w-6 h-6 animate-pulse text-white" />
        ) : state === 'speaking' ? (
          <Volume2 className="w-6 h-6 animate-pulse text-white" />
        ) : state === 'processing' ? (
          <Sparkles className="w-6 h-6 animate-spin text-white" />
        ) : (
          <span className="text-xl font-black font-serif">से</span>
        )}
      </div>

      {/* State badge indicator */}
      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white shadow-sm bg-emerald-500">
        ✓
      </div>
    </div>
  );
};
