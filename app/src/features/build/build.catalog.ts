import type { Catalog } from './build.types'

export const CATALOG: Catalog = {
  cpu: {
    label: 'CPU',
    ib: '#E6F1FB', ic: '#185FA5', hasPM: true,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
    opts: [
      { n: 'Ryzen 5 7600X',   s: '6-core · 4.7GHz · AM5',     p: 229, sk: 'AM5',     pm: 25140 },
      { n: 'Ryzen 7 7800X3D', s: '8-core · 4.5GHz · AM5',     p: 449, sk: 'AM5',     pm: 33180 },
      { n: 'Core i5-14600K',  s: '14-core · 3.5GHz · LGA1700', p: 289, sk: 'LGA1700', pm: 28900 },
      { n: 'Core i7-14700K',  s: '20-core · 3.4GHz · LGA1700', p: 389, sk: 'LGA1700', pm: 38200 },
      { n: 'Core i9-14900K',  s: '24-core · 3.2GHz · LGA1700', p: 549, sk: 'LGA1700', pm: 48500 },
    ],
  },
  cooler: {
    label: 'CPU Cooler',
    ib: '#10B981', ic: '#ffffff', hasPM: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M19.07 4.93l-2.83 2.83M7.76 16.24l-2.83 2.83"/></svg>',
    opts: [
      { n: 'Cooler Master Hyper 212',       s: 'Air | 150W TDP',        p: 45,  tdp: 150 },
      { n: 'Arctic Freezer 34 eSports DUO', s: 'Air | 210W TDP',        p: 40,  tdp: 210 },
      { n: 'DeepCool AK620',               s: 'Air | 260W TDP',        p: 65,  tdp: 260 },
      { n: 'be quiet! Dark Rock Pro 5',    s: 'Air | 270W TDP',        p: 90,  tdp: 270 },
      { n: 'Noctua NH-D15',               s: 'Air | 250W TDP',        p: 110, tdp: 250 },
      { n: 'NZXT Kraken X63',             s: '280mm AIO | 300W TDP',  p: 150, tdp: 300 },
      { n: 'Lian Li Galahad II Trinity',   s: '360mm AIO | 300W TDP',  p: 130, tdp: 300 },
      { n: 'Corsair iCUE H150i',          s: '360mm AIO | 350W TDP',  p: 170, tdp: 350 },
    ],
  },
  gpu: {
    label: 'GPU',
    ib: '#FCEBEB', ic: '#A32D2D', hasPM: true,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="7" width="20" height="12" rx="2"/><circle cx="8" cy="13" r="2"/><circle cx="16" cy="13" r="2"/><path d="M6 7V4M10 7V4M14 7V4M18 7V4"/></svg>',
    opts: [
      { n: 'RTX 4060',       s: '8GB GDDR6 · 1080p',   p: 299, pm: 18900 },
      { n: 'RTX 4070 Super', s: '12GB GDDR6X · 1440p',  p: 599, pm: 28700 },
      { n: 'RTX 4080 Super', s: '16GB GDDR6X · 4K',     p: 999, pm: 38500 },
      { n: 'RX 7600',        s: '8GB GDDR6 · 1080p',   p: 269, pm: 16400 },
      { n: 'RX 7900 XTX',    s: '24GB GDDR6 · 4K',      p: 879, pm: 34200 },
    ],
  },
  motherboard: {
    label: 'Motherboard',
    ib: '#EAF3DE', ic: '#3B6D11', hasPM: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="4" height="4"/><rect x="13" y="7" width="4" height="4"/><line x1="7" y1="15" x2="17" y2="15"/><line x1="7" y1="18" x2="17" y2="18"/></svg>',
    opts: [
      { n: 'ASUS ROG B650E-F',      s: 'AM5 · DDR5 · ATX',     p: 299, sk: 'AM5',     vrs: 4, feat: 'WiFi 6E, PCIe 5.0, 14+2 VRM' },
      { n: 'MSI MAG B650 Tomahawk', s: 'AM5 · DDR5 · ATX',     p: 199, sk: 'AM5',     vrs: 4, feat: 'WiFi 6E, PCIe 4.0, 12+2 VRM' },
      { n: 'ASUS ROG Maximus Z790', s: 'LGA1700 · DDR5 · ATX', p: 499, sk: 'LGA1700', vrs: 5, feat: 'WiFi 6E, PCIe 5.0, 20+1 VRM' },
      { n: 'MSI PRO Z790-A WiFi',   s: 'LGA1700 · DDR5 · ATX', p: 249, sk: 'LGA1700', vrs: 5, feat: 'WiFi 6, PCIe 5.0, 16+1+1 VRM' },
      { n: 'Gigabyte B760M DS3H',   s: 'LGA1700 · DDR4 · mATX',p: 109, sk: 'LGA1700', vrs: 4, feat: 'No WiFi, PCIe 4.0, 8+2+1 VRM' },
    ],
  },
  ram: {
    label: 'RAM',
    ib: '#EEEDFE', ic: '#534AB7', hasPM: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="7" width="18" height="10" rx="1"/><line x1="7" y1="7" x2="7" y2="17"/><line x1="11" y1="7" x2="11" y2="17"/><line x1="15" y1="7" x2="15" y2="17"/><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    opts: [
      { n: 'TeamGroup T-Force 16GB',  s: 'DDR5-5200 · 2×8GB',  p: 65,  mhz: 5200, gb: 16 },
      { n: 'Corsair Vengeance 16GB',  s: 'DDR5-5600 · 2×8GB',  p: 79,  mhz: 5600, gb: 16 },
      { n: 'G.Skill Trident Z5 32GB', s: 'DDR5-6000 · 2×16GB', p: 119, mhz: 6000, gb: 32 },
      { n: 'Kingston Fury 64GB',      s: 'DDR5-5200 · 2×32GB', p: 199, mhz: 5200, gb: 64 },
    ],
  },
  storage: {
    label: 'Storage',
    ib: '#E1F5EE', ic: '#0F6E56', hasPM: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="16" cy="12" r="2"/><line x1="6" y1="12" x2="10" y2="12"/></svg>',
    opts: [
      { n: 'Seagate Barracuda 4TB',     s: 'HDD · 4TB',          p: 69,  read: 220,  tb: 4 },
      { n: 'Samsung 970 Evo 1TB',       s: 'NVMe Gen3 · 1TB',    p: 89,  read: 3500, tb: 1 },
      { n: 'Sabrent Rocket 4 Plus 1TB', s: 'NVMe Gen4 · 1TB',    p: 109, read: 7000, tb: 1 },
      { n: 'Samsung 990 Pro 2TB',       s: 'NVMe Gen4 · 2TB',    p: 159, read: 7450, tb: 2 },
      { n: 'WD Black SN850X 2TB',       s: 'NVMe Gen4 · 2TB',    p: 179, read: 7300, tb: 2 },
    ],
  },
  psu: {
    label: 'PSU',
    ib: '#FAEEDA', ic: '#854F0B', hasPM: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M13 10l-2 4h4l-2 4"/></svg>',
    opts: [
      { n: "be quiet! Pure Power 650W", s: '650W · 80+ Gold · Modular',  p: 89,  watts: 650  },
      { n: 'Corsair RM750x',            s: '750W · 80+ Gold · Modular',  p: 119, watts: 750  },
      { n: 'EVGA SuperNOVA 850 G6',     s: '850W · 80+ Gold · Modular',  p: 149, watts: 850  },
      { n: 'Seasonic Focus GX-1000',    s: '1000W · 80+ Gold · Modular', p: 189, watts: 1000 },
    ],
  },
  case: {
    label: 'Case',
    ib: '#F1EFE8', ic: '#5F5E5A', hasPM: false,
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><circle cx="12" cy="17" r="1"/></svg>',
    opts: [
      { n: 'NZXT H510',               s: 'Mid-tower · ATX · Glass',    p: 89  },
      { n: 'Corsair 4000D Airflow',   s: 'Mid-tower · ATX · Mesh',     p: 104 },
      { n: 'Lian Li Lancool 216',     s: 'Mid-tower · ATX · Mesh',     p: 109 },
      { n: 'Fractal Design Torrent',  s: 'Mid-tower · ATX · Airflow',  p: 189 },
    ],
  },
}
