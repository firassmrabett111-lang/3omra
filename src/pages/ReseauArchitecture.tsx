import { useState } from "react";
import { motion } from "framer-motion";
import { tcpLayers } from "@/data/modbusData";
import { ArrowDown, Layers, Server, Monitor, Wifi } from "lucide-react";

const layerIcons = [Monitor, Server, Wifi, Layers];

export default function ReseauArchitecture() {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-extrabold text-foreground mb-1">Reseau & Architecture</h2>
        <p className="text-sm text-[#64748B]">Modele TCP/IP et architecture de communication MODBUS</p>
      </motion.div>

      <div className="space-y-3">
        {tcpLayers.map((layer, i) => {
          const Icon = layerIcons[i];
          const isExpanded = expandedLayer === i;
          return (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="rounded-xl border border-border cursor-pointer transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: "#111C35",
                borderColor: isExpanded ? layer.color + "50" : undefined
              }}
              onClick={() => setExpandedLayer(isExpanded ? null : i)}
              data-testid={`layer-${layer.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              <div className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: layer.color + "15" }}>
                  <Icon className="w-6 h-6" style={{ color: layer.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-bold tracking-[0.2em] text-foreground">{layer.name}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ backgroundColor: layer.color + "15", color: layer.color }}>
                      {layer.latency} ms
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] font-medium mb-1">{layer.protocols}</p>
                  <p className="text-sm text-[#64748B]">{layer.description}</p>
                </div>
              </div>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 border-t border-border"
                >
                  <p className="text-sm text-[#94a3b8] pt-4 leading-relaxed">{layer.details}</p>
                </motion.div>
              )}
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
        <h3 className="text-lg font-bold text-foreground mb-6">Architecture de Communication MODBUS</h3>
        <div className="flex flex-col items-center gap-2">
          {[
            { label: "Application Utilisateur", color: "#00C9A7", sub: "Requetes / Reponses MODBUS" },
            { label: "Couche Communication", color: "#3D8BFF", sub: "Client MODBUS + Serveur MODBUS" },
            { label: "Gestion TCP", color: "#FFB547", sub: "Connexions persistantes, Transaction ID" },
            { label: "Pile TCP/IP", color: "#FF6B6B", sub: "Socket, Port 502, Ethernet" }
          ].map((block, i) => (
            <div key={block.label} className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="rounded-lg border p-4 text-center"
                style={{ borderColor: block.color + "40", backgroundColor: block.color + "08" }}
              >
                <p className="text-sm font-bold" style={{ color: block.color }}>{block.label}</p>
                <p className="text-xs text-[#64748B] mt-1">{block.sub}</p>
              </motion.div>
              {i < 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.15 }}
                  className="flex justify-center py-1"
                >
                  <ArrowDown className="w-4 h-4 text-[#64748B]" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
