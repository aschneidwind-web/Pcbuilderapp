import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { color, radius, font } from '../theme'

export function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmation, setConfirmation] = useState(false)

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      if (error.code === 'user_already_exists') throw new Error('An account with this email already exists.')
      if (error.code === 'weak_password') throw new Error('Password is too weak. Use at least 6 characters.')
      if (error.code === 'over_email_send_rate_limit') throw new Error('Too many attempts. Please wait a moment.')
      throw new Error(error.message)
    }
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: username || email.split('@')[0],
      })
    }
    setConfirmation(true)
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.code === 'invalid_credentials') throw new Error('Incorrect email or password.')
      if (error.code === 'email_not_confirmed') throw new Error('Please confirm your email before signing in.')
      throw new Error(error.message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') await handleSignUp()
      else await handleSignIn()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (confirmation) {
    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <div style={styles.logo}>✉️</div>
          <h2 style={styles.title}>Check your email</h2>
          <p style={styles.sub}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/>
            <rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>
          </svg>
        </div>

        <h2 style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
        <p style={styles.sub}>{mode === 'signin' ? 'Sign in to your PartFlow account.' : 'Save builds, share with the community, and sync across devices.'}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input style={styles.input} type="text" placeholder="your_handle" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
          )}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p style={styles.switch}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <span style={styles.link} onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    height: '100vh', width: '100vw', display: 'grid', placeItems: 'center',
    background: color.bgApp, fontFamily: font.family,
  },
  card: {
    background: color.bgCard, borderRadius: radius.pill, padding: '32px 28px', width: 340,
    border: color.border,
  },
  logo: {
    width: 56, height: 56, background: color.primary, borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px', fontSize: 28,
  },
  title: { color: color.textPrimary, fontSize: 22, fontWeight: font.weight.semibold, textAlign: 'center', margin: '0 0 6px' },
  sub: { color: color.textSecondary, fontSize: font.size.base, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: color.textSecondary, fontSize: font.size.body, fontWeight: font.weight.medium },
  input: {
    background: color.bgInput, border: color.border, borderRadius: radius.md,
    padding: '12px 14px', fontSize: font.size.lg, color: color.textPrimary, outline: 'none',
  },
  error: { color: color.error, fontSize: font.size.body, margin: 0, textAlign: 'center' },
  btn: {
    background: color.primary, color: color.textPrimary, border: 'none', borderRadius: radius.md,
    padding: 14, fontSize: font.size.lg, fontWeight: font.weight.semibold, cursor: 'pointer', marginTop: 4,
  },
  switch: { color: color.textSecondary, fontSize: font.size.body, textAlign: 'center', margin: '16px 0 0' },
  link: { color: color.info, cursor: 'pointer', fontWeight: font.weight.medium },
}
