import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { functionCodes } from "@/data/modbusData";
import { ChevronDown } from "lucide-react";

export default function FunctionCodes() {
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">Function Codes</h2>
        <p className="text-sm text-[#64748B]">Codes fonction standard MODBUS avec types d'objets et modes d'acces</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border overflow-hidden"
        style={{ backgroundColor: "#111C35" }}
      >
        <div className="grid grid-cols-[80px_80px_1fr_140px_100px_40px] gap-4 px-5 py-3 border-b border-border text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          <span>Code</span>
          <span>Hex</span>
          <span>Fonction</span>
          <span>Type Objet</span>
          <span>Acces</span>
          <span></span>
        </div>

        {functionCodes.map((fc, i) => {
          const isExpanded = expandedCode === fc.code;
          const accessColor = fc.access === "READ" ? "#00C9A7" : "#FFB547";
          return (
            <motion.div
              key={fc.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <button
                data-testid={`fc-row-${fc.code}`}
                onClick={() => setExpandedCode(isExpanded ? null : fc.code)}
                className="w-full grid grid-cols-[80px_80px_1fr_140px_100px_40px] gap-4 px-5 py-3.5 items-center border-b border-border/50 hover:bg-[#0A0F1E]/30 transition-colors text-left cursor-pointer"
              >
                <span className="text-sm font-bold text-foreground">{fc.code}</span>
                <span className="font-mono text-sm" style={{ color: accessColor }}>{fc.hex}</span>
                <span className="text-sm text-[#94a3b8]">{fc.name}</span>
                <span className="text-xs text-[#64748B]">{fc.type}</span>
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full text-center w-fit"
                  style={{ backgroundColor: accessColor + "15", color: accessColor }}
                >
                  {fc.access}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 bg-[#0A0F1E]/40 border-b border-border grid grid-cols-2 gap-4">
                      <div className="rounded-lg border border-border p-3" style={{ backgroundColor: "#111C35" }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D8BFF] mb-2">Format Requete</p>
                        <p className="font-mono text-xs text-[#94a3b8]">{fc.reqFormat}</p>
                      </div>
                      <div className="rounded-lg border border-border p-3" style={{ backgroundColor: "#111C35" }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#00C9A7] mb-2">Format Reponse</p>
                        <p className="font-mono text-xs text-[#94a3b8]">{fc.resFormat}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
