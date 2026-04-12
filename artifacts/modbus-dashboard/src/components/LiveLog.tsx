import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  type: "REQ" | "RES" | "ERR";
  srcIp: string;
  unitId: string;
  fc: string;
  detail: string;
}

const ips = ["192.168.1.10", "192.168.1.20", "192.168.1.30", "10.0.0.5", "10.0.0.12"];
const fcs = ["FC03", "FC01", "FC06", "FC16", "FC02", "FC05"];
const exceptions = ["0x01 Illegal Function", "0x02 Illegal Data Address", "0x03 Illegal Data Value"];

function generateLog(id: number): LogEntry {
  const now = new Date();
  const timestamp = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");
  const rand = Math.random();
  const type: LogEntry["type"] = rand > 0.92 ? "ERR" : rand > 0.45 ? "RES" : "REQ";
  const srcIp = ips[Math.floor(Math.random() * ips.length)];
  const unitId = "0x" + String(Math.floor(Math.random() * 7) + 1).padStart(2, "0");
  const fc = fcs[Math.floor(Math.random() * fcs.length)];
  let detail = "";
  if (type === "ERR") {
    detail = exceptions[Math.floor(Math.random() * exceptions.length)];
  } else if (type === "RES") {
    detail = `[${Array.from({ length: 3 }, () => "0x" + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, "0")).join(" ")}]`;
  } else {
    detail = `Addr:0x${Math.floor(Math.random() * 1000).toString(16).toUpperCase().padStart(4, "0")} Qty:${Math.floor(Math.random() * 10) + 1}`;
  }
  return { id, timestamp, type, srcIp, unitId, fc, detail };
}

const typeColors: Record<string, string> = {
  REQ: "#3D8BFF",
  RES: "#00C9A7",
  ERR: "#FF6B6B"
};

export default function LiveLog() {
  const [collapsed, setCollapsed] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>(() => Array.from({ length: 8 }, (_, i) => generateLog(i)));
  const nextId = useRef(8);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = generateLog(nextId.current++);
        return [...prev.slice(-30), newLog];
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      className="fixed bottom-0 left-16 right-0 z-40 border-t border-border"
      style={{ backgroundColor: "#0A0F1E" }}
    >
      <button
        data-testid="toggle-log"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full h-8 flex items-center justify-between px-4 cursor-pointer hover:bg-[#111C35]/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#00C9A7]" />
          <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Live MODBUS Log</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00C9A7] animate-pulse" />
        </div>
        {collapsed ? <ChevronUp className="w-3.5 h-3.5 text-[#64748B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />}
      </button>

      {!collapsed && (
        <div ref={scrollRef} className="h-36 overflow-y-auto scrollbar-thin px-4 pb-2 font-mono text-xs">
          <AnimatePresence initial={false}>
            {logs.map(log => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 py-0.5"
              >
                <span className="text-[#64748B] w-24 shrink-0">{log.timestamp}</span>
                <span
                  className="w-8 text-center rounded text-[10px] font-bold px-1.5 py-0.5"
                  style={{ backgroundColor: typeColors[log.type] + "20", color: typeColors[log.type] }}
                >
                  {log.type}
                </span>
                <span className="text-[#64748B] w-28 shrink-0">{log.srcIp}</span>
                <span className="text-foreground w-12 shrink-0">{log.unitId}</span>
                <span className="font-semibold w-12 shrink-0" style={{ color: typeColors[log.type] }}>{log.fc}</span>
                <span className="text-[#64748B] truncate">{log.detail}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
