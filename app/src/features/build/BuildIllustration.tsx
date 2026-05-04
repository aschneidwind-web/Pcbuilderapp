import type { BuildState } from './build.types'

interface Props { build: BuildState }

const COLORS = {
  cpu:         { stroke: '#A855F7', fill: 'rgba(123,47,255,0.15)' },
  cooler:      { stroke: '#34D399', fill: 'rgba(16,185,129,0.15)' },
  gpu:         { stroke: '#FF8FAD', fill: 'rgba(255,107,157,0.15)' },
  motherboard: { stroke: '#818CF8', fill: 'rgba(99,102,241,0.15)' },
  ram:         { stroke: '#FBBF24', fill: 'rgba(245,158,11,0.15)' },
  storage:     { stroke: '#22D3EE', fill: 'rgba(6,182,212,0.15)'  },
  psu:         { stroke: '#F87171', fill: 'rgba(239,68,68,0.15)'  },
  case:        { stroke: '#A78BFA', fill: 'rgba(139,92,246,0.15)' },
}

const UNSELECTED = { stroke: '#4A4A5A', fill: 'none', opacity: 0.3 }

function slotStyle(build: BuildState, key: keyof typeof COLORS) {
  const sel = key in build && build[key as keyof BuildState] !== undefined
  if (sel) return { stroke: COLORS[key].stroke, fill: COLORS[key].fill, opacity: 1, strokeDasharray: 'none' }
  return { stroke: UNSELECTED.stroke, fill: UNSELECTED.fill, opacity: UNSELECTED.opacity, strokeDasharray: '3 2' }
}

