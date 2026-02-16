import * as React from 'react';

interface IOSAlertProps {
  isOpen: boolean;
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const IOSAlert: React.FC<IOSAlertProps> = ({ 
  isOpen, 
  title, 
  message, 
  buttonText, 
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="w-full max-w-[270px] ios-blur rounded-[14px] overflow-hidden flex flex-col shadow-2xl border border-white/5 animate-[iosScaleIn_0.2s_ease-out]">
        <div className="p-5 flex flex-col items-center text-center">
          <h3 className="text-[17px] font-semibold text-white leading-tight mb-1">{title}</h3>
          <p className="text-[13px] text-white/90 leading-tight font-normal">{message}</p>
        </div>
        <div className="flex border-t border-white/10">
          {onCancel && (
            <button 
              onClick={onCancel}
              className="h-11 flex-1 border-r border-white/10 text-[17px] font-normal text-[#007AFF] active:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={onConfirm}
            className={`h-11 flex-1 text-[17px] ${onCancel ? 'font-semibold' : 'font-normal'} text-[#007AFF] active:bg-white/10 transition-colors`}
          >
            {buttonText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes iosScaleIn {
          from { transform: scale(1.1); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};