import { useState } from 'react'
import { SlideBase } from './SlideBase'
import { SettingsGroup, SettingsRow, Toggle } from './SettingsRow'

const NOTIFICATIONS = [
  { id: 'likes',   label: 'Likes on your builds',   ib: '#E6F1FB', ic: '#185FA5', defaultOn: true,
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { id: 'comments', label: 'Comments on your builds', ib: '#EAF3DE', ic: '#3B6D11', defaultOn: true,
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  { id: 'price',   label: 'Price drop alerts',       ib: '#FAEEDA', ic: '#854F0B', defaultOn: false,
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { id: 'videos',  label: 'New channel videos',      ib: '#FCEBEB', ic: '#A32D2D', defaultOn: true,
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { id: 'digest',  label: 'Weekly news digest',      ib: '#EEEDFE', ic: '#534AB7', defaultOn: false,
    icon: <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="15" x2="12" y2="15"/></svg> },
]

interface Props { onClose: () => void }

export function NotificationsSlide({ onClose }: Props) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATIONS.map(n => [n.id, n.defaultOn]))
  )

  const toggle = (id: string) => setPrefs(p => ({ ...p, [id]: !p[id] }))

  return (
    <SlideBase title="Notifications" onClose={onClose}>
      <SettingsGroup>
        {NOTIFICATIONS.map(n => (
          <SettingsRow
            key={n.id}
            iconBg={n.ib} iconColor={n.ic} icon={n.icon}
            label={n.label}
            right={<Toggle on={prefs[n.id]} onToggle={() => toggle(n.id)} />}
          />
        ))}
      </SettingsGroup>
    </SlideBase>
  )
}
