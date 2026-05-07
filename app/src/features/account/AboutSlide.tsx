import { SlideBase } from './SlideBase'
import { SettingsGroup, SettingsRow } from './SettingsRow'
import { color, radius, font } from '../../theme'

interface Props { onClose: () => void }

export function AboutSlide({ onClose }: Props) {
  return (
    <SlideBase title="About" onClose={onClose}>
      <div style={s.hero}>
        <div style={s.logoWrap}>
          <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4 L14 4 L20 12 L14 20 L4 20 Z"/>
            <circle cx="17" cy="12" r="3" fill="#fff" stroke="none"/>
          </svg>
        </div>
        <div style={s.appName}>PartFlow</div>
        <div style={s.version}>Version 0.1.0 (beta)</div>
      </div>

      <SettingsGroup>
        <SettingsRow iconBg="" iconColor="" icon={null} label="Privacy policy" onClick={() => {}} />
        <SettingsRow iconBg="" iconColor="" icon={null} label="Terms of service" onClick={() => {}} />
        <SettingsRow iconBg="" iconColor="" icon={null} label="Open source licenses" onClick={() => {}} />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow iconBg="" iconColor="" icon={null} label="Send feedback" onClick={() => {}} />
        <SettingsRow iconBg="" iconColor="" icon={null} label="Rate the app" onClick={() => {}} />
      </SettingsGroup>

      <div style={s.tagline}>Built for PC enthusiasts everywhere.</div>
    </SlideBase>
  )
}

const s: Record<string, React.CSSProperties> = {
  hero:    { textAlign: 'center', padding: '24px 0 20px' },
  logoWrap: {
    width: 64, height: 64, background: color.gradient, borderRadius: radius.xl,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 14px',
  },
  appName: { fontSize: 20, fontWeight: font.weight.medium, color: color.textPrimary },
  version: { fontSize: font.size.body, color: color.textTertiary, marginTop: 4 },
  tagline: { fontSize: font.size.md, color: color.textTertiary, textAlign: 'center', padding: '16px 0' },
}
