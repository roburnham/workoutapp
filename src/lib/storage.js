import { supabase } from './supabase'

// ── Workouts ──────────────────────────────────────────────────────────────────

export async function saveWorkout(workout) {
  const { data, error } = await supabase
    .from('workouts')
    .insert({
      date: workout.date,
      type: workout.type,
      block: workout.block ?? null,
      week: workout.week ?? null,
      session_type: workout.sessionType ?? null,
      name: workout.name,
      duration_min: workout.durationMin ?? null,
    })
    .select()
    .single()

  if (error) throw error

  if (workout.exercises?.length) {
    const rows = workout.exercises.flatMap((ex, exIdx) => [
      ...(ex.sets ?? []).map(s => ({
        workout_id: data.id,
        exercise_name: ex.name,
        exercise_order: exIdx,
        set_number: s.setNum,
        weight: s.weight !== '' ? Number(s.weight) : null,
        reps: s.reps !== '' ? Number(s.reps) : null,
        note: null,
      })),
      // set_number: 0 stores the exercise note
      ...(ex.note?.trim() ? [{
        workout_id: data.id,
        exercise_name: ex.name,
        exercise_order: exIdx,
        set_number: 0,
        weight: null,
        reps: null,
        note: ex.note.trim(),
      }] : []),
    ])
    if (rows.length) {
      const { error: sErr } = await supabase.from('workout_sets').insert(rows)
      if (sErr) throw sErr
    }
  }

  return data
}

export async function getWorkouts() {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_sets(*)')
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getWorkoutsForMonth(year, month) {
  const pad = n => String(n).padStart(2, '0')
  const start = `${year}-${pad(month)}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end   = `${year}-${pad(month)}-${pad(lastDay)}`
  const { data, error } = await supabase
    .from('workouts')
    .select('id, date, session_type, name, type')
    .gte('date', start)
    .lte('date', end)
  if (error) throw error
  return data ?? []
}

export async function getCompletedSessionsForWeek(week, block) {
  const { data, error } = await supabase
    .from('workouts')
    .select('session_type, type')
    .eq('week', week)
    .eq('block', block)
    .in('type', ['program', 'skipped'])
  if (error) throw error
  return (data ?? []).map(w => w.session_type)
}

export async function getWeekStatus(week, block) {
  const { data, error } = await supabase
    .from('workouts')
    .select('session_type, type')
    .eq('week', week)
    .eq('block', block)
    .in('type', ['program', 'skipped'])
  if (error) throw error
  const result = {}
  ;(data ?? []).forEach(w => { result[w.session_type] = w.type })
  return result
}

export async function getPreviousWorkout(sessionType, block) {
  const { data, error } = await supabase
    .from('workouts')
    .select('*, workout_sets(*)')
    .eq('session_type', sessionType)
    .eq('block', block)
    .eq('type', 'program')
    .order('date', { ascending: false })
    .limit(1)
  if (error) throw error
  return data?.[0] ?? null
}

export async function deleteWorkout(id) {
  const { error } = await supabase.from('workouts').delete().eq('id', id)
  if (error) throw error
}

export async function deleteActivity(id) {
  const { error } = await supabase.from('activities').delete().eq('id', id)
  if (error) throw error
}

// ── Activities ────────────────────────────────────────────────────────────────

export async function saveActivity(activity) {
  const { data, error } = await supabase
    .from('activities')
    .insert(activity)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getActivitiesForMonth(year, month) {
  const pad = n => String(n).padStart(2, '0')
  const start = `${year}-${pad(month)}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end   = `${year}-${pad(month)}-${pad(lastDay)}`
  const { data, error } = await supabase
    .from('activities')
    .select('id, date, activity_type')
    .gte('date', start)
    .lte('date', end)
  if (error) throw error
  return data ?? []
}
