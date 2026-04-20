import { motion } from "framer-motion";
import { rtuVsTcpComparison } from "@/data/modbusData";

const rtuFrame = [
  { label: "Slave Address", hex: "0x01", bytes: 1, color: "#FFB547" },
  { label: "Function Code", hex: "0x03", bytes: 1, color: "#FFB547" },
  { label: "Data", hex: "...", bytes: "N", color: "#FFB547" },
  { label: "CRC-16", hex: "0xB5C4", bytes: 2, color: "#FF6B6B" }
];

const tcpFrame = [
  { label: "Transaction ID", hex: "0x0001", bytes: 2, color: "#3D8BFF" },
  { label: "Protocol ID", hex: "0x0000", bytes: 2, color: "#3D8BFF" },
  { label: "Length", hex: "0x0006", bytes: 2, color: "#3D8BFF" },
  { label: "Unit ID", hex: "0x01", bytes: 1, color: "#3D8BFF" },
  { label: "Function Code", hex: "0x03", bytes: 1, color: "#00C9A7" },
  { label: "Data", hex: "...", bytes: "N", color: "#00C9A7" }
];

function FrameBlock({ fields, title, color }: { fields: typeof rtuFrame; title: string; color: string }) {
  return (
    <div className="flex-1">
      <h4 className="text-sm font-bold mb-3" style={{ color }}>{title}</h4>
      <div className="flex gap-1.5 flex-wrap">
        {fields.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="rounded-lg border p-2.5 text-center min-w-[80px] hover:scale-105 transition-transform"
            style={{ borderColor: f.color + "30", backgroundColor: f.color + "08" }}
          >
            <p className="text-[9px] font-medium text-[#64748B] mb-1">{f.label}</p>
            <p className="font-mono text-xs font-bold" style={{ color: f.color }}>{f.hex}</p>
            <p className="text-[9px] text-[#64748B] mt-1">{f.bytes}B</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function RtuVsTcp() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">RTU vs TCP/IP</h2>
        <p className="text-sm text-[#64748B]">Comparaison des structures de trame et des caracteristiques</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border p-6"
        style={{ backgroundColor: "#111C35" }}
      >
        <h3 className="text-sm font-bold text-foreground mb-5">Structure des Trames</h3>
        <div className="flex gap-8">
          <FrameBlock fields={rtuFrame} title="MODBUS RTU" color="#FFB547" />
          <div className="w-px bg-border" />
          <FrameBlock fields={tcpFrame} title="MODBUS TCP/IP" color="#3D8BFF" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-xl border border-border overflow-hidden"
        style={{ backgroundColor: "#111C35" }}
      >
        <div className="grid grid-cols-3 gap-4 px-5 py-3 border-b border-border text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
          <span>Critere</span>
          <span>RTU</span>
          <span>TCP/IP</span>
        </div>
        {rtuVsTcpComparison.map((row, i) => (
          <motion.div
            key={row.criterion}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            className="grid grid-cols-3 gap-4 px-5 py-3 border-b border-border/50 hover:bg-[#0A0F1E]/30 transition-colors"
          >
            <span className="text-sm font-medium text-foreground">{row.criterion}</span>
            <span className="text-sm text-[#FFB547] font-mono">{row.rtu}</span>
            <span className="text-sm text-[#3D8BFF] font-mono">{row.tcp}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
