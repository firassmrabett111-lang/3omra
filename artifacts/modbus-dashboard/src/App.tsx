import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import LiveLog from "@/components/LiveLog";
import ReseauArchitecture from "@/pages/ReseauArchitecture";
import AnalyseTrame from "@/pages/AnalyseTrame";
import FunctionCodes from "@/pages/FunctionCodes";
import EnteteMBAP from "@/pages/EnteteMBAP";
import ParametrageTCP from "@/pages/ParametrageTCP";
import DashboardLive from "@/pages/DashboardLive";
import RtuVsTcp from "@/pages/RtuVsTcp";
import Sequences from "@/pages/Sequences";
import type { ComponentType } from "react";
import type { SectionId } from "@/data/modbusData";

const sectionComponents: Record<SectionId, ComponentType> = {
  reseau: ReseauArchitecture,
  trame: AnalyseTrame,
  codes: FunctionCodes,
  mbap: EnteteMBAP,
  tcp: ParametrageTCP,
  dashboard: DashboardLive,
  rtu: RtuVsTcp,
  sequences: Sequences
};

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("trame");
  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1E" }}>
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="ml-16">
        <TopBar />
        <main className="px-6 pb-48 max-w-[1400px]">
          <ActiveComponent />
        </main>
      </div>
      <LiveLog />
    </div>
  );
}

export default App;
