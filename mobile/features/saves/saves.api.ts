import { supabase } from '../../lib/supabase'
import type { BuildComponents, NewSavedBuild, SavedBuild, SavedBuildRow } from './saves.types'

const TABLE = 'builds'

const toDomain = (row: SavedBuildRow): SavedBuild => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  components: row.components,
  totalPrice: row.total_price,
  createdAt: row.created_at,
})

const computeTotal = (components: BuildComponents): number =>
  Object.values(components).reduce((sum, c) => sum + (c?.price ?? 0), 0)

const requireUserId = async (): Promise<string> => {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!data.user) throw new Error('Not authenticated')
  return data.user.id
}

export const fetchSaves = async (): Promise<SavedBuild[]> => {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []).map(toDomain)
}

export const createSave = async (input: NewSavedBuild): Promise<SavedBuild> => {
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      name: input.name.trim(),
      components: input.components,
      total_price: computeTotal(input.components),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return toDomain(data)
}

export const deleteSave = async (id: string): Promise<void> => {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}
