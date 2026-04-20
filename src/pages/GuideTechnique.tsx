import { motion } from "framer-motion";
import { BookOpen, Cpu, Network, ShieldCheck, Zap } from "lucide-react";

export default function GuideTechnique() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="pt-6 pb-12 max-w-4xl mx-auto"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00C9A7]/10 mb-4">
          <BookOpen className="w-8 h-8 text-[#00C9A7]" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Guide Technique & Explications</h1>
        <p className="text-[#64748B] text-lg">Documentation détaillée du fonctionnement du Dashboard et du Générateur de Trame.</p>
      </div>

      <div className="space-y-12">
        {/* Objectif Section */}
        <section className="bg-[#111C35] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C9A7]/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#00C9A7]" /> Objectif du Projet
          </h2>
          <div className="prose prose-invert max-w-none text-[#94A3B8] space-y-4">
            <p>
              Ce dashboard a été conçu comme un outil <strong>pédagogique et analytique</strong> pour démystifier la couche "Liaison de Données" 
              des protocoles industriels. Il permet de visualiser l'encapsulation des données et de comprendre comment les informations 
              circulent sur un bus physique.
            </p>
          </div>
        </section>

        {/* Générateur Section */}
        <section className="bg-[#111C35] border border-white/5 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Cpu className="w-6 h-6 text-[#3D8BFF]" /> Le Générateur de Trame
          </h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0A0F1E] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[#00C9A7] font-bold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Modbus RTU
                </h3>
                <ul className="text-sm text-[#94A3B8] space-y-2">
                  <li><strong>Saisie :</strong> Adresse Esclave, Code Fonction, Données (Hex).</li>
                  <li><strong>Calcul :</strong> Utilise le polynôme <code>0xA001</code> pour générer un CRC-16.</li>
                  <li><strong>Format :</strong> La trame est assemblée et le CRC est ajouté en Little-Endian.</li>
                </ul>
              </div>
              <div className="bg-[#0A0F1E] border border-white/5 rounded-2xl p-6">
                <h3 className="text-[#3D8BFF] font-bold mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4" /> CAN 2.0A / 2.0B
                </h3>
                <ul className="text-sm text-[#94A3B8] space-y-2">
                  <li><strong>Standard (2.0A) :</strong> Identifiant sur 11 bits, priorité élevée.</li>
                  <li><strong>Étendu (2.0B) :</strong> Identifiant sur 29 bits (IDE=1).</li>
                  <li><strong>Champs :</strong> SOF, ID, RTR, IDE, DLC, Data, CRC-15, ACK, EOF.</li>
                </ul>
              </div>
            </div>

            <div className="bg-[#060913] border border-[#00C9A7]/20 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Fonctionnement du Moteur de Calcul</h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                Le moteur simule un <strong>registre à décalage (Shift Register)</strong>. Chaque bit de la trame subit une opération 
                <code>XOR</code> avec le polynôme générateur si le bit de poids faible est à 1.
              </p>
              <pre className="bg-black/40 p-4 rounded-xl font-mono text-xs text-[#00C9A7] border border-[#00C9A7]/10 whitespace-pre">
{`// Algorithme CRC-16 Modbus (Simplified)
while(data_length--) {
  crc ^= *data++;
  for(int i=0; i<8; i++) {
    if(crc & 1) crc = (crc >> 1) ^ 0xA001;
    else crc >>= 1;
  }
}`}
              </pre>
            </div>
          </div>
        </section>

      
      </div>
    </motion.div>
  );
}
