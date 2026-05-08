import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { BuildProvider } from '../features/build/BuildContext'

function AuthGate() {
  const { session, loading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    const inAuth = segments[0] === 'auth'
    if (!session && !inAuth) {
      router.replace('/auth')
    } else if (session && inAuth) {
      router.replace('/(tabs)')
    }
  }, [session, loading, segments])

  return null
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <BuildProvider>
        <StatusBar style="light" />
        <AuthGate />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0b0b0e' } }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </BuildProvider>
    </AuthProvider>
  )
}
