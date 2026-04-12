import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { requestFrame, responseFrame, exceptionFrame } from "@/data/modbusData";
import { Play, RotateCcw } from "lucide-react";

interface FrameField {
  name: string;
  hex: string;
  bytes: number;
  desc: string;
}

function FrameRow({ fields, color, label, animate, delay }: { fields: FrameField[]; color: string; label: string; animate: boolean; delay: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {fields.map((field, i) => (
          <motion.div
            key={field.name}
            initial={animate ? { opacity: 0, y: 20, scale: 0.8 } : { opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={animate ? { delay: delay + i * 0.12, duration: 0.4, type: "spring" } : { duration: 0 }}
            className="rounded-lg border p-3 min-w-[100px] text-center transition-all hover:scale-105"
            style={{ borderColor: color + "30", backgroundColor: color + "08" }}
          >
            <p className="text-[10px] font-medium text-[#64748B] mb-1.5 uppercase tracking-wide">{field.name}</p>
            <motion.p
              className="font-mono text-sm font-bold mb-1.5"
              style={{ color }}
              initial={animate ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={animate ? { delay: delay + i * 0.12 + 0.2, duration: 0.3 } : { duration: 0 }}
            >
              {field.hex}
            </motion.p>
            <p className="text-[10px] text-[#64748B]">{field.bytes} {field.bytes > 1 ? "octets" : "octet"}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyseTrame() {
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);

  const handleCapture = useCallback(() => {
    setCaptured(false);
    setCapturing(true);
    setTimeout(() => {
      setCaptured(true);
      setCapturing(false);
    }, 100);
  }, []);

  const handleReset = useCallback(() => {
    setCaptured(false);
    setCapturing(false);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Analyse de Trame</h2>
            <p className="text-sm text-[#64748B]">Decomposition des trames MODBUS TCP/IP champ par champ</p>
          </div>
          <div className="flex gap-2">
            <button
              data-testid="button-capture"
              onClick={handleCapture}
              disabled={capturing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
              style={{ backgroundColor: "#00C9A7", color: "#0A0F1E" }}
            >
              <Play className="w-4 h-4" />
              Capturer
            </button>
            <button
              data-testid="button-reset"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-[#64748B] hover:text-foreground transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border p-6 space-y-8"
        style={{ backgroundColor: "#111C35" }}
      >
        <div className="text-center mb-4">
          <span className="text-xs font-mono px-3 py-1 rounded-full border border-border text-[#64748B]">
            MBAP Header (7 octets) + PDU
          </span>
        </div>

        <FrameRow fields={requestFrame} color="#3D8BFF" label="Requete (Request)" animate={captured} delay={0} />
        <FrameRow fields={responseFrame} color="#00C9A7" label="Reponse (Response)" animate={captured} delay={0.8} />
        <FrameRow fields={exceptionFrame} color="#FF6B6B" label="Exception (Error)" animate={captured} delay={1.5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-xl border border-border p-5"
        style={{ backgroundColor: "#111C35" }}
      >
        <h3 className="text-sm font-bold text-foreground mb-3">Structure ADU MODBUS TCP/IP</h3>
        <div className="flex items-center gap-1">
          {[
            { label: "Transaction ID", w: "flex-[2]", color: "#3D8BFF" },
            { label: "Protocol ID", w: "flex-[2]", color: "#3D8BFF" },
            { label: "Length", w: "flex-[2]", color: "#3D8BFF" },
            { label: "Unit ID", w: "flex-1", color: "#3D8BFF" },
            { label: "Function Code", w: "flex-1", color: "#00C9A7" },
            { label: "Data", w: "flex-[3]", color: "#00C9A7" }
          ].map((seg, i) => (
            <div
              key={seg.label}
              className={`${seg.w} rounded-md p-2 text-center`}
              style={{ backgroundColor: seg.color + "15", borderBottom: `2px solid ${seg.color}` }}
            >
              <p className="text-[9px] font-medium" style={{ color: seg.color }}>{seg.label}</p>
            </div>
          ))}
        </div>
        <div className="flex mt-2 px-1">
          <div className="flex-[7] text-center">
            <span className="text-[10px] text-[#64748B]">MBAP Header</span>
          </div>
          <div className="flex-[4] text-center">
            <span className="text-[10px] text-[#64748B]">PDU</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
