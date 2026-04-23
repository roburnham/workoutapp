import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hcsesvzqlkicacudlpyo.supabase.co'
const SUPABASE_KEY = 'sb_publishable_cVEHjMoBw9sF-b2aME6NHw_QQZDscMg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