export function BuildIllustration({ build }: Props) {
  const mb    = slotStyle(build, 'motherboard')
  const cpu   = slotStyle(build, 'cpu')
  const cooler = slotStyle(build, 'cooler')
  const gpu   = slotStyle(build, 'gpu')
  const ram   = slotStyle(build, 'ram')
  const stor  = slotStyle(build, 'storage')
  const psu   = slotStyle(build, 'psu')

  return (
    <svg
      viewBox="0 0 220 140"
      width={220} height={140}
      style={{ display: 'block', margin: '0 auto' }}
    >
      {/* Case outline — always visible */}
      <rect x="10" y="6" width="200" height="128" rx="6"
        fill="rgba(255,255,255,0.03)" stroke="#6B6B80" strokeWidth="1.2" />
      {/* Case front panel detail */}
      <rect x="10" y="6" width="18" height="128" rx="4"
        fill="rgba(255,255,255,0.04)" stroke="#6B6B80" strokeWidth="0.8" />
      {/* Power button */}
      <circle cx="19" cy="22" r="3" fill="none" stroke="#6B6B80" strokeWidth="0.8" />
      {/* Drive bays suggestion */}
      <rect x="13" y="32" width="12" height="4" rx="1" fill="rgba(255,255,255,0.05)" stroke="#6B6B80" strokeWidth="0.6" />
      <rect x="13" y="38" width="12" height="4" rx="1" fill="rgba(255,255,255,0.05)" stroke="#6B6B80" strokeWidth="0.6" />

      {/* PSU — bottom-left */}
      <rect x="32" y="98" width="52" height="30" rx="3"
        fill={psu.fill} stroke={psu.stroke} strokeWidth="1" opacity={psu.opacity}
        strokeDasharray={psu.strokeDasharray} />
      {/* PSU fan grill */}
      <circle cx="58" cy="113" r="8" fill="none" stroke={psu.stroke} strokeWidth="0.7"
        opacity={psu.opacity} strokeDasharray={psu.strokeDasharray} />
      <line x1="58" y1="105" x2="58" y2="121" stroke={psu.stroke} strokeWidth="0.6" opacity={psu.opacity} />
      <line x1="50" y1="113" x2="66" y2="113" stroke={psu.stroke} strokeWidth="0.6" opacity={psu.opacity} />

      {/* Motherboard — main PCB */}
      <rect x="90" y="14" width="110" height="110" rx="4"
        fill={mb.fill} stroke={mb.stroke} strokeWidth="1.2" opacity={mb.opacity}
        strokeDasharray={mb.strokeDasharray} />
      {/* PCB trace lines */}
      <line x1="90" y1="50" x2="200" y2="50" stroke={mb.stroke} strokeWidth="0.4" opacity={mb.opacity * 0.5} />
      <line x1="90" y1="80" x2="200" y2="80" stroke={mb.stroke} strokeWidth="0.4" opacity={mb.opacity * 0.5} />
      <line x1="130" y1="14" x2="130" y2="124" stroke={mb.stroke} strokeWidth="0.4" opacity={mb.opacity * 0.5} />

      {/* CPU socket — upper-center of mobo */}
      <rect x="148" y="22" width="36" height="36" rx="3"
        fill={cpu.fill} stroke={cpu.stroke} strokeWidth="1.2" opacity={cpu.opacity}
        strokeDasharray={cpu.strokeDasharray} />
      <rect x="154" y="28" width="24" height="24" rx="2"
        fill="none" stroke={cpu.stroke} strokeWidth="0.7" opacity={cpu.opacity} />

      {/* CPU Cooler — on top of CPU */}
      <rect x="143" y="17" width="46" height="46" rx="4"
        fill={cooler.fill} stroke={cooler.stroke} strokeWidth="1" opacity={cooler.opacity}
        strokeDasharray={cooler.strokeDasharray} />
      <circle cx="166" cy="40" r="14" fill="none" stroke={cooler.stroke} strokeWidth="0.8"
        opacity={cooler.opacity} strokeDasharray={cooler.strokeDasharray} />
      <circle cx="166" cy="40" r="5" fill="none" stroke={cooler.stroke} strokeWidth="0.8" opacity={cooler.opacity} />

      {/* RAM sticks — right of CPU */}
      <rect x="189" y="22" width="8" height="30" rx="1.5"
        fill={ram.fill} stroke={ram.stroke} strokeWidth="1" opacity={ram.opacity}
        strokeDasharray={ram.strokeDasharray} />
      <rect x="199" y="22" width="8" height="30" rx="1.5"
        fill={ram.fill} stroke={ram.stroke} strokeWidth="1" opacity={ram.opacity}
        strokeDasharray={ram.strokeDasharray} />
      {/* RAM notch */}
      <rect x="189" y="46" width="8" height="2" rx="0.5" fill={ram.stroke} opacity={ram.opacity * 0.6} />
      <rect x="199" y="46" width="8" height="2" rx="0.5" fill={ram.stroke} opacity={ram.opacity * 0.6} />

      {/* GPU — horizontal PCIe card, lower-center */}
      <rect x="32" y="68" width="155" height="24" rx="3"
        fill={gpu.fill} stroke={gpu.stroke} strokeWidth="1.2" opacity={gpu.opacity}
        strokeDasharray={gpu.strokeDasharray} />
      {/* GPU fans */}
      <circle cx="72" cy="80" r="8" fill="none" stroke={gpu.stroke} strokeWidth="0.8"
        opacity={gpu.opacity} strokeDasharray={gpu.strokeDasharray} />
      <circle cx="100" cy="80" r="8" fill="none" stroke={gpu.stroke} strokeWidth="0.8"
        opacity={gpu.opacity} strokeDasharray={gpu.strokeDasharray} />
      {/* PCIe connector */}
      <rect x="170" y="78" width="17" height="6" rx="1"
        fill="none" stroke={gpu.stroke} strokeWidth="0.8" opacity={gpu.opacity} />

      {/* M.2 Storage — lower-right of mobo */}
      <rect x="96" y="90" width="30" height="8" rx="1.5"
        fill={stor.fill} stroke={stor.stroke} strokeWidth="1" opacity={stor.opacity}
        strokeDasharray={stor.strokeDasharray} />

      {/* Selection pulse dots */}
      {Object.entries(build).map(([key, val]) => {
        if (!val) return null
        const dotPos: Record<string, [number, number]> = {
          motherboard: [145, 11], cpu: [187, 19], cooler: [191, 14],
          gpu: [190, 65], ram: [208, 19], storage: [128, 87], psu: [86, 95],
        }
        const pos = dotPos[key]
        if (!pos) return null
        const c = COLORS[key as keyof typeof COLORS]
        return (
          <circle key={key} cx={pos[0]} cy={pos[1]} r="3" fill={c.stroke}>
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="3;4.5;3" dur="2s" repeatCount="indefinite" />
          </circle>
        )
      })}
    </svg>
  )
}
