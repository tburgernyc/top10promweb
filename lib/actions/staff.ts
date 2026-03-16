'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Explicit row types for new tables pending migration + type regen
type StoreCustomerInsert = {
  store_id: string; first_name: string; last_name: string
  phone: string | null; email: string | null; notes: string | null
}
type AppointmentInsert = {
  store_id: string; store_customer_id: string; user_id: string
  appointment_type: string; status: string; appointment_date: string; notes: string
}

export async function registerWalkInCustomer(formData: FormData) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  // 1. Authenticate and Extract JWT Claims
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { error: 'Unauthorized. Please log in again.' }
  }

  const storeId = user.app_metadata?.store_id
  const staffId = user.id // The global user ID of the staff member

  if (!storeId) {
    return { error: 'No active store assignment found for your account.' }
  }

  // 2. Extract Form Data
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const notes = formData.get('notes') as string

  if (!firstName || !lastName) {
    return { error: 'First and Last name are required.' }
  }

  // 3. Insert into the localized CRM table (store_customers)
  const customerPayload: StoreCustomerInsert = {
    store_id: storeId,
    first_name: firstName,
    last_name: lastName,
    phone: phone || null,
    email: email || null,
    notes: notes || null
  }
  const { data: customer, error: customerError } = await db
    .from('store_customers')
    .insert(customerPayload)
    .select()
    .single() as { data: { id: string } | null; error: { message: string } | null }

  if (customerError || !customer) {
    console.error('Customer Creation Error:', customerError)
    return { error: 'Failed to create customer record.' }
  }

  // 4. Automatically log a Walk-In Appointment for tracking
  const apptPayload: AppointmentInsert = {
    store_id: storeId,
    store_customer_id: customer.id,
    user_id: staffId, // Tracking who created the walk-in
    appointment_type: 'WALK_IN',
    status: 'IN_PROGRESS',
    appointment_date: new Date().toISOString(),
    notes: notes
  }
  const { error: apptError } = await db
    .from('appointments')
    .insert(apptPayload) as { error: { message: string } | null }

  if (apptError) {
    console.error('Walk-in Appointment Creation Error:', apptError)
  }

  // Refresh the floor hub to show the new walk-in
  revalidatePath('/saas/staff')

  return { success: true, customerId: customer.id }
}
