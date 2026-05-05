import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSaves } from '../saves'
import { useProfile } from './useProfile'
import { useTheme } from './useTheme'
import { SettingsGroup, SettingsRow, Toggle } from './SettingsRow'
import { EditProfileSlide } from './EditProfileSlide'
import { ChangePasswordSlide } from './ChangePasswordSlide'
import { NotificationsSlide } from './NotificationsSlide'
import { PrivacySlide } from './PrivacySlide'
import { AboutSlide } from './AboutSlide'
import { AVATAR_COLS } from './account.types'

type SlideId = 'editProfile' | 'changePass' | 'notifications' | 'privacy' | 'about'

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function SectionHeader({ title }: { title: string }) {
  return <div style={s.secHdr}>{title}</div>
}

export function AccountPage() {
  const { session, user, signOut } = useAuth()
  const { profile, updateProfile }  = useProfile()
  const { builds }                  = useSaves()
  const { isDark, toggle: toggleTheme } = useTheme()
  const [activeSlide, setActiveSlide] = useState<SlideId | null>(null)

  const open  = (id: SlideId) => setActiveSlide(id)
  const close = () => setActiveSlide(null)

  const displayName = profile?.username || user?.email?.split('@')[0] || 'User'
  const avatarIdx   = profile?.avatarIdx ?? 0
  const col         = AVATAR_COLS[avatarIdx % AVATAR_COLS.length]
  const joinDate    = user?.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : 'Today'

  const prefAndSupport = (
    <>
      <SectionHeader title="Preferences" />
      <SettingsGroup>
        <SettingsRow
          iconBg="#1c1c1e" iconColor="#f2f2f7"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
          label="Dark mode"
          right={<Toggle on={isDark} onToggle={toggleTheme} />}
        />
        <SettingsRow
          iconBg="#FAEEDA" iconColor="#854F0B"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
          label="Notifications"
          onClick={() => open('notifications')}
        />
        <SettingsRow
          iconBg="#E1F5EE" iconColor="#0F6E56"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
          label="Privacy & data"
          onClick={() => open('privacy')}
        />
      </SettingsGroup>

      <SectionHeader title="Support" />
      <SettingsGroup>
        <SettingsRow
          iconBg="#F1EFE8" iconColor="#5F5E5A"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          label="About"
          onClick={() => open('about')}
        />
        <SettingsRow
          iconBg="#E6F1FB" iconColor="#185FA5"
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          label="Send feedback"
          onClick={() => {}}
        />
      </SettingsGroup>
    </>
  )

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <div style={s.navLeft}>
          <img src="/logo.png" width="18" height="17" alt="" />
          <div style={s.navTitle}>Account</div>
        </div>
      </div>

      <div style={s.scroll}>
        {!session ? (
          <>
            <div style={s.syncCard}>
              <div style={s.syncTitle}>Sync your builds</div>
              <div style={s.syncSub}>Sign in to save builds to the cloud and share with the community.</div>
              <div style={s.syncBtns}>
                <button style={s.syncBtn} onClick={() => window.location.href = '/'}>Sign in</button>
                <button style={{ ...s.syncBtn, ...s.syncBtnSec }} onClick={() => window.location.href = '/'}>Create account</button>
              </div>
            </div>
            {prefAndSupport}
          </>
        ) : (
          <>
            {/* Profile hero */}
            <div style={s.hero}>
              <div style={{ ...s.avatar, background: `${col}20`, color: col }}>{initials(displayName)}</div>
              <div style={s.name}>{displayName}</div>
              <div style={s.email}>{user?.email}</div>
              {profile?.bio ? <div style={s.bio}>{profile.bio}</div> : null}
              <div style={s.stats}>
                <div style={s.stat}><div style={s.statV}>{builds.length}</div><div style={s.statL}>saved</div></div>
                <div style={s.stat}><div style={s.statV}>0</div><div style={s.statL}>shared</div></div>
                <div style={s.stat}><div style={s.statV}>{joinDate}</div><div style={s.statL}>joined</div></div>
              </div>
            </div>

            <SectionHeader title="Profile" />
            <SettingsGroup>
              <SettingsRow
                iconBg="#E6F1FB" iconColor="#185FA5"
                icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                label="Edit profile"
                onClick={() => open('editProfile')}
              />
              <SettingsRow
                iconBg="#EAF3DE" iconColor="#3B6D11"
                icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                label="Change password"
                onClick={() => open('changePass')}
              />
            </SettingsGroup>

            {prefAndSupport}

            <SettingsGroup style={{ marginTop: 4 }}>
              <SettingsRow
                iconBg="#FFECEB" iconColor="#C0392B"
                icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
                label="Sign out"
                danger
                onClick={() => { if (confirm('Sign out of your account?')) void signOut() }}
              />
            </SettingsGroup>
          </>
        )}
        <div style={{ height: 20 }} />
      </div>

      {activeSlide === 'editProfile'   && <EditProfileSlide profile={profile} onSave={updateProfile} onClose={close} />}
      {activeSlide === 'changePass'    && <ChangePasswordSlide onClose={close} />}
      {activeSlide === 'notifications' && <NotificationsSlide onClose={close} />}
      {activeSlide === 'privacy'       && <PrivacySlide onClose={close} />}
      {activeSlide === 'about'         && <AboutSlide onClose={close} />}
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    height: '100%', display: 'flex', flexDirection: 'column',
    background: '#0b0b0e', position: 'relative', overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  navbar: {
    display: 'flex', alignItems: 'center', padding: '16px 16px 12px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)', flexShrink: 0,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  navTitle: { fontSize: 17, fontWeight: 600, color: '#fff' },
  scroll:   { flex: 1, overflowY: 'auto', padding: '0 16px' },
  secHdr: {
    fontSize: 11, fontWeight: 600, color: '#8E8E93',
    textTransform: 'uppercase', letterSpacing: 0.5,
    padding: '16px 4px 6px',
  },
  // Profile hero
  hero: {
    background: '#1c1c1e', borderRadius: 14,
    border: '0.5px solid rgba(255,255,255,0.12)',
    padding: '20px 16px', marginTop: 14, marginBottom: 12,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
  },
  avatar: { width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 500 },
  name:   { fontSize: 17, fontWeight: 500, color: '#f2f2f7' },
  email:  { fontSize: 13, color: '#AEAEB2' },
  bio:    { fontSize: 13, color: '#AEAEB2', textAlign: 'center', lineHeight: 1.5 },
  stats:  { display: 'flex', width: '100%', marginTop: 4 },
  stat:   { flex: 1, textAlign: 'center' },
  statV:  { fontSize: 16, fontWeight: 500, color: '#f2f2f7' },
  statL:  { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  // Sync card (logged-out)
  syncCard: {
    background: '#1c1c1e', borderRadius: 14,
    border: '0.5px solid rgba(255,255,255,0.12)',
    padding: '16px 14px', marginTop: 14, marginBottom: 12,
  },
  syncTitle:  { fontSize: 14, fontWeight: 500, color: '#f2f2f7', marginBottom: 3 },
  syncSub:    { fontSize: 12, color: '#AEAEB2', marginBottom: 12, lineHeight: 1.5 },
  syncBtns:   { display: 'flex', gap: 8 },
  syncBtn:    { flex: 1, padding: 10, borderRadius: 10, border: 'none', background: '#0A84FF', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  syncBtnSec: { background: '#2c2c2e', color: '#AEAEB2', border: '0.5px solid rgba(255,255,255,0.08)' },
}
