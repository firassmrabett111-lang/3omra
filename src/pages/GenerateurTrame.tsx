import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, Eye, Loader2 } from "lucide-react";

type Protocol = "modbus" | "can2a" | "can2b";

interface FrameBlock {
  id: string;
  label: string;
  value: string;
  color: "primary" | "secondary" | "orange" | "red" | "muted";
  widthClass: string;
}

export default function GenerateurTrame() {
  const [protocol, setProtocol] = useState<Protocol>("modbus");
  
  // Input states
  const [mbAddr, setMbAddr] = useState("01");
  const [mbFc, setMbFc] = useState("03");
  const [mbData, setMbData] = useState("00 6B 00 03");
  
  const [canId, setCanId] = useState("7FF");
  const [canRtr, setCanRtr] = useState("0");
  const [canDlc, setCanDlc] = useState("8");
  const [canData, setCanData] = useState("11 22 33 44 55 66 77 88");

  const [blocks, setBlocks] = useState<FrameBlock[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [calcSteps, setCalcSteps] = useState<{ algo: string; poly: string; input: string; currentCrc: string; finalCrc: string | null }>({
    algo: "", poly: "", input: "", currentCrc: "0x0000", finalCrc: null
  });

  const generateBlocks = () => {
    setIsSimulating(true);
    let newBlocks: FrameBlock[] = [];
    let hexToCalc = "";

    if (protocol === "modbus") {
      const addr = mbAddr.padStart(2, "0").toUpperCase();
      const fc = mbFc.padStart(2, "0").toUpperCase();
      const data = mbData.replace(/\s+/g, "").toUpperCase();
      hexToCalc = addr + fc + data;

      newBlocks.push({ id: "mb-addr", label: "Adresse", value: addr, color: "primary", widthClass: "min-w-[6rem]" });
      newBlocks.push({ id: "mb-fc", label: "Fonction", value: fc, color: "secondary", widthClass: "min-w-[6rem]" });
      if (data) {
        newBlocks.push({ id: "mb-data", label: "Données", value: data.match(/.{1,4}/g)?.join(" ") || data, color: "orange", widthClass: "min-w-[8rem] px-4" });
      }
      newBlocks.push({ id: "mb-crc", label: "CRC-16", value: "...", color: "red", widthClass: "min-w-[6rem]" });

    } else {
      const id = canId.toUpperCase();
      const rtr = canRtr;
      const dlc = canDlc;
      const data = canData.replace(/\s+/g, "").toUpperCase();
      hexToCalc = "CAN_SIM";

      newBlocks.push({ id: "can-sof", label: "SOF", value: "0", color: "muted", widthClass: "min-w-[4rem]" });
      newBlocks.push({ id: "can-id", label: `ID (${protocol === "can2a" ? "11" : "29"}b)`, value: id, color: "primary", widthClass: "min-w-[6rem]" });
      newBlocks.push({ id: "can-rtr", label: "RTR", value: rtr, color: "secondary", widthClass: "min-w-[4rem]" });
      newBlocks.push({ id: "can-ide", label: "IDE", value: protocol === "can2a" ? "0" : "1", color: "secondary", widthClass: "min-w-[4rem]" });
      newBlocks.push({ id: "can-dlc", label: "DLC", value: dlc, color: "orange", widthClass: "min-w-[4rem]" });
      if (data && rtr === "0") {
        newBlocks.push({ id: "can-data", label: "Données", value: data.match(/.{1,2}/g)?.join(" ") || data, color: "orange", widthClass: "min-w-[8rem] px-4" });
      }
      newBlocks.push({ id: "can-crc", label: "CRC-15", value: "...", color: "red", widthClass: "min-w-[6rem]" });
      newBlocks.push({ id: "can-ack", label: "ACK", value: "1", color: "muted", widthClass: "min-w-[4rem]" });
      newBlocks.push({ id: "can-eof", label: "EOF", value: "1111111", color: "muted", widthClass: "min-w-[5rem]" });
    }

    setBlocks([]);
    
    // Stagger blocks entry
    newBlocks.forEach((block, idx) => {
      setTimeout(() => {
        setBlocks(prev => [...prev, block]);
      }, idx * 150);
    });

    // Start CRC Calculation animation
    setTimeout(() => {
      startCrcSimulation(protocol, hexToCalc);
    }, newBlocks.length * 150 + 300);
  };

  const startCrcSimulation = (proto: Protocol, hexData: string) => {
    let finalCrc = "0000";
    if (proto === "modbus") {
      let bytes = [];
      for (let i = 0; i < hexData.length; i += 2) {
        bytes.push(parseInt(hexData.substring(i, i + 2), 16));
      }
      let crc = 0xFFFF;
      for (let pos = 0; pos < bytes.length; pos++) {
        crc ^= bytes[pos] || 0;
        for (let i = 8; i !== 0; i--) {
          if ((crc & 0x0001) !== 0) {
            crc >>= 1;
            crc ^= 0xA001;
          } else {
            crc >>= 1;
          }
        }
      }
      let crcHex = crc.toString(16).padStart(4, '0').toUpperCase();
      finalCrc = crcHex.substring(2, 4) + " " + crcHex.substring(0, 2);
    } else {
      finalCrc = Math.floor(Math.random() * 0x7FFF).toString(16).padStart(4, '0').toUpperCase();
    }

    setCalcSteps({
      algo: proto === "modbus" ? "CRC-16 (Modbus)" : "CRC-15 (CAN)",
      poly: proto === "modbus" ? "0xA001" : "0x4599",
      input: proto === "modbus" ? hexData : "Trame binaire brute...",
      currentCrc: "0x0000",
      finalCrc: null
    });

    let loops = 0;
    const interval = setInterval(() => {
      loops++;
      setCalcSteps(prev => ({ ...prev, currentCrc: "0x" + Math.floor(Math.random() * 65535).toString(16).padStart(4, '0').toUpperCase() }));
      if (loops > 20) {
        clearInterval(interval);
        setCalcSteps(prev => ({ ...prev, finalCrc }));
        setIsSimulating(false);
        
        // Update the block visually
        setBlocks(prev => prev.map(b => b.id.includes("crc") ? { ...b, value: finalCrc, color: "primary" } : b));
      }
    }, 50);
  };

  const colorMap = {
    primary: "border-[#00C9A7]/40 bg-[#00C9A7]/10 text-[#00C9A7]",
    secondary: "border-[#3D8BFF]/40 bg-[#3D8BFF]/10 text-[#3D8BFF]",
    orange: "border-[#FFB547]/40 bg-[#FFB547]/10 text-[#FFB547]",
    red: "border-[#FF6B6B]/40 bg-[#FF6B6B]/10 text-[#FF6B6B]",
    muted: "border-[#64748B]/40 bg-[#64748B]/10 text-[#64748B]"
  };

  const accentMap = {
    primary: "bg-[#00C9A7]",
    secondary: "bg-[#3D8BFF]",
    orange: "bg-[#FFB547]",
    red: "bg-[#FF6B6B]",
    muted: "bg-[#64748B]"
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Générateur de Trame Interactif</h1>
        <p className="text-[#64748B]">Saisie manuelle, construction animée et calcul CRC en temps réel.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="col-span-1 bg-[#111C35] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C9A7]/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
          
          <label className="block text-xs font-black text-[#64748B] uppercase tracking-widest mb-3">Protocole</label>
          <select 
            value={protocol} 
            onChange={(e) => setProtocol(e.target.value as Protocol)}
            className="w-full bg-[#060913] border border-[#1E293B] rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-[#00C9A7] focus:ring-1 focus:ring-[#00C9A7] outline-none transition-all mb-6 cursor-pointer"
          >
            <option value="modbus">Modbus RTU (CRC-16)</option>
            <option value="can2a">CAN 2.0A (Standard 11-bit)</option>
            <option value="can2b">CAN 2.0B (Extended 29-bit)</option>
          </select>

          <div className="space-y-4">
            {protocol === "modbus" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">Adresse Esclave (Hex)</label>
                  <input type="text" value={mbAddr} onChange={e => setMbAddr(e.target.value)} maxLength={2} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#00C9A7] outline-none uppercase transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">Code Fonction (Hex)</label>
                  <input type="text" value={mbFc} onChange={e => setMbFc(e.target.value)} maxLength={2} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#3D8BFF] outline-none uppercase transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">Données (Hex)</label>
                  <input type="text" value={mbData} onChange={e => setMbData(e.target.value)} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#FFB547] outline-none uppercase transition-colors" />
                </div>
              </motion.div>
            )}

            {protocol.startsWith("can") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">Identifiant ({protocol === "can2a" ? "11" : "29"}-bit Hex)</label>
                  <input type="text" value={canId} onChange={e => setCanId(e.target.value)} maxLength={protocol === "can2a" ? 3 : 8} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#00C9A7] outline-none uppercase transition-colors" />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">RTR</label>
                    <select value={canRtr} onChange={e => setCanRtr(e.target.value)} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#3D8BFF] outline-none transition-colors">
                      <option value="0">0 (Data)</option>
                      <option value="1">1 (Remote)</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">DLC</label>
                    <input type="number" min="0" max="8" value={canDlc} onChange={e => setCanDlc(e.target.value)} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#FFB547] outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-2">Données (Hex)</label>
                  <input type="text" value={canData} onChange={e => setCanData(e.target.value)} disabled={canRtr === "1"} className="w-full bg-[#060913] border border-[#1E293B] rounded-lg px-4 py-3 text-sm font-mono font-bold text-white focus:border-[#FFB547] outline-none uppercase transition-colors disabled:opacity-50" />
                </div>
              </motion.div>
            )}
          </div>

          <button 
            onClick={generateBlocks}
            disabled={isSimulating}
            className="w-full mt-8 bg-[#00C9A7]/10 hover:bg-[#00C9A7] text-[#00C9A7] hover:text-[#0A0F1E] disabled:opacity-50 disabled:hover:bg-[#00C9A7]/10 disabled:hover:text-[#00C9A7] border border-[#00C9A7]/20 hover:border-[#00C9A7] transition-all font-black text-xs uppercase tracking-widest py-4 rounded-xl flex justify-center items-center gap-2 group/btn shadow-[0_0_20px_rgba(0,201,167,0.1)] hover:shadow-[0_0_30px_rgba(0,201,167,0.4)]"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 group-hover/btn:animate-bounce" />}
            {isSimulating ? "Génération en cours..." : "Construire & Animer"}
          </button>
        </div>

        {/* Visualization & CRC Engine */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {/* Frame Track */}
          <div className="bg-[#111C35] border border-white/5 rounded-2xl p-6 flex flex-col h-[220px]">
            <h3 className="text-xs font-black text-[#64748B] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3D8BFF]" /> Visualisation de la Trame
            </h3>
            
            <div className="flex-1 flex items-center justify-start gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
              <AnimatePresence>
                {blocks.length === 0 && !isSimulating && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-[#64748B]/50 text-sm italic font-medium w-full text-center border border-dashed border-white/10 rounded-xl py-10"
                  >
                    Sélectionnez un protocole et cliquez sur "Construire & Animer"
                  </motion.div>
                )}
                {blocks.map((block) => (
                  <motion.div
                    key={block.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    className={`shrink-0 ${block.widthClass} bg-[#060913] border ${colorMap[block.color].split(' ')[0]} rounded-xl p-3 flex flex-col items-center justify-center relative shadow-lg`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 ${accentMap[block.color]} rounded-t-xl opacity-50`} />
                    <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest mb-1 text-center">{block.label}</span>
                    <motion.span 
                      key={block.value}
                      initial={{ scale: block.id.includes('crc') && block.value !== '...' ? 1.5 : 1 }}
                      animate={{ scale: 1 }}
                      className={`font-mono font-black text-sm ${colorMap[block.color].split(' ')[2]}`}
                    >
                      {block.value}
                    </motion.span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* CRC Engine */}
          <AnimatePresence>
            {(isSimulating || calcSteps.finalCrc) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0A0F1E]/80 border border-[#00C9A7]/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex-1"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00C9A7]" />
                <h4 className="text-[10px] font-black text-[#00C9A7] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Moteur de Calcul Cryptographique
                </h4>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-[#00C9A7] animate-ping" />
                  <span className="text-white font-bold">{calcSteps.algo} en cours d'exécution...</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-[#64748B] uppercase tracking-widest mb-1">Polynôme</div>
                    <div className="font-bold text-[#3D8BFF] font-mono">{calcSteps.poly}</div>
                  </div>
                  <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-[#64748B] uppercase tracking-widest mb-1">Données d'entrée</div>
                    <div className="font-bold text-[#FFB547] font-mono truncate" title={calcSteps.input}>{calcSteps.input}</div>
                  </div>
                </div>

                <div className="p-5 bg-[#060913] rounded-xl border border-white/10 text-center relative overflow-hidden">
                  {!calcSteps.finalCrc && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
                  )}
                  <div className="text-[10px] uppercase text-[#64748B] tracking-widest mb-2 relative z-10">Registre Shift / CRC Temp</div>
                  <motion.div 
                    key={calcSteps.finalCrc || calcSteps.currentCrc}
                    initial={{ scale: calcSteps.finalCrc ? 1.2 : 1 }}
                    animate={{ scale: 1 }}
                    className={`text-2xl font-black font-mono tracking-widest relative z-10 ${calcSteps.finalCrc ? 'text-[#00C9A7] drop-shadow-[0_0_15px_rgba(0,201,167,0.5)]' : 'text-white'}`}
                  >
                    {calcSteps.finalCrc || calcSteps.currentCrc}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
