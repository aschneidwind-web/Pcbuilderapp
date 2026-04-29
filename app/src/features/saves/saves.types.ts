export type ComponentCategory =
  | 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case'

export interface BuildComponent {
  name: string
  price: number
  spec?: string
}

export type BuildComponents = Partial<Record<ComponentCategory, BuildComponent>>

export interface SavedBuild {
  id: string
  userId: string
  name: string
  components: BuildComponents
  totalPrice: number
  createdAt: string
}

export type NewSavedBuild = Pick<SavedBuild, 'name' | 'components'>

export interface SavedBuildRow {
  id: string
  user_id: string
  name: string
  components: BuildComponents
  total_price: number
  created_at: string
}
