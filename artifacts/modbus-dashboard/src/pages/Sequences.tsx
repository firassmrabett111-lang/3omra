import { motion } from "framer-motion";
import { clientSequenceSteps, serverSequenceSteps } from "@/data/modbusData";
import { ArrowRight, Monitor, Server } from "lucide-react";

interface SequenceStep {
  step: number;
  label: string;
  desc: string;
}

function SequenceDiagram({ steps, title, color, icon: Icon }: {
  steps: SequenceStep[];
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex-1 rounded-xl border border-border p-5" style={{ backgroundColor: "#111C35" }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
      </div>

      <div className="space-y-1">
        {steps.map((s, i) => (
          <div key={s.step}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#0A0F1E]/40 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: color + "15", color }}
              >
                {s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.label}</p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.1 }}
                className="flex items-center pl-6 py-0.5"
              >
                <div className="w-px h-3 ml-3" style={{ backgroundColor: color + "30" }} />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Sequences() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">Sequences</h2>
        <p className="text-sm text-[#64748B]">Diagrammes de sequence Client et Serveur MODBUS TCP/IP</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border p-5"
        style={{ backgroundColor: "#111C35" }}
      >
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#3D8BFF]" />
            <span className="text-xs font-medium text-[#3D8BFF]">Application Utilisateur</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[#00C9A7]" />
            <span className="text-xs font-medium text-[#00C9A7]">Couche Communication</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#64748B]" />
          <span className="text-xs font-medium text-[#FFB547]">Reseau TCP/IP</span>
        </div>
      </motion.div>

      <div className="flex gap-4">
        <SequenceDiagram
          steps={clientSequenceSteps}
          title="Sequence Client"
          color="#3D8BFF"
          icon={Monitor}
        />
        <SequenceDiagram
          steps={serverSequenceSteps}
          title="Sequence Serveur"
          color="#00C9A7"
          icon={Server}
        />
      </div>
    </div>
  );
}
