import { supabase } from '../../lib/supabase'
import type { Profile, ProfileRow, UpdateProfileInput } from './account.types'

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    bio: row.bio ?? '',
    avatarIdx: row.avatar_idx ?? 0,
    createdAt: row.created_at,
  }
}

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, bio, avatar_idx, created_at')
    .eq('id', userId)
    .single()
  if (error) throw new Error(error.message)
  return mapProfileRow(data as ProfileRow)
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ username: input.username, bio: input.bio, avatar_idx: input.avatarIdx })
    .eq('id', userId)
    .select('id, username, bio, avatar_idx, created_at')
    .single()
  if (error) throw new Error(error.message)
  return mapProfileRow(data as ProfileRow)
}

// Supabase validates the session, not the old password, so oldPassword is unused here.
// It exists only to match the UI pattern users expect from a password-change form.
export async function updatePassword(_oldPassword: string, newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}
