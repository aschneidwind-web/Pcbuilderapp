import { useRef, useEffect, useMemo } from 'react'
import { Animated, Easing, View } from 'react-native'
import Svg, {
  Rect, Circle, Line, Path, G,
} from 'react-native-svg'
import { color } from '../../theme'
import type { BuildState, SlotKey } from './build.types'
import { SLOT_KEYS } from './build.types'

const AnimatedG      = Animated.createAnimatedComponent(G)
const AnimatedRect   = Animated.createAnimatedComponent(Rect)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

// Sparks: each starts on the case border and shoots outward
const SPARKS = [
  { x: 95,  y: 12,  dx: -5,  dy: -10 },
  { x: 195, y: 12,  dx:  3,  dy: -11 },
  { x: 270, y: 12,  dx:  9,  dy: -8  },
  { x: 312, y: 75,  dx: 12,  dy: -6  },
  { x: 312, y: 155, dx: 11,  dy:  7  },
  { x: 200, y: 236, dx:  4,  dy: 10  },
  { x: 90,  y: 236, dx: -8,  dy:  9  },
  { x: 29,  y: 120, dx: -11, dy: -4  },
]

interface PartStyle {
  fill: string
  stroke: string
  strokeDasharray: string | undefined
  opacity: number
}

function partStyle(build: BuildState, slot: string): PartStyle {
  const selected = build[slot as SlotKey] != null
  if (!selected) {
    return { fill: 'none', stroke: color.textDisabled, strokeDasharray: '3 2', opacity: 0.15 }
  }
  const [c1] = color.partColors[slot as keyof typeof color.partColors]
  return { fill: `${c1}18`, stroke: c1, strokeDasharray: undefined, opacity: 1 }
}

interface Props { build: BuildState }

