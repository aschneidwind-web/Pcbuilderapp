import type { Catalog } from './build.types'

export const CATALOG: Catalog = {
  cpu: {
    label: 'CPU',
    ib: '#7B2FFF', ic: '#ffffff', hasPM: true,
    // Chip die with contact pads on all sides
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="5" y="5" width="14" height="14" rx="2.5"/><rect x="8" y="8" width="8" height="8" rx="1"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="16" y1="2" x2="16" y2="5"/><line x1="8" y1="19" x2="8" y2="22"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="2" y1="16" x2="5" y2="16"/><line x1="19" y1="8" x2="22" y2="8"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="19" y1="16" x2="22" y2="16"/></svg>',
    opts: [
      { n: 'Ryzen 5 7600X',   s: '6-core · 4.7GHz · AM5',      p: 229, sk: 'AM5',     pm: 25140 },
      { n: 'Ryzen 7 7800X3D', s: '8-core · 4.5GHz · AM5',      p: 449, sk: 'AM5',     pm: 33180 },
      { n: 'Core i5-14600K',  s: '14-core · 3.5GHz · LGA1700',  p: 289, sk: 'LGA1700', pm: 28900 },
      { n: 'Core i7-14700K',  s: '20-core · 3.4GHz · LGA1700',  p: 389, sk: 'LGA1700', pm: 38200 },
      { n: 'Core i9-14900K',  s: '24-core · 3.2GHz · LGA1700',  p: 549, sk: 'LGA1700', pm: 48500 },
    ],
  },
  cooler: {
    label: 'CPU Cooler',
    ib: '#10B981', ic: '#ffffff', hasPM: false,
    // Tower heatsink with fins and a fan
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="1.5"/><line x1="12" y1="6" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="18"/><line x1="6" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="18" y2="12"/><line x1="8.5" y1="8.5" x2="10" y2="10"/><line x1="14" y1="14" x2="15.5" y2="15.5"/></svg>',
    opts: [
      { n: 'Cooler Master Hyper 212',         s: 'Air | 150W TDP',          p: 45,  tdp: 150 },
      { n: 'Arctic Freezer 34 eSports DUO',   s: 'Air | 210W TDP',          p: 40,  tdp: 210 },
      { n: 'DeepCool AK620',                  s: 'Air | 260W TDP',          p: 65,  tdp: 260 },
      { n: 'be quiet! Dark Rock Pro 5',       s: 'Air | 270W TDP',          p: 90,  tdp: 270 },
      { n: 'Noctua NH-D15',                   s: 'Air | 250W TDP',          p: 110, tdp: 250 },
      { n: 'Lian Li Galahad II Trinity',      s: '360mm AIO | 300W TDP',    p: 130, tdp: 300 },
      { n: 'NZXT Kraken X63',                 s: '280mm AIO | 300W TDP',    p: 150, tdp: 300 },
      { n: 'Corsair iCUE H150i',              s: '360mm AIO | 350W TDP',    p: 170, tdp: 350 },
    ],
  },
  gpu: {
    label: 'GPU',
    ib: '#FF6B9D', ic: '#ffffff', hasPM: true,
    // Graphics card with dual fans and PCIe bracket
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="1" y="7" width="22" height="12" rx="2.5"/><circle cx="7.5" cy="13" r="3.5"/><circle cx="16.5" cy="13" r="3.5"/><line x1="4" y1="7" x2="4" y2="4"/><line x1="8" y1="7" x2="8" y2="4"/><line x1="12" y1="7" x2="12" y2="4"/><circle cx="7.5" cy="13" r="1"/><circle cx="16.5" cy="13" r="1"/></svg>',
    opts: [
      { n: 'RTX 4060',       s: '8GB GDDR6 · 1080p',    p: 299, pm: 18900 },
      { n: 'RTX 4070 Super', s: '12GB GDDR6X · 1440p',   p: 599, pm: 28700 },
      { n: 'RTX 4080 Super', s: '16GB GDDR6X · 4K',      p: 999, pm: 38500 },
      { n: 'RX 7600',        s: '8GB GDDR6 · 1080p',    p: 269, pm: 16400 },
      { n: 'RX 7900 XTX',    s: '24GB GDDR6 · 4K',       p: 879, pm: 34200 },
    ],
  },
  motherboard: {
    label: 'Motherboard',
    ib: '#6366F1', ic: '#ffffff', hasPM: false,
    // PCB with socket, slots, and chipset
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="2"/><rect x="6" y="5" width="5" height="5" rx="1"/><line x1="6" y1="14" x2="18" y2="14"/><line x1="6" y1="17" x2="18" y2="17"/><rect x="14" y="5" width="4" height="3" rx="0.5"/><circle cx="16" cy="11" r="1.5"/><line x1="2" y1="8" x2="4" y2="8"/><line x1="2" y1="12" x2="4" y2="12"/></svg>',
    opts: [
      { n: 'ASUS ROG B650E-F',      s: 'AM5 · DDR5 · ATX',      p: 299, sk: 'AM5',     vrs: 4, feat: 'WiFi 6E, PCIe 5.0, 14+2 VRM' },
      { n: 'MSI MAG B650 Tomahawk', s: 'AM5 · DDR5 · ATX',      p: 199, sk: 'AM5',     vrs: 4, feat: 'WiFi 6E, PCIe 4.0, 12+2 VRM' },
      { n: 'ASUS ROG Maximus Z790', s: 'LGA1700 · DDR5 · ATX',  p: 499, sk: 'LGA1700', vrs: 5, feat: 'WiFi 6E, PCIe 5.0, 20+1 VRM' },
      { n: 'MSI PRO Z790-A WiFi',   s: 'LGA1700 · DDR5 · ATX',  p: 249, sk: 'LGA1700', vrs: 5, feat: 'WiFi 6, PCIe 5.0, 16+1+1 VRM' },
      { n: 'Gigabyte B760M DS3H',   s: 'LGA1700 · DDR4 · mATX', p: 109, sk: 'LGA1700', vrs: 4, feat: 'No WiFi, PCIe 4.0, 8+2+1 VRM' },
    ],
  },
  ram: {
    label: 'RAM',
    ib: '#F59E0B', ic: '#ffffff', hasPM: false,
    // Memory stick with heatspreader and notch
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><line x1="4" y1="7" x2="20" y2="7"/><rect x="7" y="9" width="3" height="5" rx="0.5"/><rect x="12" y="9" width="3" height="5" rx="0.5"/><line x1="10" y1="18" x2="14" y2="18"/><line x1="4" y1="16" x2="20" y2="16"/></svg>',
    opts: [
      { n: 'TeamGroup T-Force 16GB',  s: 'DDR5-5200 · 2×8GB',  p: 65,  mhz: 5200, gb: 16 },
      { n: 'Corsair Vengeance 16GB',  s: 'DDR5-5600 · 2×8GB',  p: 79,  mhz: 5600, gb: 16 },
      { n: 'G.Skill Trident Z5 32GB', s: 'DDR5-6000 · 2×16GB', p: 119, mhz: 6000, gb: 32 },
      { n: 'Kingston Fury 64GB',      s: 'DDR5-5200 · 2×32GB', p: 199, mhz: 5200, gb: 64 },
    ],
  },
  storage: {
    label: 'Storage',
    ib: '#06B6D4', ic: '#ffffff', hasPM: false,
    // M.2 / SSD drive
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="8" width="20" height="8" rx="2"/><circle cx="6" cy="12" r="1.5"/><rect x="10" y="10" width="8" height="4" rx="1"/><line x1="19" y1="10" x2="19" y2="14"/></svg>',
    opts: [
      { n: 'Seagate Barracuda 4TB',     s: 'HDD · 4TB',           p: 69,  read: 220,  tb: 4 },
      { n: 'Samsung 970 Evo 1TB',       s: 'NVMe Gen3 · 1TB',     p: 89,  read: 3500, tb: 1 },
      { n: 'Sabrent Rocket 4 Plus 1TB', s: 'NVMe Gen4 · 1TB',     p: 109, read: 7000, tb: 1 },
      { n: 'Samsung 990 Pro 2TB',       s: 'NVMe Gen4 · 2TB',     p: 159, read: 7450, tb: 2 },
      { n: 'WD Black SN850X 2TB',       s: 'NVMe Gen4 · 2TB',     p: 179, read: 7300, tb: 2 },
    ],
  },
  psu: {
    label: 'PSU',
    ib: '#EF4444', ic: '#ffffff', hasPM: false,
    // Power supply with lightning bolt and fan vent
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="M13 8l-2 4h4l-2 4"/><circle cx="7" cy="12" r="3" stroke-dasharray="2 1.5"/><line x1="17" y1="8" x2="17" y2="16"/></svg>',
    opts: [
      { n: "be quiet! Pure Power 650W", s: '650W · 80+ Gold · Modular',  p: 89,  watts: 650  },
      { n: 'Corsair RM750x',            s: '750W · 80+ Gold · Modular',  p: 119, watts: 750  },
      { n: 'EVGA SuperNOVA 850 G6',     s: '850W · 80+ Gold · Modular',  p: 149, watts: 850  },
      { n: 'Seasonic Focus GX-1000',    s: '1000W · 80+ Gold · Modular', p: 189, watts: 1000 },
    ],
  },
  case: {
    label: 'Case',
    ib: '#8B5CF6', ic: '#ffffff', hasPM: false,
    // PC tower case with front mesh and side panel
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="4" y="1" width="16" height="22" rx="2.5"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="16" x2="15" y2="16"/><circle cx="12" cy="20" r="1"/><rect x="8" y="2.5" width="3" height="2" rx="0.5"/></svg>',
    opts: [
      { n: 'NZXT H510',              s: 'Mid-tower · ATX · Glass',   p: 89  },
      { n: 'Corsair 4000D Airflow',  s: 'Mid-tower · ATX · Mesh',    p: 104 },
      { n: 'Lian Li Lancool 216',    s: 'Mid-tower · ATX · Mesh',    p: 109 },
      { n: 'Fractal Design Torrent', s: 'Mid-tower · ATX · Airflow', p: 189 },
    ],
  },
}
