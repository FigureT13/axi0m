import * as React from 'react';

interface IOSAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
}

export const IOSAlert: React.FC<IOSAlertProps> = ({ 
  isOpen, 
  title, 
  message, 
  buttonText, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-[2px]">
      <div className="w-full max-w-[270px] ios-blur rounded-[14px] overflow-hidden flex flex-col shadow-2xl border border-white/10 animate-[scaleIn_0.2s_ease-out]">
        <div className="p-5 flex flex-col items-center text-center">
          <h3 className="text-[17px] font-semibold text-white leading-tight mb-1">{title}</h3>
          <p className="text-[13px] text-white/90 leading-tight font-normal">{message}</p>
        </div>
        <button 
          onClick={onConfirm}
          className="h-11 w-full border-t border-white/10 text-[17px] font-normal text-[#007AFF] active:bg-white/10 transition-colors"
        >
          {buttonText}
        </button>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(1.1); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};