export function BuildIllustration({ build }: Props) {
  const allSelected = useMemo(() => SLOT_KEYS.every(k => build[k] != null), [build])

  const spinAnim       = useRef(new Animated.Value(0)).current
  const pulseAnim      = useRef(new Animated.Value(1)).current
  const caseStrokeAnim = useRef(new Animated.Value(1044)).current

  // One animated cx, cy, opacity per spark
  const sparkAnims = useRef(
    SPARKS.map(s => ({
      cx:      new Animated.Value(s.x),
      cy:      new Animated.Value(s.y),
      opacity: new Animated.Value(0),
    }))
  ).current

  const spinLoop   = useRef<Animated.CompositeAnimation | null>(null)
  const pulseLoop  = useRef<Animated.CompositeAnimation | null>(null)
  const caseTiming = useRef<Animated.CompositeAnimation | null>(null)
  const sparkLoops = useRef<Animated.CompositeAnimation[]>([])

  useEffect(() => {
    if (!allSelected) {
      spinLoop.current?.stop()
      pulseLoop.current?.stop()
      caseTiming.current?.stop()
      sparkLoops.current.forEach(l => l.stop())
      spinAnim.setValue(0)
      pulseAnim.setValue(1)
      caseStrokeAnim.setValue(1044)
      sparkAnims.forEach((a, i) => {
        a.cx.setValue(SPARKS[i].x)
        a.cy.setValue(SPARKS[i].y)
        a.opacity.setValue(0)
      })
      return
    }

    spinLoop.current = Animated.loop(
      Animated.timing(spinAnim, { toValue: 360, duration: 1500, easing: Easing.linear, useNativeDriver: false })
    )
    spinLoop.current.start()

    // Brighter pulse: floor raised to 0.5, faster 3s cycle
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.5, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ])
    )
    pulseLoop.current.start()

    caseStrokeAnim.setValue(1044)
    caseTiming.current = Animated.timing(caseStrokeAnim, {
      toValue: 0, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: false,
    })
    caseTiming.current.start()

    // Sparks: staggered loops, each fires then rests before repeating
    sparkLoops.current = sparkAnims.map((anim, i) => {
      anim.cx.setValue(SPARKS[i].x)
      anim.cy.setValue(SPARKS[i].y)
      anim.opacity.setValue(0)
      const loop = Animated.loop(
        Animated.sequence([
          Animated.delay(i * 280),
          Animated.parallel([
            Animated.timing(anim.cx, {
              toValue: SPARKS[i].x + SPARKS[i].dx,
              duration: 550,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.timing(anim.cy, {
              toValue: SPARKS[i].y + SPARKS[i].dy,
              duration: 550,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }),
            Animated.sequence([
              Animated.timing(anim.opacity, { toValue: 1, duration: 80, useNativeDriver: false }),
              Animated.timing(anim.opacity, { toValue: 0, duration: 470, useNativeDriver: false }),
            ]),
          ]),
          Animated.delay(500 + i * 120),
        ])
      )
      loop.start()
      return loop
    })

    return () => {
      spinLoop.current?.stop()
      pulseLoop.current?.stop()
      caseTiming.current?.stop()
      sparkLoops.current.forEach(l => l.stop())
    }
  }, [allSelected])

  const mb      = partStyle(build, 'motherboard')
  const cpu     = partStyle(build, 'cpu')
  const cooler  = partStyle(build, 'cooler')
  const gpu     = partStyle(build, 'gpu')
  const ram     = partStyle(build, 'ram')
  const stor    = partStyle(build, 'storage')
  const psu     = partStyle(build, 'psu')

  const caseOn  = build.case != null
  const cStroke = caseOn ? color.partColors.case[0] : '#555'
  const cOp     = caseOn ? 0.7 : 0.35

  const c = color.partColors

  const mbOp     = allSelected ? pulseAnim : mb.opacity
  const cpuOp    = allSelected ? pulseAnim : cpu.opacity
  const coolerOp = allSelected ? pulseAnim : cooler.opacity
  const gpuOp    = allSelected ? pulseAnim : gpu.opacity
  const ramOp    = allSelected ? pulseAnim : ram.opacity
  const storOp   = allSelected ? pulseAnim : stor.opacity
  const psuOp    = allSelected ? pulseAnim : psu.opacity

  return (
    <View style={{ width: '100%', aspectRatio: 340 / 250, maxWidth: 320, alignSelf: 'center' }}>
      <Svg viewBox="0 0 340 250" width="100%" height="100%">

        {/* Case shell */}
        <Rect x="25" y="8" width="290" height="232" rx="5"
          fill="none" stroke={cStroke} strokeWidth="1.5" opacity={cOp}
        />
        {allSelected && (
          <AnimatedRect x="25" y="8" width="290" height="232" rx="5"
            fill="none"
            stroke={color.partColors.case[0]}
            strokeWidth="1.5"
            strokeDasharray="1044"
            strokeDashoffset={caseStrokeAnim as any}
          />
        )}

        {/* Front panel */}
        <Rect x="295" y="8" width="20" height="232" fill="#1a1a1f"
          stroke={cStroke} strokeWidth="0.6" opacity={cOp * 0.6}
        />
        {[30, 38, 46, 54].map(y => (
          <Line key={y} x1="299" y1={y} x2="311" y2={y}
            stroke={color.textDisabled} strokeWidth="0.4" opacity={cOp * 0.4}
          />
        ))}

        {/* Back panel */}
        <Rect x="25" y="8" width="12" height="232" rx="5"
          fill="#1a1a1f" stroke={cStroke} strokeWidth="0.6" opacity={cOp * 0.6}
        />
        <Rect x="27" y="16" width="8" height="28" rx="1"
          fill="none" stroke={color.textDisabled} strokeWidth="0.3" opacity={cOp * 0.4}
        />
        {[100, 108, 116, 124].map(y => (
          <Line key={y} x1="28" y1={y} x2="34" y2={y}
            stroke={color.textDisabled} strokeWidth="0.5" opacity={cOp * 0.35}
          />
        ))}
        <Line x1="37" y1="186" x2="295" y2="186"
          stroke={color.textDisabled} strokeWidth="0.7" opacity={cOp * 0.5}
        />

        {/* Motherboard */}
        <AnimatedRect x="46" y="14" width="240" height="168" rx="2"
          fill={mb.fill} stroke={mb.stroke} strokeWidth="0.6"
          strokeDasharray={mb.strokeDasharray} opacity={mbOp as any}
        />
        {build.motherboard && (
          <G>
            <G stroke={c.motherboard[1]} strokeWidth="0.25" opacity="0.12">
              <Line x1="60" y1="42" x2="270" y2="42" />
              <Line x1="60" y1="75" x2="250" y2="75" />
              <Line x1="100" y1="14" x2="100" y2="182" />
              <Line x1="180" y1="14" x2="180" y2="182" />
              <Line x1="240" y1="14" x2="240" y2="182" />
              <Line x1="60" y1="130" x2="275" y2="130" />
            </G>
            <G fill="none" stroke={color.textDisabled} strokeWidth="0.3" opacity="0.25">
              <Circle cx="52" cy="20" r="2" />
              <Circle cx="280" cy="20" r="2" />
              <Circle cx="52" cy="176" r="2" />
              <Circle cx="280" cy="176" r="2" />
            </G>
            <G fill="#1a1a22" stroke={color.textDisabled} strokeWidth="0.3" opacity="0.35">
              <Rect x="55" y="100" width="160" height="3" rx="0.5" />
              <Rect x="55" y="110" width="160" height="3" rx="0.5" />
              <Rect x="55" y="120" width="100" height="2.5" rx="0.5" />
            </G>
          </G>
        )}

        {/* CPU */}
        <AnimatedRect x="140" y="28" width="42" height="42" rx="2"
          fill={cpu.fill} stroke={cpu.stroke} strokeWidth="0.6"
          strokeDasharray={cpu.strokeDasharray} opacity={cpuOp as any}
        />
        {build.cpu && (
          <G>
            <Rect x="149" y="37" width="24" height="24" rx="1.5"
              fill={`${c.cpu[0]}25`} stroke={c.cpu[1]} strokeWidth="0.4"
            />
            <G stroke={c.cpu[1]} strokeWidth="0.2" opacity="0.2">
              {[146, 151, 156, 161, 166, 171, 176].map(x => (
                <Line key={x} x1={x} y1="28" x2={x} y2="24" />
              ))}
            </G>
          </G>
        )}

        {/* CPU Cooler */}
        <AnimatedRect x="132" y="20" width="58" height="58" rx="3"
          fill={cooler.fill} stroke={cooler.stroke} strokeWidth="0.6"
          strokeDasharray={cooler.strokeDasharray} opacity={coolerOp as any}
        />
        {build.cooler && (
          <G>
            <G stroke={c.cooler[1]} strokeWidth="0.3" opacity="0.25">
              {Array.from({ length: 14 }, (_, i) => 136 + i * 3.6).map((x, i) => (
                <Line key={i} x1={x} y1="23" x2={x} y2="74" />
              ))}
            </G>
            <AnimatedG
              rotation={allSelected ? spinAnim as any : 0}
              originX={161}
              originY={49}
            >
              <G stroke={c.cooler[1]} strokeWidth="0.35" opacity="0.18">
                <Line x1="161" y1="32" x2="161" y2="40" />
                <Line x1="161" y1="58" x2="161" y2="66" />
                <Line x1="144" y1="49" x2="152" y2="49" />
                <Line x1="170" y1="49" x2="178" y2="49" />
                <Line x1="149" y1="37" x2="155" y2="43" />
                <Line x1="167" y1="55" x2="173" y2="61" />
                <Line x1="173" y1="37" x2="167" y2="43" />
                <Line x1="155" y1="55" x2="149" y2="61" />
              </G>
            </AnimatedG>
            <G fill="none" stroke={c.cooler[1]} strokeWidth="0.35" opacity="0.2">
              <Path d="M153 74 Q153 79 156 81 Q161 84 161 80" />
              <Path d="M165 74 Q165 79 168 81 Q173 84 173 80" />
            </G>
          </G>
        )}
        <Circle cx="161" cy="49" r="20"
          fill="none" stroke={cooler.stroke} strokeWidth="0.4"
          strokeDasharray={cooler.strokeDasharray} opacity={cooler.opacity * 0.35}
        />
        <Circle cx="161" cy="49" r="3.5"
          fill={cooler.fill} stroke={cooler.stroke} strokeWidth="0.3"
          strokeDasharray={cooler.strokeDasharray} opacity={cooler.opacity * 0.5}
        />

        {/* RAM */}
        <AnimatedRect x="218" y="24" width="7" height="56" rx="1"
          fill={ram.fill} stroke={ram.stroke} strokeWidth="0.5"
          strokeDasharray={ram.strokeDasharray} opacity={ramOp as any}
        />
        <AnimatedRect x="229" y="24" width="7" height="56" rx="1"
          fill={ram.fill} stroke={ram.stroke} strokeWidth="0.5"
          strokeDasharray={ram.strokeDasharray} opacity={ramOp as any}
        />
        {build.ram && (
          <G>
            <G fill={`${c.ram[1]}20`}>
              {[28, 36, 44, 52].map(y => (
                <G key={y}>
                  <Rect x="219" y={y} width="5" height="4" rx="0.5" />
                  <Rect x="230" y={y} width="5" height="4" rx="0.5" />
                </G>
              ))}
            </G>
            <G stroke={c.ram[0]} strokeWidth="0.4" opacity="0.35">
              <Line x1="221.5" y1="24" x2="221.5" y2="21" />
              <Line x1="232.5" y1="24" x2="232.5" y2="21" />
            </G>
          </G>
        )}

        {/* GPU */}
        <AnimatedRect x="50" y="96" width="200" height="28" rx="2.5"
          fill={gpu.fill} stroke={gpu.stroke} strokeWidth="0.6"
          strokeDasharray={gpu.strokeDasharray} opacity={gpuOp as any}
        />
        {build.gpu && (
          <G>
            <Rect x="50" y="93" width="200" height="4" rx="1.5"
              fill="#2a2a2e" fillOpacity="0.4" stroke={c.gpu[1]} strokeWidth="0.2"
            />
            <Rect x="238" y="102" width="10" height="6" rx="1"
              fill="none" stroke={c.gpu[1]} strokeWidth="0.3" opacity="0.35"
            />
            <Rect x="50" y="124" width="46" height="2.5" rx="0.5"
              fill={`${c.gpu[0]}25`} stroke={c.gpu[1]} strokeWidth="0.2"
            />
          </G>
        )}
        {[100, 150, 200].map(cx => (
          <G key={cx}>
            <Circle cx={cx} cy="110" r="10"
              fill="none" stroke={gpu.stroke} strokeWidth="0.35"
              strokeDasharray={gpu.strokeDasharray} opacity={gpu.opacity * 0.35}
            />
            {build.gpu && (
              <G>
                <Circle cx={cx} cy="110" r="2.5"
                  fill={`${c.gpu[0]}18`} stroke={c.gpu[1]} strokeWidth="0.3"
                />
                <AnimatedG
                  rotation={allSelected ? spinAnim as any : 0}
                  originX={cx}
                  originY={110}
                >
                  <G stroke={c.gpu[1]} strokeWidth="0.3" opacity="0.18">
                    <Line x1={cx} y1="102" x2={cx} y2="106" />
                    <Line x1={cx} y1="114" x2={cx} y2="118" />
                    <Line x1={cx - 6} y1="110" x2={cx - 3} y2="110" />
                    <Line x1={cx + 3} y1="110" x2={cx + 6} y2="110" />
                  </G>
                </AnimatedG>
              </G>
            )}
          </G>
        ))}

        {/* Storage — M.2 */}
        <AnimatedRect x="190" y="150" width="48" height="6" rx="1.5"
          fill={stor.fill} stroke={stor.stroke} strokeWidth="0.5"
          strokeDasharray={stor.strokeDasharray} opacity={storOp as any}
        />
        {build.storage && (
          <G>
            <Circle cx="194" cy="153" r="1.2"
              fill="none" stroke={c.storage[1]} strokeWidth="0.3" opacity="0.4"
            />
            <Rect x="198" y="151" width="18" height="3.5" rx="0.5"
              fill={`${c.storage[0]}18`}
            />
          </G>
        )}
        {/* Storage — 2.5" SSD */}
        <AnimatedRect x="256" y="192" width="36" height="24" rx="2"
          fill={stor.fill} stroke={stor.stroke} strokeWidth="0.5"
          strokeDasharray={stor.strokeDasharray} opacity={storOp as any}
        />

        {/* PSU */}
        <AnimatedRect x="40" y="192" width="108" height="42" rx="3"
          fill={psu.fill} stroke={psu.stroke} strokeWidth="0.6"
          strokeDasharray={psu.strokeDasharray} opacity={psuOp as any}
        />
        <Circle cx="94" cy="213" r="15"
          fill="none" stroke={psu.stroke} strokeWidth="0.35"
          strokeDasharray={psu.strokeDasharray} opacity={psu.opacity * 0.3}
        />
        {build.psu && (
          <G>
            <Circle cx="94" cy="213" r="3"
              fill={`${c.psu[0]}15`} stroke={c.psu[1]} strokeWidth="0.3"
            />
            <G stroke={c.psu[1]} strokeWidth="0.3" opacity="0.18">
              <Line x1="94" y1="201" x2="94" y2="207" />
              <Line x1="94" y1="219" x2="94" y2="225" />
              <Line x1="82" y1="213" x2="88" y2="213" />
              <Line x1="100" y1="213" x2="106" y2="213" />
            </G>
            <Rect x="46" y="196" width="30" height="8" rx="1"
              fill="#2a2a2e" fillOpacity="0.4"
            />
            <G stroke={color.textDisabled} strokeWidth="1" opacity="0.2" strokeLinecap="round" fill="none">
              <Path d="M148 205 Q165 205 175 196 Q185 186 200 186" />
              <Path d="M148 213 Q170 213 185 200 Q200 188 220 186" />
              <Path d="M148 221 Q175 221 195 208 Q215 195 240 186" />
            </G>
          </G>
        )}

        {/* Case fans */}
        <G opacity={caseOn ? 0.2 : 0.08}>
          <Circle cx="150" cy="14" r="5" fill="none" stroke={c.case[0]} strokeWidth="0.4" />
          <Circle cx="175" cy="14" r="5" fill="none" stroke={c.case[0]} strokeWidth="0.4" />
          <Circle cx="32" cy="85" r="7" fill="none" stroke={c.case[0]} strokeWidth="0.4" />
        </G>

        {/* Sparks — only when full build */}
        {allSelected && sparkAnims.map((anim, i) => (
          <AnimatedCircle
            key={i}
            cx={anim.cx as any}
            cy={anim.cy as any}
            r={i % 3 === 0 ? 2 : 1.5}
            fill="#FFD580"
            opacity={anim.opacity as any}
          />
        ))}

      </Svg>
    </View>
  )
}
