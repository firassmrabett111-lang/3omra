import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import { tcpLayers, fcDistribution, exceptionTypes } from "@/data/modbusData";

function generateTrafficData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    requests: Math.floor(180 + Math.random() * 140),
    errors: Math.floor(2 + Math.random() * 12)
  }));
}

export default function DashboardLive() {
  const [trafficData, setTrafficData] = useState(generateTrafficData);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          requests: Math.floor(180 + Math.random() * 140),
          errors: Math.floor(2 + Math.random() * 12)
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const latencyData = tcpLayers.map(l => ({
    name: l.name,
    latency: l.latency,
    fill: l.color
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">Dashboard Live</h2>
        <p className="text-sm text-[#64748B]">Visualisations en temps reel du trafic MODBUS TCP/IP</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="col-span-2 rounded-xl border border-border p-5"
          style={{ backgroundColor: "#111C35" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-foreground">Trafic MODBUS (24h)</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00C9A7]" />Requetes</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />Erreurs</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111C35", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#94a3b8" }}
              />
              <Line type="monotone" dataKey="requests" stroke="#00C9A7" strokeWidth={2} dot={false} animationDuration={500} />
              <Line type="monotone" dataKey="errors" stroke="#FF6B6B" strokeWidth={2} dot={false} animationDuration={500} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-xl border border-border p-5"
          style={{ backgroundColor: "#111C35" }}
        >
          <h3 className="text-sm font-bold text-foreground mb-4">Distribution Function Codes</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={fcDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={2}
                animationDuration={1000}
              >
                {fcDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#111C35", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {fcDistribution.map(fc => (
              <span key={fc.name} className="flex items-center gap-1.5 text-[10px] text-[#94a3b8]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: fc.color }} />
                {fc.name} ({fc.value}%)
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-xl border border-border p-5"
          style={{ backgroundColor: "#111C35" }}
        >
          <h3 className="text-sm font-bold text-foreground mb-4">Latence par Couche TCP/IP</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={latencyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} unit=" ms" />
              <YAxis type="category" dataKey="name" tick={{ fill: "#64748B", fontSize: 9 }} width={90} axisLine={{ stroke: "#1e293b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111C35", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
                formatter={(value: number) => [`${value} ms`, "Latence"]}
              />
              <Bar dataKey="latency" animationDuration={1000} radius={[0, 4, 4, 0]}>
                {latencyData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="col-span-2 rounded-xl border border-border p-5"
          style={{ backgroundColor: "#111C35" }}
        >
          <h3 className="text-sm font-bold text-foreground mb-4">Frequence des Exceptions</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={exceptionTypes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={{ stroke: "#1e293b" }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} width={140} axisLine={{ stroke: "#1e293b" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111C35", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px" }}
              />
              <Bar dataKey="count" animationDuration={1000} radius={[0, 4, 4, 0]}>
                {exceptionTypes.map((entry) => (
                  <Cell key={entry.code} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
