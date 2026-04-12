export const tcpLayers = [
  {
    name: "APPLICATION",
    protocols: "MODBUS TCP/IP, HTTP, FTP, DNS",
    description: "Couche applicative gerant les echanges MODBUS entre client et serveur",
    latency: 0.8,
    color: "#00C9A7",
    details: "La couche Application heberge le protocole MODBUS TCP/IP. Elle gere l'encapsulation des PDU MODBUS dans des trames TCP, l'attribution des Transaction ID, et le routage des requetes vers les bons Unit ID."
  },
  {
    name: "TRANSPORT",
    protocols: "TCP (port 502)",
    description: "Transport fiable avec controle de flux et gestion des connexions persistantes",
    latency: 1.2,
    color: "#3D8BFF",
    details: "TCP assure la livraison ordonnee et sans perte des segments MODBUS. Les connexions sont persistantes sur le port 502, avec gestion du Transaction ID pour le multiplexage des requetes simultanees."
  },
  {
    name: "INTERNET",
    protocols: "IP, ICMP, ARP",
    description: "Adressage logique et routage des paquets sur le reseau industriel",
    latency: 0.5,
    color: "#FFB547",
    details: "La couche Internet gere l'adressage IP des equipements MODBUS et le routage entre sous-reseaux industriels. ARP resout les adresses MAC, ICMP permet le diagnostic reseau."
  },
  {
    name: "ACCES RESEAU",
    protocols: "Ethernet, Wi-Fi",
    description: "Interface physique et trame de liaison de donnees",
    latency: 0.3,
    color: "#FF6B6B",
    details: "La couche Acces Reseau encapsule les datagrammes IP dans des trames Ethernet (ou Wi-Fi). Elle gere l'acces au medium physique, la detection d'erreurs au niveau trame, et l'adressage MAC."
  }
];

export const requestFrame = [
  { name: "Transaction ID", hex: "0x0001", bytes: 2, desc: "Identifiant de transaction" },
  { name: "Protocol ID", hex: "0x0000", bytes: 2, desc: "Protocole MODBUS" },
  { name: "Length", hex: "0x0006", bytes: 2, desc: "Longueur des donnees" },
  { name: "Unit ID", hex: "0x01", bytes: 1, desc: "Identifiant unite" },
  { name: "Function Code", hex: "0x03", bytes: 1, desc: "Lecture registres" },
  { name: "Start Address", hex: "0x006B", bytes: 2, desc: "Adresse de depart" },
  { name: "Quantity", hex: "0x0003", bytes: 2, desc: "Nombre de registres" }
];

export const responseFrame = [
  { name: "Transaction ID", hex: "0x0001", bytes: 2, desc: "Identifiant de transaction" },
  { name: "Protocol ID", hex: "0x0000", bytes: 2, desc: "Protocole MODBUS" },
  { name: "Length", hex: "0x0009", bytes: 2, desc: "Longueur des donnees" },
  { name: "Unit ID", hex: "0x01", bytes: 1, desc: "Identifiant unite" },
  { name: "Function Code", hex: "0x03", bytes: 1, desc: "Lecture registres" },
  { name: "Byte Count", hex: "0x06", bytes: 1, desc: "Nombre d'octets" },
  { name: "Data", hex: "0x022B 0x0000 0x0064", bytes: 6, desc: "Valeurs des registres" }
];

export const exceptionFrame = [
  { name: "Transaction ID", hex: "0x0001", bytes: 2, desc: "Identifiant de transaction" },
  { name: "Protocol ID", hex: "0x0000", bytes: 2, desc: "Protocole MODBUS" },
  { name: "Length", hex: "0x0003", bytes: 2, desc: "Longueur des donnees" },
  { name: "Unit ID", hex: "0x01", bytes: 1, desc: "Identifiant unite" },
  { name: "Function Code", hex: "0x83", bytes: 1, desc: "Exception FC03" },
  { name: "Exception Code", hex: "0x02", bytes: 1, desc: "Adresse illegale" }
];

