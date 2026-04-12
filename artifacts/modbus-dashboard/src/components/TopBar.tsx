import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Activity, Clock, CheckCircle, Cpu } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface MetricData {
  value: number;
  history: number[];
}

function useAnimatedCounter(target: number, duration: number = 1000) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const initial = current;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(initial + (target - initial) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);
  return current;
}

const kpiConfig = [
  { key: "requests", label: "Requetes/min", icon: Activity, color: "#00C9A7", format: (v: number) => Math.round(v).toString(), base: 248, range: 20 },
  { key: "latency", label: "Latence moyenne", icon: Clock, color: "#3D8BFF", format: (v: number) => v.toFixed(1) + " ms", base: 4.5, range: 0.7 },
  { key: "success", label: "Taux de succes", icon: CheckCircle, color: "#00C9A7", format: (v: number) => v.toFixed(1) + "%", base: 98.4, range: 0.85 },
  { key: "devices", label: "Appareils connectes", icon: Cpu, color: "#FFB547", format: (v: number) => Math.round(v).toString(), base: 7, range: 0 }
];

export default function TopBar() {
  const [metrics, setMetrics] = useState<Record<string, MetricData>>(() => {
    const init: Record<string, MetricData> = {};
    kpiConfig.forEach(k => {
      const history = Array.from({ length: 20 }, () => k.base + (Math.random() - 0.5) * k.range * 2);
      init[k.key] = { value: k.base, history };
    });
    return init;
  });

  const updateMetrics = useCallback(() => {
    setMetrics(prev => {
      const next: Record<string, MetricData> = {};
      kpiConfig.forEach(k => {
        const newVal = k.range === 0 ? k.base : k.base + (Math.random() - 0.5) * k.range * 2;
        const history = [...prev[k.key].history.slice(1), newVal];
        next[k.key] = { value: newVal, history };
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, [updateMetrics]);

  return (
    <div className="h-20 flex items-center gap-4 px-6">
      {kpiConfig.map((kpi, i) => {
        const metric = metrics[kpi.key];
        const animatedValue = useAnimatedCounter(metric.value);
        const Icon = kpi.icon;
        const sparkData = metric.history.map((v, idx) => ({ v, i: idx }));
        return (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex-1 rounded-xl border border-border p-4 flex items-center gap-3"
            style={{ backgroundColor: "#111C35" }}
            data-testid={`kpi-${kpi.key}`}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: kpi.color + "15" }}>
              <Icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-foreground font-mono" style={{ color: kpi.color }}>
                {kpi.format(animatedValue)}
              </p>
            </div>
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
