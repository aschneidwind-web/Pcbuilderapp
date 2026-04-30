import { useState } from 'react'
import { SlideBase } from './SlideBase'
import { SettingsGroup, SettingsRow, Toggle } from './SettingsRow'
import { useAuth } from '../../context/AuthContext'

interface Props { onClose: () => void }

export function PrivacySlide({ onClose }: Props) {
  const { signOut } = useAuth()
  const [prefs, setPrefs] = useState({ publicProfile: true, buildsVisible: true, analytics: false })

  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleDeleteAccount = async () => {
    if (!confirm('Delete your account? This cannot be undone.')) return
    await signOut()
  }

  return (
    <SlideBase title="Privacy & data" onClose={onClose}>
      <SettingsGroup>
        <SettingsRow
          iconBg="#EAF3DE" iconColor="#3B6D11"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          label="Public profile"
          right={<Toggle on={prefs.publicProfile} onToggle={() => toggle('publicProfile')} />}
        />
        <SettingsRow
          iconBg="#E6F1FB" iconColor="#185FA5"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>}
          label="Builds visible to community"
          right={<Toggle on={prefs.buildsVisible} onToggle={() => toggle('buildsVisible')} />}
        />
        <SettingsRow
          iconBg="#FAEEDA" iconColor="#854F0B"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          label="Analytics & usage data"
          right={<Toggle on={prefs.analytics} onToggle={() => toggle('analytics')} />}
        />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow
          iconBg="#E1F5EE" iconColor="#0F6E56"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>}
          label="Export my data"
          onClick={() => {}}
        />
        <SettingsRow
          iconBg="#FFECEB" iconColor="#C0392B"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>}
          label="Delete account"
          danger
          onClick={handleDeleteAccount}
        />
      </SettingsGroup>
    </SlideBase>
  )
}
