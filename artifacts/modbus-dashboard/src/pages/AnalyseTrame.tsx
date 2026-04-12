import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { requestFrame, responseFrame, exceptionFrame } from "@/data/modbusData";
import {
  Activity,
  ArrowRightLeft,
  Cable,
  Cpu,
  Database,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Server,
  ShieldCheck,
  Timer,
} from "lucide-react";

interface FrameField {
  name: string;
  hex: string;
  bytes: number;
  desc: string;
}

interface ByteGroup {
  label: string;
  bytes: string[];
  color: string;
  zone: "MBAP" | "PDU";
}

const byteFrames: Record<"request" | "response" | "exception", ByteGroup[]> = {
  request: [
    { label: "Transaction ID", bytes: ["00", "01"], color: "#3D8BFF", zone: "MBAP" },
    { label: "Protocol ID", bytes: ["00", "00"], color: "#3D8BFF", zone: "MBAP" },
    { label: "Length", bytes: ["00", "06"], color: "#3D8BFF", zone: "MBAP" },
    { label: "Unit ID", bytes: ["01"], color: "#3D8BFF", zone: "MBAP" },
    { label: "FC", bytes: ["03"], color: "#00C9A7", zone: "PDU" },
    { label: "Start Addr", bytes: ["00", "6B"], color: "#00C9A7", zone: "PDU" },
    { label: "Quantity", bytes: ["00", "03"], color: "#00C9A7", zone: "PDU" },
  ],
  response: [
    { label: "Transaction ID", bytes: ["00", "01"], color: "#00C9A7", zone: "MBAP" },
    { label: "Protocol ID", bytes: ["00", "00"], color: "#00C9A7", zone: "MBAP" },
    { label: "Length", bytes: ["00", "09"], color: "#00C9A7", zone: "MBAP" },
    { label: "Unit ID", bytes: ["01"], color: "#00C9A7", zone: "MBAP" },
    { label: "FC", bytes: ["03"], color: "#00C9A7", zone: "PDU" },
    { label: "Byte Count", bytes: ["06"], color: "#FFB547", zone: "PDU" },
    { label: "Registers", bytes: ["02", "2B", "00", "00", "00", "64"], color: "#FFB547", zone: "PDU" },
  ],
  exception: [
    { label: "Transaction ID", bytes: ["00", "01"], color: "#FF6B6B", zone: "MBAP" },
    { label: "Protocol ID", bytes: ["00", "00"], color: "#FF6B6B", zone: "MBAP" },
    { label: "Length", bytes: ["00", "03"], color: "#FF6B6B", zone: "MBAP" },
    { label: "Unit ID", bytes: ["01"], color: "#FF6B6B", zone: "MBAP" },
    { label: "FC + 0x80", bytes: ["83"], color: "#FF6B6B", zone: "PDU" },
    { label: "Exception", bytes: ["02"], color: "#FF6B6B", zone: "PDU" },
  ],
};

const stages = [
  {
    label: "SYN / SYN-ACK / ACK",
    desc: "Connexion TCP persistante etablie sur le port 502",
    color: "#64748B",
    icon: Cable,
  },
  {
    label: "Construction ADU",
    desc: "Le client assemble MBAP + PDU avec Transaction ID 0x0001",
    color: "#3D8BFF",
    icon: Database,
  },
  {
    label: "Encapsulation TCP/IP",
    desc: "L'ADU descend les couches Application, TCP, IP et Ethernet",
    color: "#FFB547",
    icon: Radio,
  },
  {
    label: "Envoi sur Ethernet",
    desc: "Le segment TCP est transmis vers le serveur MODBUS",
    color: "#3D8BFF",
    icon: ArrowRightLeft,
  },
  {
    label: "Traitement Serveur",
    desc: "Le serveur verifie Unit ID, Function Code et adresse registre",
    color: "#00C9A7",
    icon: Cpu,
  },
  {
    label: "Reponse MODBUS",
    desc: "Le serveur renvoie les valeurs des registres dans la PDU",
    color: "#00C9A7",
    icon: Server,
  },
  {
    label: "Confirmation Client",
    desc: "Le client valide le Transaction ID et livre les donnees a l'application",
    color: "#00C9A7",
    icon: ShieldCheck,
  },
];

