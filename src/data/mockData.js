// ============================================================
// JAXLAB Mock Data — simulates PostgreSQL backend responses
// ============================================================

export const currentUser = {
  id: 1,
  name: 'Jax',
  email: 'jax@example.com',
  avatar: null,
}

// Active fasting session — started ~16 hours ago for demo
const now = Date.now()
const START_HOURS_AGO = 16
export const activeSession = {
  id: 1,
  user_id: 1,
  start_time: new Date(now - START_HOURS_AGO * 3600 * 1000).toISOString(),
  target_hours: 72,
  status: 'active',
  day: 3,
}

export const userStats = {
  ketone: 0.0,
  glucose: 0,
  weight: 48,
  water_glasses: 0,
  water_goal: 8,
}

export const products = [
  { id: 1, name: 'Jaroliva', img: '/products/jaroliva.png', qty: '1 sdm', color: '#4A7C59' },
  { id: 2, name: 'Cocofenol', img: '/products/cocofenol.png', qty: '1 sdm', color: '#8B5E3C' },
  { id: 3, name: 'Ketone Immuno', img: '/products/ketone-immuno.png', qty: '1 sdt', color: '#5A6FA8' },
  { id: 4, name: 'Max C8 Oil', img: '/products/max-c8-oil.png', qty: '4 semprot', color: '#2E8B8B' },
  { id: 5, name: 'Vanilla Ghee', img: '/products/vanilla-ghee.png', qty: '1 sdm', color: '#C4860A' },
]

export const consumptionLog = [
  {
    id: 1,
    time: '06.00',
    meal: 'Subuh',
    items: 'Jaroliva + Cocofenol',
    detail: '1 sdm Jaroliva · 1 sdm Cocofenol · segelas air hangat',
    emoji: '🌅',
    color: '#F59E0B',
    done: true,
  },
  {
    id: 2,
    time: '09.00',
    meal: 'Pagi',
    items: 'Ketone Immuno + Max C8',
    detail: '1 sdt Ketone Immuno · 4 semprot Max C8 Oil',
    emoji: '☀️',
    color: '#F59E0B',
    done: false,
  },
  {
    id: 3,
    time: '12.00',
    meal: 'Siang',
    items: 'Jaroliva + Cocofenol',
    detail: '1 sdm Jaroliva · 1 sdm Cocofenol · minum air minimal 2 gelas',
    emoji: '🌤️',
    color: '#3B82F6',
    done: false,
  },
  {
    id: 4,
    time: '15.00',
    meal: 'Sore',
    items: 'Max C8 + Ketone Immuno',
    detail: '4 semprot Max C8 Oil · 1 sdt Ketone Immuno',
    emoji: '🌥️',
    color: '#8B5CF6',
    done: false,
  },
  {
    id: 5,
    time: '18.00',
    meal: 'Malam',
    items: 'Jaroliva + Vanilla Ghee',
    detail: '1 sdm Jaroliva · 1 sdm Vanilla Ghee · 1 sdm Cocofenol',
    emoji: '🌙',
    color: '#6366F1',
    done: false,
  },
  {
    id: 6,
    time: '21.00',
    meal: 'Sebelum Tidur',
    items: 'Vanilla Ghee',
    detail: '1 sdm Vanilla Ghee · kurangi cahaya & layar, istirahat cukup',
    emoji: '😴',
    color: '#64748B',
    done: false,
  },
]

export const checkins = [
  {
    id: 1,
    session_id: 1,
    condition: 'Lapar',
    emoji: '😋',
    note: 'Mulai lapar sekitar jam 11',
    created_at: '2026-08-04T11:07:00Z',
  },
]

export const glucoseLogs = [
  { id: 1, value: 85, unit: 'mg/dL', logged_at: '2026-08-04T06:00:00Z' },
  { id: 2, value: 78, unit: 'mg/dL', logged_at: '2026-08-04T12:00:00Z' },
  { id: 3, value: 72, unit: 'mg/dL', logged_at: '2026-08-05T06:00:00Z' },
  { id: 4, value: 68, unit: 'mg/dL', logged_at: '2026-08-05T12:00:00Z' },
]

export const screeningResult = {
  score: 80,
  status: 'ready',
  breakdown: [
    { label: 'Kesiapan Tubuh', value: 80 },
    { label: 'Hidrasi', value: 85 },
    { label: 'Kondisi Mental', value: 90 },
    { label: 'Persiapan', value: 80 },
  ],
  points_earned: 50,
}

export const progressData = {
  ff72_selesai: 1,
  total_poin: 550,
  total_checkin: 2,
  total_sesi: 3,
  sessions: [
    {
      id: 1,
      date: '10 Agu 2026',
      status: 'active',
      duration_hours: 6,
      checkins: 1,
      glucose_count: 4,
    },
    { id: 2, date: '7 Agu 2026', status: 'complete', duration_hours: 72, checkins: 1, glucose_count: 1 },
    { id: 3, date: '7 Agu 2026', status: 'stopped', duration_hours: 8, checkins: 0, glucose_count: 0 },
  ],
  chart_data: [
    { name: '#1', selesai: 0, void: 8 },
    { name: '#2', selesai: 72, void: 0 },
    { name: '#3', selesai: 0, void: 6 },
  ],
}

export const rewardData = {
  total_points: 550,
  level: 'Bronze',
  next_level: 'Silver',
  next_level_points: 1000,
  ff72_selesai: 1,
  badge_diraih: 3,
  badge_tersisa: 5,
}

export const badges = [
  {
    id: 1,
    name: 'Health Scout',
    desc: 'Selesaikan Screening Kesehatan pertama',
    emoji: '🩺',
    rarity: 'COMMON',
    unlocked: true,
  },
  {
    id: 2,
    name: 'First Faster',
    desc: 'Selesaikan FF72 pertama kali',
    emoji: '🏃',
    rarity: 'COMMON',
    unlocked: false,
  },
  {
    id: 3,
    name: 'Triple Flame',
    desc: 'Selesaikan FF72 sebanyak 3 kali',
    emoji: '🔥',
    rarity: 'RARE',
    unlocked: false,
  },
  {
    id: 4,
    name: 'Power Faster',
    desc: 'Selesaikan FF72 sebanyak 5 kali',
    emoji: '⚡',
    rarity: 'RARE',
    unlocked: false,
  },
  {
    id: 5,
    name: 'Star Earner',
    desc: 'Kumpulkan 300 poin',
    emoji: '⭐',
    rarity: 'COMMON',
    unlocked: false,
  },
  {
    id: 6,
    name: 'Diamond Member',
    desc: 'Kumpulkan 600 poin',
    emoji: '💎',
    rarity: 'RARE',
    unlocked: false,
  },
  {
    id: 7,
    name: 'JaxLab Champion',
    desc: 'Kumpulkan 3000 poin',
    emoji: '🏆',
    rarity: 'EPIC',
    unlocked: false,
  },
  {
    id: 8,
    name: 'Fasting Legend',
    desc: 'Selesaikan FF72 sebanyak 10 kali',
    emoji: '👑',
    rarity: 'EPIC',
    unlocked: false,
  },
]
