# Animated Modbus & CAN Dashboard

Un dashboard interactif et animé pour la supervision et la compréhension des protocoles industriels Modbus TCP/IP, Modbus RTU et CAN.

## 🚀 Fonctionnalités

- **Analyse de Trame Avancée :** Visualisation de l'encapsulation TCP/IP et du passage des données dans les couches OSI.
- **Générateur de Trame Interactif :**
  - **Modbus RTU :** Calcul en temps réel du CRC-16 (polynôme 0xA001).
  - **CAN 2.0A / 2.0B :** Construction de trames standards et étendues avec simulation du CRC-15.
- **Moteur de Calcul :** Animation simulant un registre à décalage pour le calcul de contrôle d'erreur.
- **Interface Premium :** Design sombre, animations fluides avec Framer Motion et icônes Lucide.

## 🛠️ Installation

1. Clonez le dépôt :
   \`\`\`bash
   git clone https://github.com/firassmrabett111-lang/3omra.git
   \`\`\`
2. Installez les dépendances :
   \`\`\`bash
   npm install
   \`\`\`
3. Lancez le projet :
   \`\`\`bash
   npm run dev
   \`\`\`

## 📚 Guide Technique

Un guide détaillé est intégré directement dans l'interface (onglet "Guide & Explications"). Il explique :
- L'objectif pédagogique du projet.
- Les algorithmes de calcul utilisés (CRC).
- La structure des trames CAN et Modbus.

---
Développé par **Firas Mrabet** & **Oumayma Sfaxi**.
