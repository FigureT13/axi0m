import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Loader2, Download } from 'lucide-react';
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
    // Parse User Agent for device info
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
  const randTime = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min) * 1000;

  const startJailbreak = async () => {
    setStep('processing');
    setLogs([]);
    
    addLog(`initializing axi0m environment for ${deviceInfo.model}...`);
    await wait(800);
    addLog(`detecting offsets for ${deviceInfo.version}...`);
    await wait(500);
    
    setCurrentMessage('Fetching Package Manager...');
    addLog("connecting to secure package repository...");
    setProgress(15);
    await wait(randTime(1, 1.5));
    addLog("GET /bin/ShortSileo-core.deb HTTP/1.1");
    addLog("status: 200 OK (4.2 MB received)");
    addLog("integrity verification: checksum matched.");

    setCurrentMessage(`Getting Offsets for ${deviceInfo.version}`);
    addLog("scanning kernel memory for symbols...");
    setProgress(40);
    await wait(randTime(1, 1.5));
    addLog("found kernel_base at 0xfffffff007004000");
    addLog("found system_offset_mask: 0x82f2c000");

    setCurrentMessage('Generating Exploit Data');
    addLog("generating cryptographically signed blobs...");
    addLog("writing configuration to /var/tmp/fs...");
    setProgress(70);
    await wait(randTime(1, 1.5));
    addLog("privilege escalation: success (UID=0)");
    addLog("remounting file system as read-write...");
    addLog("data configuration injected into sandbox.");

    setCurrentMessage('Manifesting Profile...');
    addLog("packaging profile manifest for deployment...");
    setProgress(90);
    await wait(randTime(1, 1.5));
    addLog("developer profile signature: VALID");

    setCurrentMessage('Finalizing Installation Data');
    addLog("finalizing environment variables...");
    addLog("preparing secure download link...");
    setProgress(100);
    await wait(800);
    addLog("bootstrap completed successfully.");

    setStep('installPrompt');
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center overflow-hidden">
      <div className="mt-16 text-center z-10 px-4">
        <h1 className="axi0m-text text-4xl tracking-tight">axi0m</h1>
        <p className="text-gray-500 text-[10px] font-normal mt-1 tracking-[0.2em] uppercase">System Utility</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 z-10">
        {step === 'initial' && (
          <div className="text-center space-y-16 w-full max-w-xs animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight text-white">{deviceInfo.model} — {deviceInfo.version}</h2>
              <p className="text-gray-500 text-xs font-normal leading-relaxed">
                Version 5.0 build<br/>
                All system requirements met.
              </p>
            </div>
            
            <JailbreakButton onClick={() => setIsWarningOpen(true)} />
          </div>
        )}

        {step === 'processing' && (
          <div className="w-full max-w-md space-y-8 flex flex-col items-center animate-fade-in">
            <div className="text-center space-y-4 w-full">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Operation in progress</p>
                <p className="text-lg font-normal text-white h-12 flex items-center justify-center text-center leading-snug px-4">
                  {currentMessage}
                </p>
              </div>
              <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="w-full h-64 bg-[#0a0a0a] rounded-xl border border-white/10 flex flex-col shadow-2xl overflow-hidden ring-1 ring-white/5">
              <div className="flex-1 p-4 font-mono text-[11px] text-[#A6ACCD] overflow-y-auto flex flex-col gap-1.5">
                {logs.map((log, i) => (
                  <div key={i} className="terminal-line leading-tight">
                    <span className="text-[#89DDFF] mr-2">➜</span>
                    <span className="text-[#A6ACCD]">{log}</span>
                  </div>
                ))}
                <div className="flex items-center">
                  <span className="text-[#89DDFF] mr-2">➜</span>
                  <div className="terminal-cursor" />
                </div>
                <div ref={terminalEndRef} />
              </div>
            </div>
            
            <Loader2 className="w-6 h-6 text-gray-600 animate-spin" />
          </div>
        )}

        {step === 'installPrompt' && (
          <div className="ios-blur p-8 rounded-[2.5rem] border border-white/10 w-full max-w-sm text-center shadow-2xl animate-fade-in">
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-white rounded-[20%] flex items-center justify-center shadow-2xl">
                <Download className="w-10 h-10 text-black" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-2 text-white tracking-tight">Installation Ready</h2>
            
            <div className="mb-10 space-y-4">
              <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-semibold text-red-500 uppercase tracking-widest">
                CRITICAL ACTION REQUIRED
              </div>
              <p className="text-gray-400 text-[13px] font-normal leading-relaxed px-2">
                Would you like to Install ShortSileo (CRITICAL). Without ShortSileo you won't be able to install packages.
              </p>
            </div>

            <div className="space-y-2">
              <a 
                href={ASPEN_DATA_URI}
                className="block w-full py-4 bg-white text-black font-semibold rounded-2xl install-btn shadow-lg transition-transform text-[15px] no-underline flex items-center justify-center"
              >
                Install ShortSileo
              </a>
              <button 
                onClick={() => setStep('initial')}
                className="w-full py-4 text-gray-500 font-normal text-[14px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <IOSAlert 
        isOpen={isWarningOpen}
        title="WARNING"
        message="You are about to simulate a jailbreak environment to install the ShortSileo package manager."
        buttonText="Okay"
        onConfirm={() => {
          setIsWarningOpen(false);
          startJailbreak();
        }}
      />
    </div>
  );
};

export default App;