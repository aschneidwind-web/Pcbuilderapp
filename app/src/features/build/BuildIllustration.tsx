import type { BuildState } from './build.types'

// Gradient pairs per slot for selected state
const COLORS: Record<string, [string, string]> = {
  cpu:         ['#7B2FFF', '#A855F7'],
  cooler:      ['#10B981', '#34D399'],
  gpu:         ['#FF6B9D', '#FF8FAD'],
  motherboard: ['#6366F1', '#818CF8'],
  ram:         ['#F59E0B', '#FBBF24'],
  storage:     ['#06B6D4', '#22D3EE'],
  psu:         ['#EF4444', '#F87171'],
  case:        ['#8B5CF6', '#A78BFA'],
}

const UNSELECTED = { stroke: '#4A4A5A', opacity: 0.2, dasharray: '3 2' }

interface Props {
  build: BuildState
}

/** Renders a low-opacity fill + colored stroke when selected, dashed outline when not */
function partStyle(build: BuildState, slot: keyof typeof COLORS) {
  const selected = build[slot as keyof BuildState] != null
  if (!selected) {
    return {
      fill: 'none',
      stroke: UNSELECTED.stroke,
      strokeDasharray: UNSELECTED.dasharray,
      opacity: UNSELECTED.opacity,
    }
  }
  const [c1] = COLORS[slot]
  return { fill: `${c1}22`, stroke: c1, strokeDasharray: undefined, opacity: 1 }
}

export function BuildIllustration({ build }: Props) {
  const mb = partStyle(build, 'motherboard')
  const cpu = partStyle(build, 'cpu')
  const cooler = partStyle(build, 'cooler')
  const gpu = partStyle(build, 'gpu')
  const ram = partStyle(build, 'ram')
  const storage = partStyle(build, 'storage')
  const psu = partStyle(build, 'psu')

  // Case is always shown
  const caseColor = build.case ? COLORS.case[0] : '#4A4A5A'
  const caseFill = build.case ? `${COLORS.case[0]}11` : 'none'

  return (
    <svg
      viewBox="0 0 220 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 220, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        {/* Pulsing dot animation for selected components */}
        <style>{`
          @keyframes pulse { 0%,100% { opacity:.6; r:2 } 50% { opacity:1; r:3 } }
          .dot { animation: pulse 2s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* Case outline — always visible */}
      <rect
        x="10" y="6" width="200" height="128" rx="6"
        fill={caseFill} stroke={caseColor} strokeWidth="1.2"
        opacity={build.case ? 1 : 0.4}
      />

      {/* Motherboard — large PCB right side */}
      <rect
        x="60" y="14" width="140" height="112" rx="3"
        fill={mb.fill} stroke={mb.stroke} strokeWidth="0.8"
        strokeDasharray={mb.strokeDasharray} opacity={mb.opacity}
      />
      {/* Faint PCB traces when selected */}
      {build.motherboard && (
        <g stroke={COLORS.motherboard[1]} strokeWidth="0.3" opacity="0.25">
          <line x1="80" y1="30" x2="180" y2="30" />
          <line x1="80" y1="50" x2="160" y2="50" />
          <line x1="100" y1="14" x2="100" y2="126" />
          <line x1="140" y1="14" x2="140" y2="126" />
          <line x1="80" y1="90" x2="190" y2="90" />
        </g>
      )}

      {/* CPU — square socket upper-middle of mobo */}
      <rect
        x="105" y="28" width="26" height="26" rx="2"
        fill={cpu.fill} stroke={cpu.stroke} strokeWidth="0.8"
        strokeDasharray={cpu.strokeDasharray} opacity={cpu.opacity}
      />
      {build.cpu && <circle cx="118" cy="41" r="2" fill={COLORS.cpu[0]} className="dot" />}

      {/* Cooler — heatsink/fan assembly on top of CPU */}
      <rect
        x="100" y="23" width="36" height="36" rx="4"
        fill={cooler.fill} stroke={cooler.stroke} strokeWidth="0.8"
        strokeDasharray={cooler.strokeDasharray} opacity={cooler.opacity}
      />
      {/* Fan circle inside cooler */}
      <circle
        cx="118" cy="41" r="12"
        fill="none" stroke={cooler.stroke} strokeWidth="0.5"
        strokeDasharray={cooler.strokeDasharray} opacity={cooler.opacity}
      />
      {build.cooler && <circle cx="132" cy="27" r="2" fill={COLORS.cooler[0]} className="dot" />}

      {/* RAM — two vertical sticks right of CPU */}
      <rect
        x="165" y="24" width="6" height="40" rx="1"
        fill={ram.fill} stroke={ram.stroke} strokeWidth="0.6"
        strokeDasharray={ram.strokeDasharray} opacity={ram.opacity}
      />
      <rect
        x="175" y="24" width="6" height="40" rx="1"
        fill={ram.fill} stroke={ram.stroke} strokeWidth="0.6"
        strokeDasharray={ram.strokeDasharray} opacity={ram.opacity}
      />
      {build.ram && <circle cx="173" cy="28" r="2" fill={COLORS.ram[0]} className="dot" />}

      {/* GPU — large horizontal card lower-middle, extends left */}
      <rect
        x="30" y="76" width="130" height="22" rx="3"
        fill={gpu.fill} stroke={gpu.stroke} strokeWidth="0.8"
        strokeDasharray={gpu.strokeDasharray} opacity={gpu.opacity}
      />
      {/* GPU fans */}
      {build.gpu && (
        <>
          <circle cx="65" cy="87" r="7" fill="none" stroke={COLORS.gpu[1]} strokeWidth="0.4" opacity="0.5" />
          <circle cx="95" cy="87" r="7" fill="none" stroke={COLORS.gpu[1]} strokeWidth="0.4" opacity="0.5" />
          <circle cx="125" cy="87" r="7" fill="none" stroke={COLORS.gpu[1]} strokeWidth="0.4" opacity="0.5" />
          <circle cx="36" cy="80" r="2" fill={COLORS.gpu[0]} className="dot" />
        </>
      )}

      {/* Storage — small M.2 drive lower-right */}
      <rect
        x="155" y="100" width="35" height="8" rx="1.5"
        fill={storage.fill} stroke={storage.stroke} strokeWidth="0.6"
        strokeDasharray={storage.strokeDasharray} opacity={storage.opacity}
      />
      {build.storage && <circle cx="187" cy="104" r="2" fill={COLORS.storage[0]} className="dot" />}

      {/* PSU — rectangular box bottom-left */}
      <rect
        x="16" y="104" width="36" height="24" rx="3"
        fill={psu.fill} stroke={psu.stroke} strokeWidth="0.8"
        strokeDasharray={psu.strokeDasharray} opacity={psu.opacity}
      />
      {build.psu && <circle cx="20" cy="108" r="2" fill={COLORS.psu[0]} className="dot" />}
    </svg>
  )
}
