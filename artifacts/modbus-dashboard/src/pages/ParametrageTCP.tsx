import { motion } from "framer-motion";
import { tcpParams } from "@/data/modbusData";
import { Zap, HeartPulse, RefreshCw, Database } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, HeartPulse, RefreshCw, Database
};

const paramColors = ["#00C9A7", "#FF6B6B", "#3D8BFF", "#FFB547"];

export default function ParametrageTCP() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">Parametrage TCP/IP</h2>
        <p className="text-sm text-[#64748B]">Options de socket recommandees pour les communications MODBUS TCP</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {tcpParams.map((param, i) => {
          const Icon = iconMap[param.icon];
          const color = paramColors[i];
          return (
            <motion.div
              key={param.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="rounded-xl border border-border p-6"
              style={{ backgroundColor: "#111C35" }}
              data-testid={`tcp-${param.name}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span
                  className="text-xs font-bold font-mono px-3 py-1 rounded-full"
                  style={{ backgroundColor: color + "15", color }}
                >
                  {param.value}
                </span>
              </div>
              <h3 className="font-mono text-lg font-bold text-foreground mb-3">{param.name}</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{param.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-xl border border-border p-6"
        style={{ backgroundColor: "#111C35" }}
      >
        <h3 className="text-sm font-bold text-foreground mb-4">Mecanisme Keep Alive</h3>
        <div className="relative h-20">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          {[0, 25, 50, 75, 100].map((pos, i) => (
            <motion.div
              key={pos}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.15, type: "spring" }}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${pos}%` }}
            >
              <div className="w-3 h-3 rounded-full border-2" style={{
                borderColor: i === 4 ? "#FF6B6B" : "#00C9A7",
                backgroundColor: i === 4 ? "#FF6B6B" + "30" : "#00C9A7" + "30"
              }} />
              <p className="text-[9px] text-[#64748B] mt-3 -ml-4 w-16 text-center font-mono">
                {i === 0 ? "T=0" : i === 4 ? "Timeout" : `Sonde ${i}`}
              </p>
            </motion.div>
          ))}
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={`arrow-${i}`}
              initial={{ width: 0 }}
              animate={{ width: "25%" }}
              transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
              className="absolute top-1/2 h-px"
              style={{
                left: `${i * 25}%`,
                backgroundColor: i === 3 ? "#FF6B6B" : "#00C9A7"
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-6 text-xs text-[#64748B]">
          <span>Connexion etablie</span>
          <span>Sondes periodiques envoyees</span>
          <span>Connexion fermee si pas de reponse</span>
        </div>
      </motion.div>
    </div>
  );
}
