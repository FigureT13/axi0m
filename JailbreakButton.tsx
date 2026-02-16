import * as React from 'react';

interface JailbreakButtonProps {
  onClick: () => void;
}

export const JailbreakButton: React.FC<JailbreakButtonProps> = ({ onClick }) => {
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        className="group relative w-full max-w-[260px] py-6 bg-white text-black rounded-[2rem] shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all duration-300 transform active:scale-95 hover:shadow-[0_25px_50px_rgba(255,255,255,0.15)] flex flex-col items-center justify-center"
      >
        <span className="text-[18px] font-bold tracking-tight">Semi-Jailbreak</span>
        <div className="absolute inset-0 rounded-[2rem] ring-4 ring-white/20 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </button>
    </div>
  );
};
