# Guide Technique - Dashboard Modbus & CAN

Ce document détaille les implémentations techniques du dashboard interactif.

## 1. Architecture du Générateur de Trame

Le générateur de trame est conçu pour simuler l'encapsulation de bas niveau.

### Modbus RTU
- **Polynôme :** 0xA001.
- **Processus :**
  1. Concaténation de l'Adresse Esclave, du Code Fonction et des Données.
  2. Calcul du CRC-16 bit par bit.
  3. Inversion des octets (Little-Endian) pour la transmission série.

### CAN (Controller Area Network)
- **Standard (2.0A) :** Identifiant 11 bits.
- **Étendu (2.0B) :** Identifiant 29 bits.
- **Structure de trame :**
  - **SOF :** 1 bit (Start of Frame).
  - **Arbitration Field :** ID + RTR.
  - **Control Field :** IDE, r0, DLC.
  - **Data Field :** 0 à 8 octets.
  - **CRC Field :** CRC-15 + Delimiter.
  - **ACK Field :** Slot + Delimiter.
  - **EOF :** 7 bits (End of Frame).

## 2. Algorithme de Calcul CRC

L'implémentation React utilise des opérations de manipulation de bits (bitwise) pour simuler le comportement d'un microcontrôleur.

\`\`\`javascript
function calculateCRC(bytes) {
  let crc = 0xFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 0x0001) {
        crc = (crc >> 1) ^ 0xA001;
      } else {
        crc >>= 1;
      }
    }
  }
  return crc;
}
\`\`\`

## 3. Visualisation UI

Les animations sont propulsées par **Framer Motion**.
- Les blocs de trame apparaissent avec un délai progressif (stagger effect).
- Le moteur de calcul affiche les valeurs intermédiaires du registre pour illustrer le processus de division polynomiale.

---
Document préparé pour la soutenance technique de **Firas Mrabet** & **Oumayma Sfaxi**.
