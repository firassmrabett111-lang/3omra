import { useState } from "react";
import { motion } from "framer-motion";
import { Network, Binary, Code2, FileCode, Settings, BarChart3, GitCompare, Workflow } from "lucide-react";
import { sectionList, type SectionId } from "@/data/modbusData";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Network, Binary, Code2, FileCode, Settings, BarChart3, GitCompare, Workflow
};

interface SidebarProps {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full z-50 flex flex-col border-r border-border"
      style={{ backgroundColor: "hsl(225 53% 6%)" }}
      animate={{ width: expanded ? 220 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#00C9A7" }}>
          <Network className="w-4 h-4 text-[#0A0F1E]" />
        </div>
        {expanded && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-3 text-sm font-bold text-foreground whitespace-nowrap"
          >
            MODBUS TCP/IP
          </motion.span>
        )}
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1">
        {sectionList.map((section) => {
          const Icon = iconMap[section.icon];
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              data-testid={`nav-${section.id}`}
              onClick={() => onSectionChange(section.id)}
              className={`relative flex items-center h-11 px-4 mx-2 rounded-lg transition-all duration-200 cursor-pointer ${
                isActive
                  ? "text-[#00C9A7]"
                  : "text-[#64748B] hover:text-foreground hover:bg-[#111C35]/50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                  style={{ backgroundColor: "#00C9A7" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? "glow-teal" : ""}`} />
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="ml-3 text-sm font-medium whitespace-nowrap"
                >
                  {section.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-[#111C35] flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
          </div>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3"
            >
              <p className="text-xs font-medium text-foreground">En ligne</p>
              <p className="text-[10px] text-[#64748B]">Port 502</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
