import { motion } from "framer-motion";
import { mbapFields } from "@/data/modbusData";
import { Hash, Shield, Ruler, User } from "lucide-react";

const fieldIcons = [Hash, Shield, Ruler, User];
const fieldColors = ["#3D8BFF", "#00C9A7", "#FFB547", "#FF6B6B"];

export default function EnteteMBAP() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">En-tete MBAP</h2>
        <p className="text-sm text-[#64748B]">Les 4 champs du MODBUS Application Protocol Header (7 octets)</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {mbapFields.map((field, i) => {
          const Icon = fieldIcons[i];
          const color = fieldColors[i];
          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="rounded-xl border p-6 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#111C35",
                borderColor: color + "25",
                animation: "pulse-border 3s ease-in-out infinite"
              }}
              data-testid={`mbap-${field.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "15", color }}>
                  {field.bytes} {field.bytes > 1 ? "octets" : "octet"}
                </span>
              </div>

              <p className="font-mono text-3xl font-bold mb-2" style={{ color }}>
                {field.hex}
              </p>
              <p className="text-sm font-bold text-foreground mb-4">{field.name}</p>

              <div className="space-y-3">
                <div className="rounded-lg p-3 border border-border" style={{ backgroundColor: "#0A0F1E" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#3D8BFF] mb-1.5">Client</p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{field.client}</p>
                </div>
                <div className="rounded-lg p-3 border border-border" style={{ backgroundColor: "#0A0F1E" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#00C9A7] mb-1.5">Serveur</p>
                  <p className="text-xs text-[#94a3b8] leading-relaxed">{field.server}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
