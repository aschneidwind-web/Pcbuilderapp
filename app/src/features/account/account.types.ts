export const AVATAR_COLS = [
  '#0A84FF', '#34C759', '#FF9500', '#BF5AF2',
  '#FF3B30', '#1D9E75', '#FF6B35', '#007AFF',
]

export interface Profile {
  id: string
  username: string
  bio: string
  avatarIdx: number
  createdAt: string
}

export interface ProfileRow {
  id: string
  username: string
  bio: string | null
  avatar_idx: number | null
  created_at: string
}

export interface UpdateProfileInput {
  username: string
  bio: string
  avatarIdx: number
}
