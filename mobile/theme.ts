export const color = {
  bgApp:        '#0b0b0e',
  bgCard:       '#1c1c1e',
  bgInput:      '#2c2c2e',
  bgElevated:   'rgba(255,255,255,0.03)',
  bgHover:      'rgba(255,255,255,0.06)',

  primary:      '#7B2FFF',
  primaryLight: '#A78BFA',

  textPrimary:   '#FFFFFF',
  textSecondary: '#AEAEB2',
  textTertiary:  '#8E8E93',
  textDim:       '#6B6B80',
  textDisabled:  '#4A4A5A',

  success:      '#34C759',
  successBg:    'rgba(52,199,89,0.12)',
  error:        '#FF453A',
  errorBg:      'rgba(255,69,58,0.12)',
  info:         '#0A84FF',

  border:        'rgba(255,255,255,0.12)',
  borderSubtle:  'rgba(255,255,255,0.08)',
  borderFaint:   'rgba(255,255,255,0.04)',

  partColors: {
    cpu:         ['#7B2FFF', '#A855F7'] as [string, string],
    cooler:      ['#10B981', '#34D399'] as [string, string],
    gpu:         ['#FF6B9D', '#FF8FAD'] as [string, string],
    motherboard: ['#6366F1', '#818CF8'] as [string, string],
    ram:         ['#F59E0B', '#FBBF24'] as [string, string],
    storage:     ['#06B6D4', '#22D3EE'] as [string, string],
    psu:         ['#EF4444', '#F87171'] as [string, string],
    case:        ['#8B5CF6', '#A78BFA'] as [string, string],
  },
} as const

export const radius = {
  sm:   8,
  md:   12,
  lg:   14,
  xl:   18,
  pill: 20,
  full: 999,
} as const

export const font = {
  size: {
    xs:   10,
    sm:   11,
    md:   12,
    body: 13,
    base: 14,
    lg:   15,
    xl:   16,
    xxl:  17,
    hero: 40,
  },
  weight: {
    normal:   '400' as const,
    medium:   '500' as const,
    semibold: '600' as const,
    bold:     '700' as const,
  },
} as const

export const spacing = {
  xs:      4,
  sm:      6,
  md:      8,
  lg:      10,
  xl:      12,
  xxl:     14,
  page:    16,
  section: 20,
} as const
