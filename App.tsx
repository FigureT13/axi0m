import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Loader2, Download, ShieldCheck, Cpu, Box } from 'lucide-react';
import { IOSAlert } from './IOSAlert';
import { JailbreakButton } from './JailbreakButton';
import { ASPEN_DATA_URI } from './constants';

type AppStep = 'initial' | 'processing' | 'installPrompt';

const App = () => {
  const [step, setStep] = useState<AppStep>('initial');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [deviceInfo, setDeviceInfo] = useState({ model: 'iPhone', version: 'iOS' });
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parseUA = () => {
      const ua = navigator.userAgent;
      let model = 'iPhone';
      let version = 'iOS';

      if (ua.match(/iPhone/)) model = 'iPhone';
      else if (ua.match(/iPad/)) model = 'iPad';
      else if (ua.match(/iPod/)) model = 'iPod';

      const versionMatch = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
      if (versionMatch) {
        version = `iOS ${versionMatch[1]}.${versionMatch[2]}${versionMatch[3] ? '.' + versionMatch[3] : ''}`;
      }
      
      setDeviceInfo({ model, version });
    };

    parseUA();
  }, []);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  const startJailbreak = async () => {
    setStep('processing');
    setLogs([]);
    
    addLog(`[SYSTEM] Initializing environment for ${deviceInfo.model}...`);
    await wait(800);
    addLog(`[BOOT] Detecting offsets for ${deviceInfo.version}...`);
    await wait(600);
    
    setCurrentMessage('Fetching Package Manager...');
    addLog("[NETWORK] Establishing secure link to repository...");
    setProgress(15);
    await wait(1200);
    addLog("GET /bin/ShortSileo-core.deb HTTP/1.1");
    addLog("Status: 200 OK (4.2 MB received)");
    addLog("[VERIFY] Integrity checksum matched.");

    setCurrentMessage(`Analyzing ${deviceInfo.version} Kernel`);
    addLog("[KERNEL] Scanning memory for system symbols...");
    setProgress(35);
    await wait(1500);
    addLog(`[INFO] Found kernel_base at 0xfffffff007004000`);
    addLog(`[INFO] Found system_offset_mask: 0x82f2c000`);

    setCurrentMessage('Generating Exploit Data');
    addLog("[EXPLOIT] Generating cryptographically signed blobs...");
    addLog("[EXPLOIT] Injecting sandbox bypass...");
    setProgress(65);
    await wait(2000);
    addLog("[SUCCESS] Privilege escalation: UID=0 (root)");
    addLog("[FILE] Remounting system as read-write...");
    addLog("[STAGING] Configuration injected successfully");

    setCurrentMessage('Manifesting Profile...');
    addLog("[SIGN] Packaging profile manifest...");
    setProgress(85);
    await wait(1500);
    addLog("[VERIFY] Developer profile signature: VALID");

    setCurrentMessage('Finalizing Installation');
    addLog("[CLEANUP] Finalizing environment variables...");
    addLog("[LINK] Preparing secure payload...");
    setProgress(100);
    await wait(1000);
    addLog("[READY] Bootstrap completed successfully.");

    setStep('installPrompt');
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center overflow-hidden selection:bg-blue-500/30">
      {/* Dynamic Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <div className="mt-24 text-center z-10 px-4 animate-fade-in">
        <h1 className="axi0m-text text-5xl tracking-tight mb-1">axi0m</h1>
        <p className="text-gray-500 text-[10px] font-semibold tracking-[0.4em] uppercase opacity-60">
          System Utility
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 z-10">
        {step === 'initial' && (
          <div className="text-center space-y-16 w-full max-w-sm animate-fade-in">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  {deviceInfo.model}
                </h2>
                <p className="text-gray-500 text-[13px] font-medium uppercase tracking-widest opacity-80">
                  {deviceInfo.version}
                </p>
              </div>
              <p className="text-gray-500 text-[14px] leading-relaxed max-w-[280px] mx-auto opacity-70">
                Ready to initiate system bootstrap procedure. It will take less than a minute.
              </p>
            </div>
            
            <JailbreakButton onClick={() => setIsWarningOpen(true)} />
          </div>
        )}

        {step === 'processing' && (
          <div className="w-full max-w-md space-y-10 flex flex-col items-center animate-fade-in px-4">
            <div className="text-center space-y-4 w-full">
              <div className="space-y-2">
                <p className="text-xl font-semibold text-white h-8 flex items-center justify-center text-center">
                  {currentMessage}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 opacity-60">Processing Sequence</p>
              </div>
              <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="w-full h-80 bg-white/[0.02] rounded-3xl border border-white/5 flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/5">
              <div className="flex-1 p-6 font-mono text-[11px] text-gray-400 overflow-y-auto flex flex-col gap-2.5">
                {logs.map((log, i) => (
                  <div key={i} className="terminal-line flex gap-3 opacity-90">
                    <span className="text-gray-600 shrink-0 select-none">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                    <span className="text-gray-300 tracking-tight">{log}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 shrink-0 select-none">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <div className="terminal-cursor" />
                </div>
                <div ref={terminalEndRef} />
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 text-gray-600 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Executing Kernel Task</span>
            </div>
          </div>
        )}

        {step === 'installPrompt' && (
          <div className="ios-blur p-9 rounded-[2.8rem] border border-white/10 w-full max-w-sm text-center shadow-2xl animate-fade-in">
            <div className="mb-9 flex justify-center">
              <div className="w-20 h-20 bg-white rounded-[22%] flex items-center justify-center shadow-2xl relative">
                <Download className="w-10 h-10 text-black" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white tracking-tight">Installation Ready</h2>
            
            <div className="mb-10 space-y-5">
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                System Package
              </div>
              <p className="text-gray-400 text-[14px] leading-relaxed px-1">
                Bootstrap sequence finished. Install <span className="text-white font-semibold">ShortSileo</span> to complete the environment setup.
              </p>
            </div>

            <div className="space-y-3">
              <a 
                href={ASPEN_DATA_URI}
                className="block w-full py-4.5 bg-white text-black font-bold rounded-2xl install-btn shadow-xl transition-all text-[16px] no-underline flex items-center justify-center active:scale-95"
              >
                Install ShortSileo
              </a>
              <button 
                onClick={() => setStep('initial')}
                className="w-full py-3 text-gray-500 font-medium text-[14px] active:opacity-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="h-20" /> {/* Bottom spacer for aesthetics */}

      <IOSAlert 
        isOpen={isWarningOpen}
        title="System Update"
        message="This operation will modify system settings to install the ShortSileo utility. Please confirm you wish to proceed."
        buttonText="Continue"
        onConfirm={() => {
          setIsWarningOpen(false);
          startJailbreak();
        }}
        onCancel={() => setIsWarningOpen(false)}
      />
    </div>
  );
};

export default App;