export const functionCodes = [
  { code: "FC01", hex: "0x01", name: "Read Coils", type: "Bits", access: "READ", reqFormat: "Adresse (2B) + Quantite (2B)", resFormat: "Nombre d'octets (1B) + Etat des coils (NB)" },
  { code: "FC02", hex: "0x02", name: "Read Discrete Inputs", type: "Bits", access: "READ", reqFormat: "Adresse (2B) + Quantite (2B)", resFormat: "Nombre d'octets (1B) + Etat des entrees (NB)" },
  { code: "FC03", hex: "0x03", name: "Read Holding Registers", type: "Mots (16 bits)", access: "READ", reqFormat: "Adresse (2B) + Quantite (2B)", resFormat: "Nombre d'octets (1B) + Valeurs registres (N*2B)" },
  { code: "FC04", hex: "0x04", name: "Read Input Registers", type: "Mots (16 bits)", access: "READ", reqFormat: "Adresse (2B) + Quantite (2B)", resFormat: "Nombre d'octets (1B) + Valeurs registres (N*2B)" },
  { code: "FC05", hex: "0x05", name: "Write Single Coil", type: "Bit", access: "WRITE", reqFormat: "Adresse (2B) + Valeur (2B: 0xFF00/0x0000)", resFormat: "Echo de la requete" },
  { code: "FC06", hex: "0x06", name: "Write Single Register", type: "Mot (16 bits)", access: "WRITE", reqFormat: "Adresse (2B) + Valeur (2B)", resFormat: "Echo de la requete" },
  { code: "FC15", hex: "0x0F", name: "Write Multiple Coils", type: "Bits", access: "WRITE", reqFormat: "Adresse (2B) + Quantite (2B) + Octets (1B) + Valeurs (NB)", resFormat: "Adresse (2B) + Quantite (2B)" },
  { code: "FC16", hex: "0x10", name: "Write Multiple Registers", type: "Mots (16 bits)", access: "WRITE", reqFormat: "Adresse (2B) + Quantite (2B) + Octets (1B) + Valeurs (N*2B)", resFormat: "Adresse (2B) + Quantite (2B)" }
];

export const mbapFields = [
  { name: "Transaction ID", hex: "0x0001", bytes: 2, client: "Incremente a chaque requete pour identifier la transaction", server: "Recopie la valeur recue depuis la requete client" },
  { name: "Protocol ID", hex: "0x0000", bytes: 2, client: "Toujours 0x0000 pour identifier le protocole MODBUS", server: "Recopie 0x0000 dans la reponse" },
  { name: "Length", hex: "0x0006", bytes: 2, client: "Nombre d'octets suivants: Unit ID (1B) + PDU", server: "Calcule selon la taille de la reponse PDU + 1" },
  { name: "Unit ID", hex: "0x01", bytes: 1, client: "Identifie l'esclave/serveur cible sur le reseau", server: "Recopie la valeur depuis la requete pour confirmer la source" }
];

export const tcpParams = [
  { name: "TCP_NODELAY", value: "ON", icon: "Zap", description: "Desactive l'algorithme de Nagle pour envoyer immediatement chaque segment TCP sans attendre un remplissage de buffer. Essentiel pour les communications MODBUS temps reel ou la latence doit etre minimale." },
  { name: "SO_KEEPALIVE", value: "ON", icon: "HeartPulse", description: "Detecte les connexions semi-ouvertes (half-open) en envoyant des sondes TCP periodiques. Permet d'identifier et fermer les connexions mortes apres un timeout configurable." },
  { name: "SO_REUSEADDR", value: "ON", icon: "RefreshCw", description: "Permet la reutilisation immediate d'un port apres fermeture de la socket, sans attendre l'expiration du delai TIME_WAIT. Critique pour le redemarrage rapide des serveurs MODBUS." },
  { name: "SO_RCVBUF", value: "4096+", icon: "Database", description: "Taille du buffer de reception en octets. Une valeur de 4096 octets ou plus optimise le debit sur les reseaux industriels en evitant la fragmentation des messages MODBUS volumineux." }
];

