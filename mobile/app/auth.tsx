import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native'
import { supabase } from '../lib/supabase'
import { color, font, radius, spacing } from '../theme'

type Mode = 'login' | 'signup'

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.logo}>
          <Text style={s.logoText}>PartFlow</Text>
          <Text style={s.logoSub}>Build your perfect PC</Text>
        </View>

        <View style={s.card}>
          <Text style={s.title}>{mode === 'login' ? 'Sign in' : 'Create account'}</Text>

          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor={color.textDim}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={color.textDim}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity style={s.btn} onPress={submit} disabled={loading}>
            {loading
              ? <ActivityIndicator color={color.textPrimary} />
              : <Text style={s.btnText}>{mode === 'login' ? 'Sign in' : 'Sign up'}</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={s.toggle} onPress={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(null) }}>
            <Text style={s.toggleText}>
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bgApp },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.page },
  logo: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 32, fontWeight: font.weight.bold, color: color.textPrimary, letterSpacing: -1 },
  logoSub: { fontSize: font.size.body, color: color.textDim, marginTop: 6 },
  card: {
    backgroundColor: color.bgCard,
    borderRadius: radius.xl,
    padding: spacing.section,
    borderWidth: 0.5,
    borderColor: color.border,
  },
  title: {
    fontSize: font.size.xxl,
    fontWeight: font.weight.semibold,
    color: color.textPrimary,
    marginBottom: spacing.section,
  },
  input: {
    backgroundColor: color.bgInput,
    borderRadius: radius.md,
    padding: 13,
    color: color.textPrimary,
    fontSize: font.size.base,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: color.borderSubtle,
  },
  error: {
    color: color.error,
    fontSize: font.size.md,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: color.primary,
    borderRadius: radius.lg,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: color.textPrimary,
    fontSize: font.size.lg,
    fontWeight: font.weight.semibold,
  },
  toggle: { alignItems: 'center', marginTop: 18 },
  toggleText: { color: color.primaryLight, fontSize: font.size.body },
})
