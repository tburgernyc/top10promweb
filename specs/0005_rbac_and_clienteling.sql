-- ==============================================================================
-- Migration: 0005_rbac_and_clienteling.sql
-- Purpose: Implement 5-Tier RBAC, Localized Store CRM, and JWT Auth Hooks
-- ==============================================================================

-- 1. ENUMS FOR ACCESS CONTROL & TENANT STATUS
-- ==============================================================================
CREATE TYPE subscription_status_enum AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELLED');
CREATE TYPE staff_role_enum AS ENUM ('OWNER', 'MANAGER', 'ASSOCIATE');
CREATE TYPE system_role_enum AS ENUM ('SUPER_ADMIN', 'USER');

-- Add system role to profiles (Defaulting to standard user)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS system_role system_role_enum DEFAULT 'USER';

-- Enhance boutiques/stores with subscription status for Super Admin toggling
ALTER TABLE public.boutiques 
ADD COLUMN IF NOT EXISTS subscription_status subscription_status_enum DEFAULT 'ACTIVE';


-- 2. STAFF & PERMISSIONS JUNCTION TABLE (Replacing shared accounts)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES public.boutiques(id) ON DELETE CASCADE,
    role staff_role_enum NOT NULL DEFAULT 'ASSOCIATE',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, store_id) -- A user can only have one active role per store
);

-- Index for quick lookups during login
CREATE INDEX IF NOT EXISTS idx_store_staff_user_id ON public.store_staff(user_id);


-- 3. LOCALIZED STORE CRM (Protecting Data Privacy between stores)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.boutiques(id) ON DELETE CASCADE,
    global_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable for walk-ins
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT, -- Private CRM notes for the store
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_customers_store_id ON public.store_customers(store_id);


-- 4. APPOINTMENT AUDIT & POS ENHANCEMENTS
-- ==============================================================================
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS store_customer_id UUID REFERENCES public.store_customers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS created_by_staff_id UUID REFERENCES public.store_staff(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS updated_by_staff_id UUID REFERENCES public.store_staff(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sales_feedback TEXT,
ADD COLUMN IF NOT EXISTS purchased_dress_id UUID, -- Would FK to dresses
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();


-- 5. SUPABASE AUTH HOOK (Injecting Roles into JWT)
-- ==============================================================================
-- This function runs every time a user logs in or refreshes their token.
-- It injects their exact permissions directly into the JWT, removing the 
-- need for slow database lookups on every single page load.
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claims jsonb;
  v_system_role text;
  v_store_id text;
  v_store_role text;
BEGIN
  -- 1. Fetch global system role
  SELECT system_role::text INTO v_system_role 
  FROM public.profiles 
  WHERE id = (event->>'user_id')::uuid;

  -- 2. Fetch active store affiliation
  SELECT store_id::text, role::text INTO v_store_id, v_store_role 
  FROM public.store_staff 
  WHERE user_id = (event->>'user_id')::uuid AND is_active = true 
  LIMIT 1;

  claims := event->'claims';

  -- 3. Inject Custom Claims into app_metadata
  IF v_system_role IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata, system_role}', to_jsonb(v_system_role));
  END IF;

  IF v_store_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata, store_id}', to_jsonb(v_store_id));
    claims := jsonb_set(claims, '{app_metadata, store_role}', to_jsonb(v_store_role));
  END IF;

  -- Update event and return
  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$;

-- Grant permissions for Supabase Auth to execute this hook
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;


-- 6. HIGH-PERFORMANCE ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Enable RLS
ALTER TABLE public.store_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Store Customers
-- A user can see CRM data IF they are a Super Admin OR their JWT store_id matches the row's store_id
CREATE POLICY "Strict Tenant Isolation - Store Customers" ON public.store_customers
FOR ALL
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'system_role') = 'SUPER_ADMIN')
  OR 
  (store_id::text = (auth.jwt() -> 'app_metadata' ->> 'store_id'))
);

-- Policy: Appointments (Overriding/Enhancing existing rules)
-- Staff can only see/edit appointments belonging to their store
CREATE POLICY "Strict Tenant Isolation - Appointments" ON public.appointments
FOR ALL
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'system_role') = 'SUPER_ADMIN')
  OR 
  (store_id::text = (auth.jwt() -> 'app_metadata' ->> 'store_id'))
  OR 
  (user_id = auth.uid()) -- Let end-customers still see their own appointments
);

-- Policy: Store Staff
-- Owners and Managers can see staff at their store. Associates can see their own profile.
CREATE POLICY "Tiered Visibility - Store Staff" ON public.store_staff
FOR SELECT
USING (
  ((auth.jwt() -> 'app_metadata' ->> 'system_role') = 'SUPER_ADMIN')
  OR 
  (store_id::text = (auth.jwt() -> 'app_metadata' ->> 'store_id') AND (auth.jwt() -> 'app_metadata' ->> 'store_role') IN ('OWNER', 'MANAGER'))
  OR 
  (user_id = auth.uid())
);