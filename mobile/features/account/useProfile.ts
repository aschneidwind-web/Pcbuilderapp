import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchProfile, updateProfile as apiUpdateProfile } from './account.api'
import type { Profile, UpdateProfileInput } from './account.types'

interface UseProfileResult {
  profile: Profile | null
  loading: boolean
  error: string | null
  updateProfile: (input: UpdateProfileInput) => Promise<Profile>
}

export function useProfile(): UseProfileResult {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchProfile(user.id)
      .then(setProfile)
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user?.id])

  const updateProfile = useCallback(async (input: UpdateProfileInput): Promise<Profile> => {
    if (!user) throw new Error('Not authenticated')
    const updated = await apiUpdateProfile(user.id, input)
    setProfile(updated)
    return updated
  }, [user?.id])

  return { profile, loading, error, updateProfile }
}
