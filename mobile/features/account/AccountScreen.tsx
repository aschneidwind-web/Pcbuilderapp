import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Linking,
} from 'react-native'
import { useAuth } from '../../context/AuthContext'
import { useSaves } from '../saves/useSaves'
import { useProfile } from './useProfile'
import { SettingsGroup, SettingsRow, Toggle } from './SettingsRow'
import { AVATAR_COLS } from './account.types'
import { color, font, radius, spacing } from '../../theme'

function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={s.secHdr}>{title}</Text>
}

export function AccountScreen() {
  const { session, user, signOut } = useAuth()
  const { profile } = useProfile()
  const { builds } = useSaves()
  const [isDark, setIsDark] = useState(true)

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
          iconName="sunny-outline"
          label="Dark mode"
          right={<Toggle on={isDark} onToggle={() => setIsDark(v => !v)} />}
        />
        <SettingsRow
          iconBg="#FAEEDA" iconColor="#854F0B"
          iconName="notifications-outline"
          label="Notifications"
        />
        <SettingsRow
          iconBg="#E1F5EE" iconColor="#0F6E56"
          iconName="shield-checkmark-outline"
          label="Privacy & data"
        />
      </SettingsGroup>

      <SectionHeader title="Support" />
      <SettingsGroup>
        <SettingsRow
          iconBg="#F1EFE8" iconColor="#5F5E5A"
          iconName="information-circle-outline"
          label="About"
        />
        <SettingsRow
          iconBg="#E6F1FB" iconColor="#185FA5"
          iconName="chatbubble-outline"
          label="Send feedback"
          onPress={() => Linking.openURL('mailto:feedback@partflow.app')}
        />
      </SettingsGroup>
    </>
  )

  return (
    <SafeAreaView style={s.root}>
      <View style={s.navbar}>
        <Text style={s.navTitle}>Account</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {!session ? (
          <>
            <View style={s.syncCard}>
              <Text style={s.syncTitle}>Sync your builds</Text>
              <Text style={s.syncSub}>Sign in to save builds to the cloud and share with the community.</Text>
            </View>
            {prefAndSupport}
          </>
        ) : (
          <>
            <View style={s.hero}>
              <View style={[s.avatar, { backgroundColor: `${col}20` }]}>
                <Text style={[s.avatarTxt, { color: col }]}>{initials(displayName)}</Text>
              </View>
              <Text style={s.name}>{displayName}</Text>
              <Text style={s.email}>{user?.email}</Text>
              {profile?.bio ? <Text style={s.bio}>{profile.bio}</Text> : null}
              <View style={s.stats}>
                <View style={s.stat}>
                  <Text style={s.statV}>{builds.length}</Text>
                  <Text style={s.statL}>saved</Text>
                </View>
                <View style={s.stat}>
                  <Text style={s.statV}>0</Text>
                  <Text style={s.statL}>shared</Text>
                </View>
                <View style={s.stat}>
                  <Text style={s.statV}>{joinDate}</Text>
                  <Text style={s.statL}>joined</Text>
                </View>
              </View>
            </View>

            <SectionHeader title="Profile" />
            <SettingsGroup>
              <SettingsRow
                iconBg="#E6F1FB" iconColor="#185FA5"
                iconName="person-outline"
                label="Edit profile"
              />
              <SettingsRow
                iconBg="#EAF3DE" iconColor="#3B6D11"
                iconName="lock-closed-outline"
                label="Change password"
              />
            </SettingsGroup>

            {prefAndSupport}

            <SettingsGroup style={{ marginTop: 4 }}>
              <SettingsRow
                iconBg="#FFECEB" iconColor="#C0392B"
                iconName="log-out-outline"
                label="Sign out"
                danger
                onPress={() => void signOut()}
              />
            </SettingsGroup>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: color.bgApp },
  navbar: { paddingHorizontal: spacing.page, paddingVertical: 12 },
  navTitle: { fontSize: font.size.xxl, fontWeight: font.weight.semibold, color: color.textPrimary },
  scroll: { flex: 1, paddingHorizontal: spacing.page },
  secHdr: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: color.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingTop: 16,
    paddingBottom: 6,
    paddingHorizontal: 4,
  },
  hero: {
    backgroundColor: color.bgCard,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: color.border,
    padding: 20,
    marginTop: 14,
    marginBottom: 12,
    alignItems: 'center',
    gap: 10,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { fontSize: 22, fontWeight: font.weight.medium },
  name:   { fontSize: font.size.xxl, fontWeight: font.weight.medium, color: color.textPrimary },
  email:  { fontSize: font.size.body, color: color.textSecondary },
  bio:    { fontSize: font.size.body, color: color.textSecondary, textAlign: 'center', lineHeight: 20 },
  stats:  { flexDirection: 'row', width: '100%', marginTop: 4 },
  stat:   { flex: 1, alignItems: 'center' },
  statV:  { fontSize: font.size.xl, fontWeight: font.weight.medium, color: color.textPrimary },
  statL:  { fontSize: font.size.sm, color: color.textTertiary, marginTop: 2 },
  syncCard: {
    backgroundColor: color.bgCard,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: color.border,
    padding: 16,
    marginTop: 14,
    marginBottom: 12,
  },
  syncTitle: { fontSize: font.size.base, fontWeight: font.weight.medium, color: color.textPrimary, marginBottom: 3 },
  syncSub:   { fontSize: font.size.md, color: color.textSecondary, lineHeight: 18 },
})
