import * as React from 'react';

interface JailbreakButtonProps {
  onClick: () => void;
}

export const JailbreakButton: React.FC<JailbreakButtonProps> = ({ onClick }) => {
  return (
    <div className="w-full flex justify-center">
      <button
        onClick={onClick}
        className="w-full max-w-[240px] py-6 bg-white text-black rounded-3xl shadow-2xl transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center gap-0.5"
      >
        <span className="text-[17px] font-semibold tracking-tight">Semi-Jailbreak</span>
      </button>
    </div>
  );
};