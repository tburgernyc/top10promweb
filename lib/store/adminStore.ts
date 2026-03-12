'use client'

import { create } from 'zustand'
import type { AdminFilters } from '@/types/admin'

type AdminTab = 'dashboard' | 'inventory' | 'appointments' | 'reservations' | 'staff' | 'settings' | 'analytics'

interface AdminState {
  // ── Active tab ─────────────────────────────────────────────────────────
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void

  // ── Boutique filter (platform_admin only) ──────────────────────────────
  selectedBoutiqueId: string | null
  setSelectedBoutiqueId: (id: string | null) => void

  // ── Shared filters ─────────────────────────────────────────────────────
  filters: AdminFilters
  setFilter: <K extends keyof AdminFilters>(key: K, value: AdminFilters[K]) => void
  resetFilters: () => void

  // ── Hydration ──────────────────────────────────────────────────────────
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void
}

const defaultFilters: AdminFilters = {
  boutique_id: null,
  status: null,
  date_from: null,
  date_to: null,
  search: '',
}

export const useAdminStore = create<AdminState>()((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedBoutiqueId: null,
  setSelectedBoutiqueId: (id) => set({ selectedBoutiqueId: id }),

  filters: defaultFilters,
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  resetFilters: () => set({ filters: defaultFilters }),

  _hasHydrated: false,
  setHasHydrated: (val) => set({ _hasHydrated: val }),
}))
