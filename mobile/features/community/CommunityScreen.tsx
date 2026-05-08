import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { color, font, spacing } from '../../theme'

export function CommunityScreen() {
  return (
    <SafeAreaView style={s.root}>
      <View style={s.navbar}>
        <Text style={s.navTitle}>Community</Text>
      </View>
      <View style={s.body}>
        <View style={s.iconWrap}>
          <Ionicons name="people-outline" size={40} color="#3A3A3C" />
        </View>
        <Text style={s.heading}>Coming soon</Text>
        <Text style={s.sub}>Browse and share builds with the community.</Text>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bgApp },
  navbar: {
    paddingHorizontal: spacing.page,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: color.borderSubtle,
  },
  navTitle: { fontSize: font.size.xxl, fontWeight: font.weight.semibold, color: color.textPrimary },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 52,
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: '#1c1c1e',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  heading: { fontSize: font.size.xxl, fontWeight: font.weight.semibold, color: color.textPrimary },
  sub:     { fontSize: font.size.base, color: '#8E8E93', textAlign: 'center', maxWidth: 220 },
})
