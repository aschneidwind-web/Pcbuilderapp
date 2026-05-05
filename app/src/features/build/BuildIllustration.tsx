import type { BuildState, SlotKey } from './build.types'
import { SLOT_KEYS } from './build.types'

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

interface PartStyle {
  fill: string
  stroke: string
  dasharray: string | undefined
  opacity: number
  animation: string | undefined
}

function partStyle(build: BuildState, slot: string, allComplete: boolean): PartStyle {
  const selected = build[slot as SlotKey] != null
  if (!selected) {
    return { fill: 'none', stroke: '#4A4A5A', dasharray: '3 2', opacity: 0.15, animation: undefined }
  }
  const [c1] = COLORS[slot]
  return {
    fill: `${c1}18`,
    stroke: c1,
    dasharray: undefined,
    opacity: 1,
    animation: allComplete ? 'borderPulse 4s ease-in-out infinite' : undefined,
  }
}

interface Props {
  build: BuildState
}

export function BuildIllustration({ build }: Props) {
  const allSelected = SLOT_KEYS.every(k => build[k] != null)
  const mb   = partStyle(build, 'motherboard', allSelected)
  const cpu  = partStyle(build, 'cpu',         allSelected)
  const cooler = partStyle(build, 'cooler',    allSelected)
  const gpu  = partStyle(build, 'gpu',         allSelected)
  const ram  = partStyle(build, 'ram',         allSelected)
  const stor = partStyle(build, 'storage',     allSelected)
  const psu  = partStyle(build, 'psu',         allSelected)

  const caseOn = build.case != null
  const cStroke = caseOn ? COLORS.case[0] : '#555'
  const cOp = caseOn ? 0.7 : 0.35

  return (
    <svg
      viewBox="0 0 340 250"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 280, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <defs>
        <style>{`
          @keyframes borderPulse { 0%,100% { opacity:1; stroke-width:0.6; } 50% { opacity:0.2; stroke-width:2.5; } }
          @keyframes caseStroke { from { stroke-dashoffset:1044; } to { stroke-dashoffset:0; } }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
      </defs>

      {/* ── Case shell ── */}
      <rect x="25" y="8" width="290" height="232" rx="5"
        fill="none" stroke={cStroke} strokeWidth="1.5" opacity={cOp}
      />
      {allSelected && (
        <rect x="25" y="8" width="290" height="232" rx="5"
          fill="none"
          stroke={COLORS.case[0]}
          strokeWidth="1.5"
          strokeDasharray="1044"
          strokeDashoffset="1044"
          style={{ animation: 'caseStroke 1.2s ease-out forwards' }}
        />
      )}
      {/* Front panel */}
      <rect x="295" y="8" width="20" height="232" fill="#1a1a1f"
        stroke={cStroke} strokeWidth="0.6" opacity={cOp * 0.6}
      />
      {/* Front vents */}
      {[30, 38, 46, 54].map(y => (
        <line key={y} x1="299" y1={y} x2="311" y2={y}
          stroke="#555" strokeWidth="0.4" opacity={cOp * 0.4}
        />
      ))}
      {/* Back panel */}
      <rect x="25" y="8" width="12" height="232" rx="5"
        fill="#1a1a1f" stroke={cStroke} strokeWidth="0.6" opacity={cOp * 0.6}
      />
      {/* Back I/O cutout */}
      <rect x="27" y="16" width="8" height="28" rx="1"
        fill="none" stroke="#555" strokeWidth="0.3" opacity={cOp * 0.4}
      />
      {/* PCIe bracket slots */}
      {[100, 108, 116, 124].map(y => (
        <line key={y} x1="28" y1={y} x2="34" y2={y}
          stroke="#555" strokeWidth="0.5" opacity={cOp * 0.35}
        />
      ))}
      {/* PSU shroud divider */}
      <line x1="37" y1="186" x2="295" y2="186"
        stroke="#555" strokeWidth="0.7" opacity={cOp * 0.5}
      />

      {/* ── Motherboard ── */}
      <rect x="46" y="14" width="240" height="168" rx="2"
        fill={mb.fill} stroke={mb.stroke} strokeWidth="0.6"
        strokeDasharray={mb.dasharray} opacity={mb.opacity}
        style={{ animation: mb.animation }}
      />
      {build.motherboard && (
        <>
          {/* PCB traces */}
          <g stroke={COLORS.motherboard[1]} strokeWidth="0.25" opacity="0.12">
            <line x1="60" y1="42" x2="270" y2="42" />
            <line x1="60" y1="75" x2="250" y2="75" />
            <line x1="100" y1="14" x2="100" y2="182" />
            <line x1="180" y1="14" x2="180" y2="182" />
            <line x1="240" y1="14" x2="240" y2="182" />
            <line x1="60" y1="130" x2="275" y2="130" />
          </g>
          {/* Mounting holes */}
          <g fill="none" stroke="#555" strokeWidth="0.3" opacity="0.25">
            <circle cx="52" cy="20" r="2" />
            <circle cx="280" cy="20" r="2" />
            <circle cx="52" cy="176" r="2" />
            <circle cx="280" cy="176" r="2" />
          </g>
          {/* PCIe slots */}
          <g fill="#1a1a22" stroke="#555" strokeWidth="0.3" opacity="0.35">
            <rect x="55" y="100" width="160" height="3" rx="0.5" />
            <rect x="55" y="110" width="160" height="3" rx="0.5" />
            <rect x="55" y="120" width="100" height="2.5" rx="0.5" />
          </g>
        </>
      )}

      {/* ── CPU ── */}
      <rect x="140" y="28" width="42" height="42" rx="2"
        fill={cpu.fill} stroke={cpu.stroke} strokeWidth="0.6"
        strokeDasharray={cpu.dasharray} opacity={cpu.opacity}
        style={{ animation: cpu.animation }}
      />
      {build.cpu && (
        <>
          <rect x="149" y="37" width="24" height="24" rx="1.5"
            fill={`${COLORS.cpu[0]}25`} stroke={COLORS.cpu[1]} strokeWidth="0.4"
          />
          <g stroke={COLORS.cpu[1]} strokeWidth="0.2" opacity="0.2">
            {[146, 151, 156, 161, 166, 171, 176].map(x => (
              <line key={x} x1={x} y1="28" x2={x} y2="24" />
            ))}
          </g>
        </>
      )}

      {/* ── CPU Cooler (tower heatsink) ── */}
      <rect x="132" y="20" width="58" height="58" rx="3"
        fill={cooler.fill} stroke={cooler.stroke} strokeWidth="0.6"
        strokeDasharray={cooler.dasharray} opacity={cooler.opacity}
        style={{ animation: cooler.animation }}
      />
      {build.cooler && (
        <>
          {/* Heatsink fins */}
          <g stroke={COLORS.cooler[1]} strokeWidth="0.3" opacity="0.25">
            {Array.from({ length: 14 }, (_, i) => 136 + i * 3.6).map((x, i) => (
              <line key={i} x1={x} y1="23" x2={x} y2="74" />
            ))}
          </g>
          {/* Fan blades */}
          <g style={allSelected ? { transformBox: 'fill-box', transformOrigin: 'center', animation: 'spin 1.5s linear infinite' } : undefined}>
            <g stroke={COLORS.cooler[1]} strokeWidth="0.35" opacity="0.18">
              <line x1="161" y1="32" x2="161" y2="40" />
              <line x1="161" y1="58" x2="161" y2="66" />
              <line x1="144" y1="49" x2="152" y2="49" />
              <line x1="170" y1="49" x2="178" y2="49" />
              <line x1="149" y1="37" x2="155" y2="43" />
              <line x1="167" y1="55" x2="173" y2="61" />
              <line x1="173" y1="37" x2="167" y2="43" />
              <line x1="155" y1="55" x2="149" y2="61" />
            </g>
          </g>
          {/* Heatpipes */}
          <g fill="none" stroke={COLORS.cooler[1]} strokeWidth="0.35" opacity="0.2">
            <path d="M153 74 Q153 79 156 81 Q161 84 161 80" />
            <path d="M165 74 Q165 79 168 81 Q173 84 173 80" />
          </g>
        </>
      )}
      {/* Fan circle outline — always shown */}
      <circle cx="161" cy="49" r="20"
        fill="none" stroke={cooler.stroke} strokeWidth="0.4"
        strokeDasharray={cooler.dasharray} opacity={cooler.opacity * 0.35}
      />
      <circle cx="161" cy="49" r="3.5"
        fill={cooler.fill} stroke={cooler.stroke} strokeWidth="0.3"
        strokeDasharray={cooler.dasharray} opacity={cooler.opacity * 0.5}
      />

      {/* ── RAM ── */}
      <rect x="218" y="24" width="7" height="56" rx="1"
        fill={ram.fill} stroke={ram.stroke} strokeWidth="0.5"
        strokeDasharray={ram.dasharray} opacity={ram.opacity}
        style={{ animation: ram.animation }}
      />
      <rect x="229" y="24" width="7" height="56" rx="1"
        fill={ram.fill} stroke={ram.stroke} strokeWidth="0.5"
        strokeDasharray={ram.dasharray} opacity={ram.opacity}
        style={{ animation: ram.animation }}
      />
      {build.ram && (
        <>
          {/* Chips on the sticks */}
          <g fill={`${COLORS.ram[1]}20`}>
            {[28, 36, 44, 52].map(y => (
              <g key={y}>
                <rect x="219" y={y} width="5" height="4" rx="0.5" />
                <rect x="230" y={y} width="5" height="4" rx="0.5" />
              </g>
            ))}
          </g>
          {/* Latch tabs */}
          <g stroke={COLORS.ram[0]} strokeWidth="0.4" opacity="0.35">
            <line x1="221.5" y1="24" x2="221.5" y2="21" />
            <line x1="232.5" y1="24" x2="232.5" y2="21" />
          </g>
        </>
      )}

      {/* ── GPU ── */}
      <rect x="50" y="96" width="200" height="28" rx="2.5"
        fill={gpu.fill} stroke={gpu.stroke} strokeWidth="0.6"
        strokeDasharray={gpu.dasharray} opacity={gpu.opacity}
        style={{ animation: gpu.animation }}
      />
      {build.gpu && (
        <>
          {/* Backplate */}
          <rect x="50" y="93" width="200" height="4" rx="1.5"
            fill="#2a2a2e" fillOpacity="0.4" stroke={COLORS.gpu[1]} strokeWidth="0.2"
          />
          {/* Power connector */}
          <rect x="238" y="102" width="10" height="6" rx="1"
            fill="none" stroke={COLORS.gpu[1]} strokeWidth="0.3" opacity="0.35"
          />
          {/* PCIe gold fingers */}
          <rect x="50" y="124" width="46" height="2.5" rx="0.5"
            fill={`${COLORS.gpu[0]}25`} stroke={COLORS.gpu[1]} strokeWidth="0.2"
          />
        </>
      )}
      {/* Triple fan — always outline, detail when selected */}
      {[100, 150, 200].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="110" r="10"
            fill="none" stroke={gpu.stroke} strokeWidth="0.35"
            strokeDasharray={gpu.dasharray} opacity={gpu.opacity * 0.35}
          />
          {build.gpu && (
            <>
              <circle cx={cx} cy="110" r="2.5"
                fill={`${COLORS.gpu[0]}18`} stroke={COLORS.gpu[1]} strokeWidth="0.3"
              />
              <g style={allSelected ? { transformBox: 'fill-box', transformOrigin: 'center', animation: 'spin 1.5s linear infinite' } : undefined}>
                <g stroke={COLORS.gpu[1]} strokeWidth="0.3" opacity="0.18">
                  <line x1={cx} y1="102" x2={cx} y2="106" />
                  <line x1={cx} y1="114" x2={cx} y2="118" />
                  <line x1={cx - 6} y1="110" x2={cx - 3} y2="110" />
                  <line x1={cx + 3} y1="110" x2={cx + 6} y2="110" />
                </g>
              </g>
            </>
          )}
        </g>
      ))}

      {/* ── Storage ── */}
      {/* M.2 on motherboard */}
      <rect x="190" y="150" width="48" height="6" rx="1.5"
        fill={stor.fill} stroke={stor.stroke} strokeWidth="0.5"
        strokeDasharray={stor.dasharray} opacity={stor.opacity}
        style={{ animation: stor.animation }}
      />
      {build.storage && (
        <>
          <circle cx="194" cy="153" r="1.2"
            fill="none" stroke={COLORS.storage[1]} strokeWidth="0.3" opacity="0.4"
          />
          <rect x="198" y="151" width="18" height="3.5" rx="0.5"
            fill={`${COLORS.storage[0]}18`}
          />
        </>
      )}
      {/* 2.5" SSD below PSU shroud */}
      <rect x="256" y="192" width="36" height="24" rx="2"
        fill={stor.fill} stroke={stor.stroke} strokeWidth="0.5"
        strokeDasharray={stor.dasharray} opacity={stor.opacity}
        style={{ animation: stor.animation }}
      />

      {/* ── PSU ── */}
      <rect x="40" y="192" width="108" height="42" rx="3"
        fill={psu.fill} stroke={psu.stroke} strokeWidth="0.6"
        strokeDasharray={psu.dasharray} opacity={psu.opacity}
        style={{ animation: psu.animation }}
      />
      <circle cx="94" cy="213" r="15"
        fill="none" stroke={psu.stroke} strokeWidth="0.35"
        strokeDasharray={psu.dasharray} opacity={psu.opacity * 0.3}
      />
      {build.psu && (
        <>
          <circle cx="94" cy="213" r="3"
            fill={`${COLORS.psu[0]}15`} stroke={COLORS.psu[1]} strokeWidth="0.3"
          />
          <g stroke={COLORS.psu[1]} strokeWidth="0.3" opacity="0.18">
            <line x1="94" y1="201" x2="94" y2="207" />
            <line x1="94" y1="219" x2="94" y2="225" />
            <line x1="82" y1="213" x2="88" y2="213" />
            <line x1="100" y1="213" x2="106" y2="213" />
          </g>
          {/* Label plate */}
          <rect x="46" y="196" width="30" height="8" rx="1"
            fill="#2a2a2e" fillOpacity="0.4"
          />
          {/* Cable bundle */}
          <g stroke="#555" strokeWidth="1" opacity="0.2" strokeLinecap="round" fill="none">
            <path d="M148 205 Q165 205 175 196 Q185 186 200 186" />
            <path d="M148 213 Q170 213 185 200 Q200 188 220 186" />
            <path d="M148 221 Q175 221 195 208 Q215 195 240 186" />
          </g>
        </>
      )}

      {/* ── Case fans (decorative, tied to case selection) ── */}
      <g opacity={caseOn ? 0.2 : 0.08}>
        <circle cx="150" cy="14" r="5" fill="none" stroke={COLORS.case[0]} strokeWidth="0.4" />
        <circle cx="175" cy="14" r="5" fill="none" stroke={COLORS.case[0]} strokeWidth="0.4" />
        <circle cx="32" cy="85" r="7" fill="none" stroke={COLORS.case[0]} strokeWidth="0.4" />
      </g>
    </svg>
  )
}
