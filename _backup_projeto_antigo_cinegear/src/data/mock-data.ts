// Mock data for CineGear demo

export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: 'available' | 'reserved' | 'maintenance' | 'unavailable';
  dailyRate: number;
  location: string;
  notes: string;
  image?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  document: string;
  reservationCount: number;
  totalSpent: number;
}

export interface Reservation {
  id: string;
  clientId: string;
  clientName: string;
  equipment: string[];
  pickupDate: string;
  returnDate: string;
  totalValue: number;
  status: 'quote' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Kit {
  id: string;
  name: string;
  items: string[];
  dailyRate: number;
  description: string;
}

export interface Contract {
  id: string;
  reservationId: string;
  clientName: string;
  status: 'draft' | 'signed' | 'active' | 'completed';
  createdAt: string;
  value: number;
}

export interface Quote {
  id: string;
  clientName: string;
  items: { name: string; qty: number; dailyRate: number; days: number }[];
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
  total: number;
  createdAt: string;
  validUntil: string;
  notes: string;
}

export interface AgendaEvent {
  id: string;
  type: 'pickup' | 'return' | 'reservation';
  clientName: string;
  equipment: string[];
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export const equipmentData: Equipment[] = [
  { id: '1', name: 'Sony FX6', category: 'Câmeras', brand: 'Sony', model: 'FX6', serialNumber: 'SN-FX6-001', status: 'available', dailyRate: 800, location: 'Estúdio A', notes: 'Full-frame cinema camera' },
  { id: '2', name: 'Canon C70', category: 'Câmeras', brand: 'Canon', model: 'C70', serialNumber: 'SN-C70-001', status: 'reserved', dailyRate: 650, location: 'Estúdio A', notes: 'RF mount cinema camera' },
  { id: '3', name: 'RED Komodo 6K', category: 'Câmeras', brand: 'RED', model: 'Komodo 6K', serialNumber: 'SN-RED-001', status: 'available', dailyRate: 1200, location: 'Estúdio B', notes: 'Compact cinema camera' },
  { id: '4', name: 'ARRI Alexa Mini LF', category: 'Câmeras', brand: 'ARRI', model: 'Alexa Mini LF', serialNumber: 'SN-ARRI-001', status: 'maintenance', dailyRate: 3500, location: 'Manutenção', notes: 'Large format cinema camera' },
  { id: '5', name: 'Sony 24-70mm f/2.8 GM II', category: 'Lentes', brand: 'Sony', model: '24-70mm f/2.8', serialNumber: 'SN-L24-001', status: 'available', dailyRate: 180, location: 'Estúdio A', notes: 'Zoom padrão premium' },
  { id: '6', name: 'Canon RF 50mm f/1.2L', category: 'Lentes', brand: 'Canon', model: 'RF 50mm f/1.2L', serialNumber: 'SN-L50-001', status: 'available', dailyRate: 200, location: 'Estúdio A', notes: 'Lente prime premium' },
  { id: '7', name: 'Aputure 600d Pro', category: 'Iluminação', brand: 'Aputure', model: '600d Pro', serialNumber: 'SN-AP6-001', status: 'available', dailyRate: 250, location: 'Estúdio B', notes: 'LED daylight' },
  { id: '8', name: 'ARRI SkyPanel S60-C', category: 'Iluminação', brand: 'ARRI', model: 'SkyPanel S60-C', serialNumber: 'SN-SKY-001', status: 'reserved', dailyRate: 450, location: 'Estúdio A', notes: 'Painel LED RGBW' },
  { id: '9', name: 'Sennheiser MKH 416', category: 'Áudio', brand: 'Sennheiser', model: 'MKH 416', serialNumber: 'SN-MK4-001', status: 'available', dailyRate: 120, location: 'Estúdio A', notes: 'Shotgun mic' },
  { id: '10', name: 'Sound Devices MixPre-6 II', category: 'Áudio', brand: 'Sound Devices', model: 'MixPre-6 II', serialNumber: 'SN-MP6-001', status: 'available', dailyRate: 200, location: 'Estúdio A', notes: 'Field recorder' },
  { id: '11', name: 'DJI Ronin 4D Gimbal', category: 'Grip', brand: 'DJI', model: 'Ronin 4D', serialNumber: 'SN-RN4-001', status: 'available', dailyRate: 350, location: 'Estúdio B', notes: 'Gimbal estabilizador' },
  { id: '12', name: 'SmallHD Cine 7', category: 'Monitores', brand: 'SmallHD', model: 'Cine 7', serialNumber: 'SN-SH7-001', status: 'available', dailyRate: 180, location: 'Estúdio A', notes: 'Monitor de campo 7"' },
  { id: '13', name: 'Blackmagic ATEM Mini Pro', category: 'Acessórios', brand: 'Blackmagic', model: 'ATEM Mini Pro', serialNumber: 'SN-BM-001', status: 'available', dailyRate: 150, location: 'Estúdio B', notes: 'Switcher live' },
  { id: '14', name: 'Sigma 18-35mm f/1.8 Art', category: 'Lentes', brand: 'Sigma', model: '18-35mm f/1.8', serialNumber: 'SN-SIG-001', status: 'available', dailyRate: 150, location: 'Estúdio A', notes: 'Lente zoom cine' },
  { id: '15', name: 'Godox AD600 Pro', category: 'Iluminação', brand: 'Godox', model: 'AD600 Pro', serialNumber: 'SN-GD6-001', status: 'unavailable', dailyRate: 180, location: 'Externo', notes: 'Flash portátil' },
];

export const clientsData: Client[] = [
  { id: '1', name: 'Rafael Mendes', company: 'Mendes Produções', phone: '(11) 99876-5432', email: 'rafael@mendesproducoes.com', document: '12.345.678/0001-90', reservationCount: 12, totalSpent: 45600 },
  { id: '2', name: 'Ana Clara Silva', company: 'Studio ACS', phone: '(11) 98765-4321', email: 'ana@studioacs.com', document: '23.456.789/0001-01', reservationCount: 8, totalSpent: 32400 },
  { id: '3', name: 'Bruno Costa', company: 'Costa Filmes', phone: '(21) 99654-3210', email: 'bruno@costafilmes.com', document: '34.567.890/0001-12', reservationCount: 15, totalSpent: 78200 },
  { id: '4', name: 'Camila Rodrigues', company: 'Rodrigues Media', phone: '(31) 98543-2109', email: 'camila@rodriguesmedia.com', document: '45.678.901/0001-23', reservationCount: 5, totalSpent: 15800 },
  { id: '5', name: 'Diego Almeida', company: 'DA Audiovisual', phone: '(41) 97432-1098', email: 'diego@daaudiovisual.com', document: '56.789.012/0001-34', reservationCount: 20, totalSpent: 96500 },
  { id: '6', name: 'Fernanda Lima', company: 'Lima Studios', phone: '(51) 96321-0987', email: 'fernanda@limastudios.com', document: '67.890.123/0001-45', reservationCount: 3, totalSpent: 8900 },
];

export const reservationsData: Reservation[] = [
  { id: 'RES-001', clientId: '1', clientName: 'Rafael Mendes', equipment: ['Sony FX6', 'Sony 24-70mm f/2.8 GM II', 'Aputure 600d Pro'], pickupDate: '2026-03-16', returnDate: '2026-03-19', totalValue: 3690, status: 'in_progress' },
  { id: 'RES-002', clientId: '3', clientName: 'Bruno Costa', equipment: ['RED Komodo 6K', 'SmallHD Cine 7', 'DJI Ronin 4D Gimbal'], pickupDate: '2026-03-17', returnDate: '2026-03-20', totalValue: 5190, status: 'approved' },
  { id: 'RES-003', clientId: '2', clientName: 'Ana Clara Silva', equipment: ['Canon C70', 'ARRI SkyPanel S60-C'], pickupDate: '2026-03-18', returnDate: '2026-03-22', totalValue: 4400, status: 'approved' },
  { id: 'RES-004', clientId: '5', clientName: 'Diego Almeida', equipment: ['Sony FX6', 'Sennheiser MKH 416', 'Sound Devices MixPre-6 II'], pickupDate: '2026-03-14', returnDate: '2026-03-16', totalValue: 2240, status: 'completed' },
  { id: 'RES-005', clientId: '4', clientName: 'Camila Rodrigues', equipment: ['Canon C70', 'Canon RF 50mm f/1.2L'], pickupDate: '2026-03-20', returnDate: '2026-03-23', totalValue: 2550, status: 'quote' },
  { id: 'RES-006', clientId: '6', clientName: 'Fernanda Lima', equipment: ['Blackmagic ATEM Mini Pro'], pickupDate: '2026-03-15', returnDate: '2026-03-16', totalValue: 300, status: 'cancelled' },
  { id: 'RES-007', clientId: '1', clientName: 'Rafael Mendes', equipment: ['ARRI Alexa Mini LF', 'ARRI SkyPanel S60-C'], pickupDate: '2026-03-25', returnDate: '2026-03-30', totalValue: 19750, status: 'approved' },
];

export const kitsData: Kit[] = [
  { id: '1', name: 'Kit Sony FX6 Completo', items: ['Sony FX6', 'Sony 24-70mm f/2.8 GM II', 'SmallHD Cine 7', 'Sennheiser MKH 416'], dailyRate: 1200, description: 'Kit completo para produção documental' },
  { id: '2', name: 'Kit Iluminação Estúdio', items: ['Aputure 600d Pro', 'ARRI SkyPanel S60-C', 'Godox AD600 Pro'], dailyRate: 750, description: 'Kit de iluminação para estúdio' },
  { id: '3', name: 'Kit Áudio Profissional', items: ['Sennheiser MKH 416', 'Sound Devices MixPre-6 II'], dailyRate: 280, description: 'Kit de captação de áudio' },
  { id: '4', name: 'Kit RED Cinema', items: ['RED Komodo 6K', 'DJI Ronin 4D Gimbal', 'SmallHD Cine 7'], dailyRate: 1500, description: 'Kit cinema RED compacto' },
];

export const contractsData: Contract[] = [
  { id: 'CTR-001', reservationId: 'RES-001', clientName: 'Rafael Mendes', status: 'active', createdAt: '2026-03-15', value: 3690 },
  { id: 'CTR-002', reservationId: 'RES-004', clientName: 'Diego Almeida', status: 'completed', createdAt: '2026-03-13', value: 2240 },
  { id: 'CTR-003', reservationId: 'RES-002', clientName: 'Bruno Costa', status: 'signed', createdAt: '2026-03-16', value: 5190 },
  { id: 'CTR-004', reservationId: 'RES-003', clientName: 'Ana Clara Silva', status: 'draft', createdAt: '2026-03-17', value: 4400 },
];

export const quotesData: Quote[] = [
  { id: 'ORC-001', clientName: 'Camila Rodrigues', items: [{ name: 'Canon C70', qty: 1, dailyRate: 650, days: 3 }, { name: 'Canon RF 50mm f/1.2L', qty: 1, dailyRate: 200, days: 3 }], status: 'sent', total: 2550, createdAt: '2026-03-14', validUntil: '2026-03-21', notes: 'Produção comercial' },
  { id: 'ORC-002', clientName: 'Rafael Mendes', items: [{ name: 'ARRI Alexa Mini LF', qty: 1, dailyRate: 3500, days: 5 }, { name: 'ARRI SkyPanel S60-C', qty: 1, dailyRate: 450, days: 5 }], status: 'approved', total: 19750, createdAt: '2026-03-12', validUntil: '2026-03-19', notes: 'Longa-metragem' },
  { id: 'ORC-003', clientName: 'Fernanda Lima', items: [{ name: 'Sony FX6', qty: 1, dailyRate: 800, days: 2 }, { name: 'Aputure 600d Pro', qty: 2, dailyRate: 250, days: 2 }], status: 'draft', total: 2600, createdAt: '2026-03-16', validUntil: '2026-03-23', notes: 'Evento corporativo' },
  { id: 'ORC-004', clientName: 'Bruno Costa', items: [{ name: 'RED Komodo 6K', qty: 1, dailyRate: 1200, days: 7 }], status: 'converted', total: 8400, createdAt: '2026-03-05', validUntil: '2026-03-12', notes: 'Série documental' },
  { id: 'ORC-005', clientName: 'Ana Clara Silva', items: [{ name: 'Kit Iluminação Estúdio', qty: 1, dailyRate: 750, days: 4 }], status: 'rejected', total: 3000, createdAt: '2026-03-10', validUntil: '2026-03-17', notes: 'Sessão fotográfica' },
];

export const agendaEvents: AgendaEvent[] = [
  { id: '1', type: 'pickup', clientName: 'Rafael Mendes', equipment: ['Sony FX6', 'Sony 24-70mm'], date: '2026-03-16', time: '09:00', status: 'confirmed' },
  { id: '2', type: 'return', clientName: 'Diego Almeida', equipment: ['Sony FX6', 'MKH 416'], date: '2026-03-16', time: '14:00', status: 'pending' },
  { id: '3', type: 'pickup', clientName: 'Bruno Costa', equipment: ['RED Komodo 6K', 'Ronin 4D'], date: '2026-03-17', time: '10:00', status: 'confirmed' },
  { id: '4', type: 'pickup', clientName: 'Ana Clara Silva', equipment: ['Canon C70', 'SkyPanel'], date: '2026-03-18', time: '08:30', status: 'pending' },
  { id: '5', type: 'return', clientName: 'Rafael Mendes', equipment: ['Sony FX6', 'Sony 24-70mm'], date: '2026-03-19', time: '17:00', status: 'pending' },
  { id: '6', type: 'return', clientName: 'Bruno Costa', equipment: ['RED Komodo 6K', 'Ronin 4D'], date: '2026-03-20', time: '16:00', status: 'pending' },
];

export const monthlyRevenue = [
  { month: 'Set', revenue: 28500, projected: 30000 },
  { month: 'Out', revenue: 34200, projected: 32000 },
  { month: 'Nov', revenue: 41800, projected: 38000 },
  { month: 'Dez', revenue: 52300, projected: 48000 },
  { month: 'Jan', revenue: 38900, projected: 42000 },
  { month: 'Fev', revenue: 45600, projected: 44000 },
  { month: 'Mar', revenue: 32400, projected: 50000 },
];

export const reservationsByStatus = [
  { name: 'Aprovadas', value: 12, fill: 'hsl(43, 74%, 49%)' },
  { name: 'Em andamento', value: 5, fill: 'hsl(217, 91%, 60%)' },
  { name: 'Finalizadas', value: 28, fill: 'hsl(142, 71%, 45%)' },
  { name: 'Canceladas', value: 3, fill: 'hsl(0, 84%, 60%)' },
];