export const rtuVsTcpComparison = [
  { criterion: "Medium", rtu: "Serie RS-485", tcp: "Ethernet TCP/IP" },
  { criterion: "Vitesse", rtu: "115.2 kbps max", tcp: "100+ Mbps" },
  { criterion: "Controle d'erreur", rtu: "CRC-16", tcp: "TCP Checksum" },
  { criterion: "Adressage", rtu: "1-247 (Slave Address)", tcp: "IP + Unit ID" },
  { criterion: "Mode d'acces", rtu: "Half-duplex", tcp: "Full-duplex" },
  { criterion: "Transactions simultanees", rtu: "1 seule", tcp: "Multiples (Transaction ID)" },
  { criterion: "Port dedie", rtu: "Non", tcp: "Oui (port 502)" }
];

export const clientSequenceSteps = [
  { step: 1, label: "Construction requete", desc: "L'application utilisateur construit la requete MODBUS (FC + donnees)" },
  { step: 2, label: "Envoi requete", desc: "La couche communication encapsule la PDU dans le MBAP et envoie via TCP" },
  { step: 3, label: "Attente confirmation", desc: "Le client attend la reponse du serveur avec un timeout configurable" },
  { step: 4, label: "Reception reponse", desc: "La couche TCP recoit la reponse et la transmet a la couche MODBUS" },
  { step: 5, label: "Verification Transaction ID", desc: "Le client verifie que le Transaction ID correspond a la requete" },
  { step: 6, label: "Traitement reponse", desc: "L'application traite les donnees recues ou gere l'exception" }
];

export const serverSequenceSteps = [
  { step: 1, label: "Attente indication", desc: "Le serveur ecoute sur le port 502 les connexions TCP entrantes" },
  { step: 2, label: "Reception requete", desc: "La couche TCP recoit et desencapsule la requete MODBUS" },
  { step: 3, label: "Verification Unit ID", desc: "Le serveur verifie que l'Unit ID correspond a son adresse" },
  { step: 4, label: "Traitement requete", desc: "L'application serveur execute la fonction demandee (lecture/ecriture)" },
  { step: 5, label: "Construction reponse", desc: "Le serveur construit la reponse PDU avec les donnees ou l'exception" },
  { step: 6, label: "Envoi reponse", desc: "La reponse est encapsulee dans le MBAP et envoyee via TCP" }
];

export const exceptionTypes = [
  { code: "0x01", name: "Illegal Function", count: 12, color: "#FF6B6B" },
  { code: "0x02", name: "Illegal Data Address", count: 28, color: "#FFB547" },
  { code: "0x03", name: "Illegal Data Value", count: 8, color: "#3D8BFF" },
  { code: "0x04", name: "Server Failure", count: 5, color: "#00C9A7" },
  { code: "0x05", name: "Acknowledge", count: 3, color: "#64748B" }
];

export const fcDistribution = [
  { name: "FC03", value: 42, color: "#00C9A7" },
  { name: "FC01", value: 18, color: "#3D8BFF" },
  { name: "FC06", value: 15, color: "#FFB547" },
  { name: "FC16", value: 12, color: "#FF6B6B" },
  { name: "FC02", value: 8, color: "#7C3AED" },
  { name: "Autres", value: 5, color: "#64748B" }
];

export const sectionList = [
  { id: "reseau", label: "Reseau & Architecture", icon: "Network" },
  { id: "trame", label: "Analyse de Trame", icon: "Binary" },
  { id: "codes", label: "Function Codes", icon: "Code2" },
  { id: "mbap", label: "En-tete MBAP", icon: "FileCode" },
  { id: "tcp", label: "Parametrage TCP/IP", icon: "Settings" },
  { id: "dashboard", label: "Dashboard Live", icon: "BarChart3" },
  { id: "rtu", label: "RTU vs TCP/IP", icon: "GitCompare" },
  { id: "sequences", label: "Sequences", icon: "Workflow" }
] as const;

export type SectionId = typeof sectionList[number]["id"];
