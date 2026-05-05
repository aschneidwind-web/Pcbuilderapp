import { useState } from 'react'
import { supabase } from '../lib/supabase'

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
          <img src="/favicon.svg" width="40" height="38" alt="PC Builder" />
        </div>

        <h2 style={styles.title}>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
        <p style={styles.sub}>{mode === 'signin' ? 'Sign in to your PC Builder account.' : 'Save builds, share with the community, and sync across devices.'}</p>

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
    background: '#0b0b0e', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  card: {
    background: '#1c1c1e', borderRadius: 20, padding: '32px 28px', width: 340,
    border: '0.5px solid rgba(255,255,255,0.1)',
  },
  logo: {
    width: 56, height: 56, background: 'rgba(134,59,255,0.15)', borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px', fontSize: 28,
  },
  title: { color: '#fff', fontSize: 22, fontWeight: 600, textAlign: 'center', margin: '0 0 6px' },
  sub: { color: '#AEAEB2', fontSize: 14, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { color: '#AEAEB2', fontSize: 13, fontWeight: 500 },
  input: {
    background: '#2c2c2e', border: '0.5px solid rgba(255,255,255,0.18)', borderRadius: 12,
    padding: '12px 14px', fontSize: 15, color: '#fff', outline: 'none',
  },
  error: { color: '#FF453A', fontSize: 13, margin: 0, textAlign: 'center' },
  btn: {
    background: '#0A84FF', color: '#fff', border: 'none', borderRadius: 12,
    padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4,
  },
  switch: { color: '#AEAEB2', fontSize: 13, textAlign: 'center', margin: '16px 0 0' },
  link: { color: '#0A84FF', cursor: 'pointer', fontWeight: 500 },
}