const stackLayers = [
  { name: "Application", payload: "PDU MODBUS", color: "#00C9A7" },
  { name: "MODBUS TCP", payload: "MBAP + PDU = ADU", color: "#3D8BFF" },
  { name: "Transport", payload: "TCP src:49152 -> dst:502", color: "#FFB547" },
  { name: "Internet", payload: "IP 192.168.1.10 -> 192.168.1.30", color: "#FF6B6B" },
  { name: "Acces reseau", payload: "Ethernet Frame + FCS", color: "#64748B" },
];

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

function DeviceCard({ side, title, ip, color, active }: { side: "client" | "server"; title: string; ip: string; color: string; active: boolean }) {
  const Icon = side === "client" ? Activity : Server;
  return (
    <motion.div
      animate={{ scale: active ? 1.04 : 1, boxShadow: active ? `0 0 30px ${color}35` : "0 0 0 rgba(0,0,0,0)" }}
      className="w-56 rounded-2xl border p-4 relative overflow-hidden"
      style={{ backgroundColor: "#0A0F1E", borderColor: active ? color : "#1e293b" }}
    >
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 30% 20%, ${color}33, transparent 55%)` }} />
      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + "18" }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="font-mono text-xs text-[#64748B]">{ip}</p>
        </div>
      </div>
      <div className="relative mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="rounded-lg bg-[#111C35] p-2 text-[#64748B]">TCP: {side === "client" ? "49152" : "502"}</div>
        <div className="rounded-lg bg-[#111C35] p-2 text-[#64748B]">Unit: 0x01</div>
      </div>
    </motion.div>
  );
}

function TransmissionLab({ phase, autoMode, onToggleAuto, onStep, onReset }: { phase: number; autoMode: boolean; onToggleAuto: () => void; onStep: () => void; onReset: () => void }) {
  const stage = stages[phase];
  const StageIcon = stage.icon;
  const sendingRequest = phase >= 1 && phase <= 4;
  const sendingResponse = phase >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border p-6 overflow-hidden relative"
      style={{ backgroundColor: "#111C35" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "radial-gradient(circle at 50% 30%, rgba(0,201,167,0.12), transparent 45%)" }} />
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-extrabold text-foreground">Laboratoire de Transmission Temps Reel</h3>
          <p className="text-xs text-[#64748B]">Simulation SCADA: client HMI vers reseau Ethernet vers serveur PLC MODBUS</p>
        </div>
        <div className="flex gap-2">
          <button
            data-testid="button-auto-simulation"
            onClick={onToggleAuto}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer"
            style={{ backgroundColor: autoMode ? "#FFB547" : "#00C9A7", color: "#0A0F1E" }}
          >
            {autoMode ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoMode ? "Pause" : "Auto"}
          </button>
          <button data-testid="button-step-simulation" onClick={onStep} className="px-3 py-2 rounded-lg text-xs font-bold border border-border text-[#94a3b8] hover:text-foreground cursor-pointer">Etape</button>
          <button data-testid="button-reset-simulation" onClick={onReset} className="px-3 py-2 rounded-lg border border-border text-[#64748B] hover:text-foreground cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="relative flex items-center justify-between min-h-[220px]">
        <DeviceCard side="client" title="Client HMI / SCADA" ip="192.168.1.10" color="#3D8BFF" active={phase <= 3 || phase === 6} />

        <div className="flex-1 px-8 relative h-40 flex items-center">
          <div className="absolute left-8 right-8 top-1/2 h-1 rounded-full bg-[#0A0F1E] border border-border" />
          {["SYN", "SYN-ACK", "ACK"].map((label, i) => (
            <motion.div
              key={label}
              initial={false}
              animate={{ opacity: phase === 0 ? 1 : 0.28, y: phase === 0 ? [0, -8, 0] : 0 }}
              transition={{ delay: i * 0.22, duration: 0.8, repeat: phase === 0 ? Infinity : 0 }}
              className="absolute top-6 text-[10px] font-mono px-2 py-1 rounded-full border"
              style={{ left: `${18 + i * 27}%`, borderColor: "#64748B", color: "#94a3b8", backgroundColor: "#0A0F1E" }}
            >
              {label}
            </motion.div>
          ))}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${phase}-${sendingResponse ? "res" : "req"}`}
              initial={{ x: sendingResponse ? 430 : -20, opacity: 0, scale: 0.85 }}
              animate={{ x: sendingResponse ? -20 : 430, opacity: phase === 0 ? 0 : 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: phase === 0 ? 0.2 : 1.15, ease: "easeInOut" }}
              className="absolute z-20 top-[72px] rounded-xl border px-3 py-2 min-w-[150px]"
              style={{ backgroundColor: sendingResponse ? "#00C9A715" : "#3D8BFF15", borderColor: sendingResponse ? "#00C9A7" : "#3D8BFF" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sendingResponse ? "#00C9A7" : "#3D8BFF" }} />
                <span className="font-mono text-[11px] font-bold" style={{ color: sendingResponse ? "#00C9A7" : "#3D8BFF" }}>
                  {sendingResponse ? "REPONSE ADU" : "REQUETE ADU"}
                </span>
              </div>
              <div className="mt-1 flex gap-1">
                {(sendingResponse ? ["00", "01", "00", "00", "00", "09", "01", "03", "06"] : ["00", "01", "00", "00", "00", "06", "01", "03"]).map((b, i) => (
                  <motion.span
                    key={`${b}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="font-mono text-[9px] text-[#cbd5e1]"
                  >
                    {b}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
              <span>Client Socket</span>
              <span className="text-[#FFB547]">TCP Port 502</span>
              <span>Server Socket</span>
            </div>
          </div>
        </div>

        <DeviceCard side="server" title="Serveur PLC" ip="192.168.1.30" color="#00C9A7" active={phase >= 3 && phase <= 5} />
      </div>

      <div className="relative mt-6 rounded-xl border border-border p-4" style={{ backgroundColor: "#0A0F1E" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stage.color + "18" }}>
            <StageIcon className="w-5 h-5" style={{ color: stage.color }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: stage.color }}>{phase + 1}. {stage.label}</p>
            <p className="text-xs text-[#94a3b8] mt-0.5">{stage.desc}</p>
          </div>
          <div className="flex gap-1.5">
            {stages.map((s, i) => (
              <motion.div
                key={s.label}
                className="h-2 rounded-full"
                animate={{ width: i === phase ? 32 : 8, backgroundColor: i <= phase ? s.color : "#1e293b" }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RealFrameShape({ type, active }: { type: "request" | "response" | "exception"; active: boolean }) {
  const groups = byteFrames[type];
  const color = type === "request" ? "#3D8BFF" : type === "response" ? "#00C9A7" : "#FF6B6B";
  const title = type === "request" ? "Forme reelle de la REQUETE" : type === "response" ? "Forme reelle de la REPONSE" : "Forme reelle d'une EXCEPTION";

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-xl border p-4"
      style={{ backgroundColor: "#0A0F1E", borderColor: active ? color : "#1e293b" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold" style={{ color }}>{title}</h4>
        <span className="font-mono text-[10px] text-[#64748B]">MBAP Header + PDU</span>
      </div>
      <div className="flex items-end gap-1 overflow-x-auto pb-2 scrollbar-thin">
        {groups.map((group, groupIndex) => (
          <div key={group.label} className="shrink-0">
            <div className="flex gap-1">
              {group.bytes.map((byte, byteIndex) => (
                <motion.div
                  key={`${group.label}-${byteIndex}`}
                  initial={active ? { opacity: 0, y: 14, rotateX: -60 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: groupIndex * 0.12 + byteIndex * 0.04, duration: 0.35 }}
                  className="w-10 h-11 rounded-md border flex items-center justify-center font-mono text-sm font-bold"
                  style={{ borderColor: group.color + "55", backgroundColor: group.color + "12", color: group.color, textShadow: `0 0 8px ${group.color}66` }}
                >
                  {byte}
                </motion.div>
              ))}
            </div>
            <div className="mt-1 text-center">
              <p className="text-[9px] font-medium text-[#94a3b8] truncate max-w-[120px]">{group.label}</p>
              <p className="text-[8px] font-mono" style={{ color: group.zone === "MBAP" ? "#3D8BFF" : "#00C9A7" }}>{group.zone}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StackPassage({ phase }: { phase: number }) {
  const activeLayer = Math.min(Math.max(phase - 1, 0), stackLayers.length - 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="rounded-xl border border-border p-5"
      style={{ backgroundColor: "#111C35" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-foreground">Passage reel dans les couches</h3>
          <p className="text-xs text-[#64748B]">Chaque encapsulation ajoute son propre en-tete avant l'envoi physique</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-mono text-[#FFB547]"><Timer className="w-3.5 h-3.5" /> 4.6 ms aller-retour</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {stackLayers.map((layer, i) => (
          <motion.div
            key={layer.name}
            animate={{ y: activeLayer === i ? -6 : 0, borderColor: activeLayer === i ? layer.color : "#1e293b" }}
            className="relative rounded-xl border p-3 min-h-[120px] overflow-hidden"
            style={{ backgroundColor: "#0A0F1E" }}
          >
            <div className="absolute inset-0 opacity-25" style={{ background: `linear-gradient(180deg, ${layer.color}22, transparent)` }} />
            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: layer.color }}>{layer.name}</p>
              <p className="text-xs text-[#94a3b8] mt-2 min-h-[34px]">{layer.payload}</p>
              <motion.div
                animate={{ width: activeLayer >= i ? "100%" : "10%" }}
                transition={{ duration: 0.5 }}
                className="h-1 rounded-full mt-4"
                style={{ backgroundColor: layer.color }}
              />
              {activeLayer === i && (
                <motion.div
                  layoutId="layer-pulse"
                  className="mt-3 font-mono text-[10px]"
                  style={{ color: layer.color }}
                >
                  encapsulation...\n                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function AnalyseTrame() {
  const [capturing, setCapturing] = useState(false);
  const [captured, setCaptured] = useState(true);
  const [phase, setPhase] = useState(0);
  const [autoMode, setAutoMode] = useState(true);

  useEffect(() => {
    if (!autoMode) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % stages.length);
      setCaptured(true);
    }, 1700);
    return () => clearInterval(interval);
  }, [autoMode]);

  const handleCapture = useCallback(() => {
    setCaptured(false);
    setCapturing(true);
    setPhase(1);
    setTimeout(() => {
      setCaptured(true);
      setCapturing(false);
    }, 120);
  }, []);

  const handleReset = useCallback(() => {
    setCaptured(false);
    setCapturing(false);
    setPhase(0);
    setAutoMode(false);
  }, []);

  const handleStep = useCallback(() => {
    setAutoMode(false);
    setCaptured(true);
    setPhase((prev) => (prev + 1) % stages.length);
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
            <h2 className="text-2xl font-extrabold text-foreground mb-1">Analyse de Trame Avancee</h2>
            <p className="text-sm text-[#64748B]">Visualisation realiste: connexion TCP, envoi, passage dans les couches et decodage octet par octet</p>
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
              Capturer trame
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

      <TransmissionLab
        phase={phase}
        autoMode={autoMode}
        onToggleAuto={() => setAutoMode((v) => !v)}
        onStep={handleStep}
        onReset={handleReset}
      />

      <StackPassage phase={phase} />

      <div className="grid grid-cols-1 gap-4">
        <RealFrameShape type="request" active={phase >= 1 && phase <= 4} />
        <RealFrameShape type="response" active={phase >= 5} />
        <RealFrameShape type="exception" active={phase === 4} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="rounded-xl border border-border p-6 space-y-8"
        style={{ backgroundColor: "#111C35" }}
      >
        <div className="text-center mb-4">
          <span className="text-xs font-mono px-3 py-1 rounded-full border border-border text-[#64748B]">
            Decodeur champ par champ: MBAP Header (7 octets) + PDU
          </span>
        </div>

        <FrameRow fields={requestFrame} color="#3D8BFF" label="Requete (Request)" animate={captured} delay={0} />
        <FrameRow fields={responseFrame} color="#00C9A7" label="Reponse (Response)" animate={captured} delay={0.8} />
        <FrameRow fields={exceptionFrame} color="#FF6B6B" label="Exception (Error)" animate={captured} delay={1.5} />
      </motion.div>
    </div>
  );
}
