-- ============================================================
-- Top 10 Prom Phase 1 | Migration 0003: Appointments
-- Core booking/appointment table used by all subsequent migrations.
-- Must run AFTER 0002 (boutiques and profiles must exist).
-- Must run BEFORE 0005 (which ALTERs this table for RBAC).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id           UUID         NOT NULL REFERENCES public.boutiques(id) ON DELETE CASCADE,
  user_id            UUID         REFERENCES public.profiles(id) ON DELETE SET NULL, -- end-customer, nullable for walk-ins
  appointment_date   TIMESTAMPTZ  NOT NULL,
  appointment_type   TEXT         NOT NULL DEFAULT 'APPOINTMENT'
                       CHECK (appointment_type IN ('APPOINTMENT', 'WALK_IN')),
  status             TEXT         NOT NULL DEFAULT 'SCHEDULED'
                       CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED')),
  notes              TEXT,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_appointments_store_id   ON public.appointments(store_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id    ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date       ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status     ON public.appointments(status);

-- ── Auto-update updated_at ──────────────────────────────────────────────────
DROP TRIGGER IF EXISTS appointments_updated_at ON public.appointments;
CREATE TRIGGER appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────────────
-- NOTE: 0005 will DROP and replace these with JWT-based tenant-isolation policies.
-- These are minimal pre-RBAC policies so the table is safe at rest.

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Customers can read their own appointments
CREATE POLICY "appointments_customer_read"
  ON public.appointments FOR SELECT
  USING (user_id = (select auth.uid()));

-- Customers can create appointments for themselves
CREATE POLICY "appointments_customer_create"
  ON public.appointments FOR INSERT
  WITH CHECK (user_id = (select auth.uid()) OR user_id IS NULL);

-- Staff at the boutique can manage all appointments there
CREATE POLICY "appointments_staff_manage"
  ON public.appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.boutique_staff bs
      WHERE bs.boutique_id = store_id
        AND bs.user_id = (select auth.uid())
    )
  );
