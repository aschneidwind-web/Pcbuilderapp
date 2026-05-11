import { useState } from 'react'
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBuild } from './BuildContext'
import { useSaves } from '../saves/useSaves'
import { ComponentRow } from './ComponentRow'
import { ComponentPicker } from './ComponentPicker'
import { BuildReport } from './BuildReport'
import { BuildIllustration } from './BuildIllustration'
import { CATALOG } from './build.catalog'
import { SLOT_KEYS } from './build.types'
import type { SlotKey } from './build.types'
import type { BuildComponents } from '../saves/saves.types'
import { color, font, radius, spacing } from '../../theme'

const TOTAL_SLOTS = SLOT_KEYS.length

const toBuildComponents = (build: ReturnType<typeof useBuild>['build']): BuildComponents => {
  const result: BuildComponents = {}
  for (const slot of SLOT_KEYS) {
    const opt = build[slot]
    if (opt) result[slot as keyof BuildComponents] = { name: opt.n, price: opt.p, spec: opt.s }
  }
  return result
}

export function BuildScreen() {
  const { build, totalPrice, componentCount, socketCompatible, selectComponent, clearComponent } = useBuild()
  const { createSave } = useSaves()

  const [activePicker, setActivePicker] = useState<SlotKey | null>(null)
  const [buildName, setBuildName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

  const handleSave = async () => {
    if (componentCount === 0) return
    setSaving(true)
    try {
      const name = buildName.trim() || `My build ${new Date().toLocaleDateString()}`
      await createSave({ name, components: toBuildComponents(build) })
      setSaveMsg('Saved!')
      setBuildName('')
    } catch {
      setSaveMsg('Failed to save')
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(null), 2000)
    }
  }

  const btnBg = saveMsg === 'Saved!'
    ? color.success
    : componentCount === 0
    ? color.bgHover
    : color.primary

  return (
    <SafeAreaView style={s.root}>
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.headerRow}>
          <Image source={require('../../assets/logo.png')} style={s.logoImg} resizeMode="contain" />
          <View style={s.headerPrice}>
            <Text style={s.subtitle}>Total estimate · {componentCount} of {TOTAL_SLOTS}</Text>
            <Text style={s.price}>
              ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Socket pill */}
        {socketCompatible === false && (
          <View style={s.errPill}><Text style={s.errPillTxt}>Socket mismatch</Text></View>
        )}
        {socketCompatible === true && (
          <View style={s.okPill}><Text style={s.okPillTxt}>Compatible</Text></View>
        )}

        {/* Illustration */}
        <View style={{ marginTop: 16, paddingHorizontal: spacing.section }}>
          <BuildIllustration build={build} />
        </View>

        {/* Build Report */}
        <View style={{ marginTop: 16 }}>
          <BuildReport build={build} />
        </View>

        {/* Components */}
        <View style={s.componentsSection}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Components</Text>
            <Text style={s.sectionCount}>{componentCount} selected</Text>
          </View>

          {SLOT_KEYS.map(key => (
            <ComponentRow
              key={key}
              slotKey={key}
              slot={CATALOG[key]}
              selected={build[key]}
              onClick={() => setActivePicker(key)}
            />
          ))}

          {/* Save */}
          <View style={s.saveArea}>
            <TextInput
              style={s.nameInput}
              value={buildName}
              onChangeText={setBuildName}
              placeholder="Build name (optional)"
              placeholderTextColor={color.textDim}
            />
            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: btnBg }]}
              onPress={handleSave}
              disabled={saving || componentCount === 0}
              activeOpacity={0.8}
            >
              {saving
                ? <ActivityIndicator color={color.textPrimary} />
                : <Text style={[s.saveBtnTxt, componentCount === 0 && s.saveBtnTxtOff]}>
                    {saveMsg ?? 'Save build'}
                  </Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {activePicker && (
        <ComponentPicker
          slot={CATALOG[activePicker]}
          selected={build[activePicker]}
          onSelect={opt => selectComponent(activePicker, opt)}
          onClose={() => setActivePicker(null)}
          onClear={() => clearComponent(activePicker)}
        />
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: color.bgApp },
  scroll: { flex: 1 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.section,
    paddingTop: spacing.page,
    paddingBottom: 8,
  },
  logoImg: {
    width: 160,
    height: 44,
  },
  headerPrice: {
    position: 'absolute',
    right: spacing.section,
    alignItems: 'flex-end',
  },

  subtitle: {
    fontSize: font.size.sm,
    color: color.textDim,
  },
  price: {
    fontSize: font.size.xl,
    fontWeight: font.weight.bold,
    color: color.textPrimary,
    letterSpacing: -0.5,
  },

  errPill: {
    alignSelf: 'flex-start',
    backgroundColor: color.errorBg,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: spacing.section,
    marginTop: 8,
  },
  errPillTxt: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: color.error,
  },
  okPill: {
    alignSelf: 'flex-start',
    backgroundColor: color.successBg,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginHorizontal: spacing.section,
    marginTop: 8,
  },
  okPillTxt: {
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    color: color.success,
  },

  componentsSection: {
    backgroundColor: color.bgElevated,
    borderTopWidth: 0.5,
    borderTopColor: color.borderSubtle,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    minHeight: 200,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.section,
    paddingTop: 18,
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: font.size.xl,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
  },
  sectionCount: {
    fontSize: font.size.body,
    color: color.textDim,
  },

  saveArea: { paddingHorizontal: spacing.section, paddingTop: 16, paddingBottom: 8 },
  nameInput: {
    backgroundColor: color.bgElevated,
    borderWidth: 0.5,
    borderColor: color.borderSubtle,
    borderRadius: radius.md,
    padding: 11,
    paddingHorizontal: 14,
    color: color.textPrimary,
    fontSize: font.size.base,
    marginBottom: 10,
  },
  saveBtn: {
    borderRadius: radius.lg,
    padding: 14,
    alignItems: 'center',
  },
  saveBtnTxt: {
    color: color.textPrimary,
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
  },
  saveBtnTxtOff: { color: color.textDisabled },
})
