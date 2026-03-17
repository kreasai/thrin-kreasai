import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame } from 'motion/react';
import { Gift, Coins, Sparkles, Moon, Star, Hand, Settings, X } from 'lucide-react';

const basePrizes = [
  { value: 2000, color: '#6b7280', label: '2K', fullLabel: 'Rp 2.000' },
  { value: 5000, color: '#b45309', label: '5K', fullLabel: 'Rp 5.000' },
  { value: 10000, color: '#7e22ce', label: '10K', fullLabel: 'Rp 10.000' },
  { value: 20000, color: '#15803d', label: '20K', fullLabel: 'Rp 20.000' },
  { value: 50000, color: '#1d4ed8', label: '50K', fullLabel: 'Rp 50.000' },
  { value: 100000, color: '#b91c1c', label: '100K', fullLabel: 'Rp 100.000' },
];

const Confetti = () => {
  const pieces = Array.from({ length: 50 });
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 2;
        const color = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#a855f7'][Math.floor(Math.random() * 5)];
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${left}vw`, rotate: 0, opacity: 1 }}
            animate={{ y: '100vh', x: `${left + (Math.random() * 20 - 10)}vw`, rotate: 360, opacity: 0 }}
            transition={{ duration, delay, ease: 'linear' }}
            className="absolute top-0 w-3 h-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
};

export default function App() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<typeof basePrizes[0] | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<1 | 2 | 3>(3);
  const [difficulty, setDifficulty] = useState<'mudah' | 'sulit'>('mudah');
  const [enabledIndices, setEnabledIndices] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  
  const rotation = useMotionValue(0);

  const togglePrize = (index: number) => {
    if (enabledIndices.includes(index)) {
      if (enabledIndices.length > 2) { // Minimal 2 nominal aktif
        setEnabledIndices(enabledIndices.filter(i => i !== index));
      }
    } else {
      setEnabledIndices([...enabledIndices, index].sort());
    }
  };

  const filteredPrizes = basePrizes.filter((_, i) => enabledIndices.includes(i));
  const activePrizes = difficulty === 'mudah' ? filteredPrizes : [...filteredPrizes, ...filteredPrizes];
  const sliceAngle = 360 / activePrizes.length;
  const gradient = activePrizes.map((p, i) => `${p.color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`).join(', ');

  useAnimationFrame((time, delta) => {
    if (isSpinning) {
      const speedMap = { 1: 0.4, 2: 0.6, 3: 0.85 };
      rotation.set(rotation.get() + delta * speedMap[speedLevel]);
    }
  });

  const handleStart = () => {
    setResult(null);
    setIsSpinning(true);
  };

  const handleStop = () => {
    setIsSpinning(false);
    const currentRot = rotation.get();
    
    const normalizedRotation = (360 - (currentRot % 360)) % 360;
    const winnerIndex = Math.floor(((normalizedRotation + sliceAngle / 2) % 360) / sliceAngle) % activePrizes.length;
    
    setResult(activePrizes[winnerIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-teal-900 flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans">
      {/* Settings Button */}
      <button 
        onClick={() => !isSpinning && setShowSettings(true)}
        disabled={isSpinning}
        className="absolute top-4 right-4 z-40 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Settings size={28} />
      </button>

      {/* Background decorations */}
      <div className="absolute top-10 left-10 text-yellow-400/20 animate-pulse"><Moon size={120} /></div>
      <div className="absolute bottom-20 right-10 text-yellow-400/20 animate-pulse" style={{ animationDelay: '1s' }}><Star size={80} /></div>
      <div className="absolute top-40 right-20 text-yellow-400/10"><Sparkles size={60} /></div>
      <div className="absolute bottom-40 left-20 text-yellow-400/10"><Sparkles size={40} /></div>
      
      <div className="z-10 flex flex-col items-center w-full max-w-md">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-2 drop-shadow-lg tracking-tight">
            THRin
          </h1>
          <p className="text-emerald-100 text-sm font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm inline-block">
            Uji ketangkasanmu, stop di nominal terbesar!
          </p>
        </motion.div>

        {/* Wheel Container */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-80 h-80 md:w-96 md:h-96 mb-12"
        >
          {/* Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 text-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22L2 2h20L12 22z" />
            </svg>
          </div>

          {/* Wheel */}
          <div className="w-full h-full rounded-full border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.4)] relative overflow-hidden bg-emerald-900">
            <motion.div
              className="w-full h-full rounded-full relative"
              style={{ 
                background: `conic-gradient(from -${sliceAngle / 2}deg, ${gradient})`,
                rotate: rotation 
              }}
            >
              {/* Slice separators */}
              {activePrizes.map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 w-1 h-1/2 bg-yellow-400/50 -translate-x-1/2 z-10 origin-bottom"
                  style={{ transform: `rotate(${sliceAngle / 2 + i * sliceAngle}deg)` }}
                />
              ))}

              {activePrizes.map((p, i) => (
                <div key={i} className="absolute inset-0 flex justify-center z-20" style={{ transform: `rotate(${i * sliceAngle}deg)` }}>
                  <span className={`${difficulty === 'sulit' ? 'pt-6 text-base md:text-lg' : 'pt-8 text-2xl md:text-3xl'} font-extrabold text-white tracking-wider`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                    {p.label}
                  </span>
                </div>
              ))}
            </motion.div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-4 border-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center">
              <div className="w-6 h-6 bg-emerald-700 rounded-full shadow-inner"></div>
            </div>
          </div>
        </motion.div>

        {/* Start/Stop Button */}
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={isSpinning ? handleStop : handleStart}
          className={`px-10 py-5 font-black text-2xl rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-b-4 active:border-b-0 active:translate-y-1 ${
            isSpinning 
              ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-700' 
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-emerald-950 border-yellow-600'
          }`}
        >
          {isSpinning ? (
            <>
              <Hand size={28} /> STOP!
            </>
          ) : (
            <>
              <Gift size={28} /> Mulai Putar!
            </>
          )}
        </motion.button>

        {/* Result Modal */}
        <AnimatePresence>
          {result && !isSpinning && (
            <>
              <Confetti />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.8, y: 50, rotate: -5 }}
                  animate={{ scale: 1, y: 0, rotate: 0 }}
                  exit={{ scale: 0.8, y: 50, rotate: 5 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden border-4 border-yellow-400"
                >
                  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-emerald-500 to-teal-600 -z-10"></div>
                  
                  <motion.div 
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-28 h-28 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-xl mt-2"
                  >
                    <Coins size={56} className="text-emerald-900" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-black text-gray-800 mb-2">Alhamdulillah!</h2>
                  <p className="text-gray-600 mb-4 font-medium">Kamu dapat THR sebesar:</p>
                  
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="text-5xl font-extrabold text-emerald-600 mb-8 drop-shadow-sm"
                  >
                    {result.fullLabel}
                  </motion.div>
                  
                  <button
                    onClick={() => setResult(null)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xl rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg active:scale-95"
                  >
                    Coba Lagi
                  </button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowSettings(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Settings size={24} className="text-emerald-600" /> Pengaturan
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Kecepatan Putaran</label>
                    <div className="flex gap-2">
                      {[
                        { level: 1, label: '1x', desc: 'Lambat' },
                        { level: 2, label: '2x', desc: 'Sedang' },
                        { level: 3, label: '3x', desc: 'Cepat' }
                      ].map((opt) => (
                        <button
                          key={opt.level}
                          onClick={() => setSpeedLevel(opt.level as 1 | 2 | 3)}
                          className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center ${
                            speedLevel === opt.level 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                              : 'border-gray-200 hover:border-emerald-200 text-gray-600'
                          }`}
                        >
                          <span className="font-black text-lg">{opt.label}</span>
                          <span className="text-xs font-medium">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Tingkat Kesulitan</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDifficulty('mudah')}
                        className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center ${
                          difficulty === 'mudah' 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-200 hover:border-emerald-200 text-gray-600'
                        }`}
                      >
                        <span className="font-black text-lg">Mudah</span>
                        <span className="text-xs font-medium text-center mt-1">{enabledIndices.length} Potongan</span>
                      </button>
                      <button
                        onClick={() => setDifficulty('sulit')}
                        className={`flex-1 py-3 px-2 rounded-xl border-2 transition-all flex flex-col items-center ${
                          difficulty === 'sulit' 
                            ? 'border-red-500 bg-red-50 text-red-700' 
                            : 'border-gray-200 hover:border-red-200 text-gray-600'
                        }`}
                      >
                        <span className="font-black text-lg">Sulit</span>
                        <span className="text-xs font-medium text-center mt-1">{enabledIndices.length * 2} Potongan</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Nominal Aktif (Min. 2)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {basePrizes.map((p, i) => {
                        const isActive = enabledIndices.includes(i);
                        return (
                          <button
                            key={i}
                            onClick={() => togglePrize(i)}
                            className={`py-2 px-1 rounded-xl border-2 text-sm font-bold transition-all ${
                              isActive 
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                                : 'border-gray-200 bg-gray-50 text-gray-400 hover:border-emerald-200'
                            }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Simpan & Tutup
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Credit */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-emerald-100/60 text-xs font-medium tracking-wider">
          Games by <a href="https://kreasai.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">KREASAI.COM</a>
        </p>
      </div>
    </div>
  );
}
