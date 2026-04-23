import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import { SESSION_INFO, ACTIVITY_TYPES, BLOCKS, getBlock, getSessionExercises } from './data/program'
import { saveWorkout, getWorkouts, getActivities, getActivitiesForMonth, getWorkoutsForMonth, getPreviousWorkout, saveActivity, getCompletedSessionsForWeek, getWeekStatus, deleteWorkout, deleteActivity } from './lib/storage'

// ── Technique definitions ─────────────────────────────────────────────────────

const TECHNIQUE_DEFS = {
  'myo-reps': {
    label: 'Myo-reps',
    text: 'Myo-reps extend a set beyond failure by taking short mini-rests and cranking out a few extra reps in between. Only applied on the last exercise.',
  },
  'long-length partials': {
    label: 'Long-length Partials',
    text: 'A partial rep in the stretched aspect of the lift. For example on an assisted pull-up, you come about halfway up and do partial reps in the bottom (stretched) part of the movement.',
  },
  'integrated partials': {
    label: 'Integrated Partials',
    text: 'Instead of doing all reps as partials, you integrate them throughout the set by alternating between full ROM reps and long-length partial reps — one each.',
  },
  'mechanical dropset': {
    label: 'Mechanical Dropset',
    text: 'Instead of dropping the weight, you make the exercise easier by modifying your technique at set rep intervals — allowing extra reps. Example: stepping toward the cable machine on Cable Reverse Flyes.',
  },
  'dropset': {
    label: 'Dropset',
    text: 'Drop the weight back and perform more reps at the end of a set, immediately without rest.',
  },
  'static stretch': {
    label: 'Static Stretch',
    text: 'Hold a stretch in a fixed position after the last set of an exercise — typically 30 seconds. For example, after 3 sets on the leg press, hold a 30-second quad stretch.',
  },
}

function getTechniqueDef(technique) {
  if (!technique) return null
  const lower = technique.toLowerCase()
  for (const [key, def] of Object.entries(TECHNIQUE_DEFS)) {
    if (lower.includes(key)) return def
  }
  return null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TODAY = new Date()

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function formatDate(str) {
  const d = new Date(str + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatDuration(min) {
  if (!min) return ''
  if (min < 60) return `${min}m`
  return `${Math.floor(min/60)}h ${min%60}m`
}

const SESSION_DOT_COLORS = {
  upper1: '#4a90d9', upper2: '#4a90d9',
  lower1: '#5cb85c', lower2: '#5cb85c',
  arms:   '#9b59b6',
}

function sessionColor(sessionType, type) {
  if (type === 'free') return '#1a1a1a'
  return SESSION_DOT_COLORS[sessionType] ?? '#888'
}

function useCurrentWeek() {
  const [week, setWeekState] = useState(() => parseInt(localStorage.getItem('gym_week') ?? '1'))
  const setWeek = w => { localStorage.setItem('gym_week', String(w)); setWeekState(w) }
  return [week, setWeek]
}

// ── Calendar View ─────────────────────────────────────────────────────────────

function CalendarView({ onStartWorkout, refreshKey }) {
  const [date, setDate] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [workouts, setWorkouts] = useState([])
  const [activities, setActivities] = useState([])
  const [selected, setSelected] = useState(null)

  const year  = date.getFullYear()
  const month = date.getMonth() + 1

  useEffect(() => {
    getWorkoutsForMonth(year, month).then(setWorkouts).catch(() => {})
    getActivitiesForMonth(year, month).then(setActivities).catch(() => {})
  }, [year, month, refreshKey])

  const byDate = {}
  workouts.forEach(w => {
    byDate[w.date] = byDate[w.date] ?? []
    byDate[w.date].push({ type: 'workout', color: sessionColor(w.session_type, w.type), name: w.name, session_type: w.session_type })
  })
  activities.forEach(a => {
    byDate[a.date] = byDate[a.date] ?? []
    byDate[a.date].push({ type: 'activity', color: 'var(--activity)', name: a.activity_type })
  })

  const firstDay = new Date(year, month-1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const prevDays = new Date(year, month-1, 0).getDate()

  const cells = []
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, current: false })
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, current: true })
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - firstDay + 2, current: false })

  const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => setDate(new Date(year, month-2, 1))
  const nextMonth = () => setDate(new Date(year, month, 1))

  const selectedItems = selected ? (byDate[selected] ?? []) : []

  return (
    <div className="view">
      <div className="view-header"><h1>Calendar</h1></div>

      <div className="cal-nav">
        <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
        <h2>{monthLabel}</h2>
        <button className="cal-nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="cal-grid">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
          <div key={d} className="cal-day-name">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const dateStr = cell.current
            ? `${year}-${String(month).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}`
            : null
          const isToday = dateStr === toDateStr(TODAY)
          const items = dateStr ? (byDate[dateStr] ?? []) : []
          return (
            <div
              key={i}
              className={`cal-day ${!cell.current ? 'other-month' : ''} ${isToday ? 'today' : ''} ${selected === dateStr ? 'selected' : ''}`}
              onClick={() => cell.current && setSelected(selected === dateStr ? null : dateStr)}
            >
              <span className="cal-day-num">{cell.day}</span>
              <div className="cal-dots">
                {items.slice(0, 3).map((item, j) => (
                  <span key={j} className="dot" style={{ background: item.color }} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ padding: '0 20px 16px', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { color: '#4a90d9', label: 'Upper' },
          { color: '#5cb85c', label: 'Lower' },
          { color: '#9b59b6', label: 'Arms' },
          { color: '#1a1a1a', label: 'Free' },
          { color: 'var(--activity)', label: 'Activity' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <span className="dot" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>{formatDate(selected)}</h2>
            {selectedItems.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>Rest day</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {selectedItems.map((item, i) => (
                  <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="dot" style={{ background: item.color, width: 10, height: 10 }} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-primary btn-full" onClick={() => { setSelected(null); onStartWorkout(null) }}>
              + Log workout for this day
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Today View ────────────────────────────────────────────────────────────────

function TodayView({ onStartWorkout }) {
  const [currentWeek, setCurrentWeek] = useCurrentWeek()
  const block = getBlock(currentWeek)
  const sessions = Object.entries(SESSION_INFO)
  const [weekStatus, setWeekStatus] = useState({})

  useEffect(() => {
    getWeekStatus(currentWeek, block).then(setWeekStatus).catch(() => {})
  }, [currentWeek, block])

  async function handleSkip(sessionType) {
    try {
      await saveWorkout({
        date: toDateStr(TODAY),
        type: 'skipped',
        block,
        week: currentWeek,
        sessionType,
        name: SESSION_INFO[sessionType].name,
        durationMin: null,
        exercises: [],
      })
      const ALL_SESSIONS = ['upper1', 'lower1', 'upper2', 'lower2', 'arms']
      const done = await getCompletedSessionsForWeek(currentWeek, block)
      setWeekStatus(prev => ({ ...prev, [sessionType]: 'skipped' }))
      if (ALL_SESSIONS.every(s => new Set(done).has(s))) {
        const nextWeek = Math.min(currentWeek + 1, 10)
        localStorage.setItem('gym_week', String(nextWeek))
        setCurrentWeek(nextWeek)
      }
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  return (
    <div className="view">
      <div className="view-header"><h1>Today</h1></div>
      <div className="view-body">

        <div className="week-selector">
          <button className="week-btn" onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}>−</button>
          <span>Week {currentWeek} · Block {block}</span>
          <button className="week-btn" onClick={() => setCurrentWeek(Math.min(10, currentWeek + 1))}>+</button>
        </div>

        <div className="section-title">Sessions this week</div>

        {sessions.map(([key, info]) => {
          const exercises = getSessionExercises(block, key)
          const status = weekStatus[key]
          const isDone    = status === 'program'
          const isSkipped = status === 'skipped'
          const isFinished = isDone || isSkipped

          return (
            <div key={key} className="session-card" style={{ opacity: isFinished ? 0.6 : 1 }}>
              <div className="session-card-header">
                <div>
                  <div className="session-card-title" style={{ color: isFinished ? 'var(--text-muted)' : 'var(--text)' }}>
                    {isDone && '✓ '}{isSkipped && '— '}{info.name}
                  </div>
                  <div className="session-card-sub">
                    {isDone ? 'Completed' : isSkipped ? 'Skipped' : `${exercises.length} exercises`}
                  </div>
                </div>
                {!isFinished && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12, padding: '8px 10px', color: 'var(--text-muted)' }}
                      onClick={() => handleSkip(key)}
                    >
                      Skip
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 13, padding: '8px 14px' }}
                      onClick={() => onStartWorkout({ sessionType: key, block, week: currentWeek })}
                    >
                      Start →
                    </button>
                  </div>
                )}
              </div>
              {!isFinished && (
                <div className="session-ex-list">
                  {exercises.slice(0, 3).map((ex, i) => (
                    <div key={i} className="session-ex-item">
                      <span className="dot" style={{ background: info.color }} />
                      {ex.name}
                    </div>
                  ))}
                  {exercises.length > 3 && (
                    <div className="session-ex-item" style={{ color: 'var(--text-dim)' }}>
                      +{exercises.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        <div className="section-title" style={{ marginTop: 4 }}>Other</div>
        <button
          className="btn btn-ghost btn-full"
          style={{ fontSize: 14, padding: '14px' }}
          onClick={() => onStartWorkout({ sessionType: 'free', block: null, week: null })}
        >
          + Free workout
        </button>
      </div>
    </div>
  )
}

// ── Workout View (Active Session) ─────────────────────────────────────────────

function makeInitialExercises(exercises) {
  return exercises.map(ex => ({
    name: ex.name,
    technique: ex.technique,
    reps: ex.reps,
    workingSets: ex.workingSets,
    rest: ex.rest,
    sub1: ex.sub1,
    sub2: ex.sub2,
    sets: Array.from({ length: ex.workingSets }, (_, i) => ({
      setNum: i + 1, weight: '', reps: '', done: false,
    })),
    note: '',
  }))
}

function WorkoutView({ config, onFinish, onCancel }) {
  const { sessionType, block, week } = config
  const isFree = sessionType === 'free'
  const sessionInfo = isFree ? { name: 'Free Workout', color: 'var(--text)' } : SESSION_INFO[sessionType]
  const programExercises = isFree ? [] : getSessionExercises(block, sessionType)

  const [exercises, setExercises] = useState(makeInitialExercises(programExercises))
  const [expanded, setExpanded] = useState(new Set([0]))
  const [prevWorkout, setPrevWorkout] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(Date.now())
  const [saving, setSaving] = useState(false)
  const [techModal, setTechModal] = useState(null)

  // Free workout state
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [customExNames, setCustomExNames] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gym_custom_exercises') ?? '[]') } catch { return [] }
  })
  const programExNames = Object.values(BLOCKS).flatMap(b => Object.values(b.sessions).flatMap(s => s.map(e => e.name)))
  const allExNames = [...new Set([...programExNames, ...customExNames])]
  const filtered = search.length > 1 ? allExNames.filter(n => n.toLowerCase().includes(search.toLowerCase())) : []
  const isNew = search.trim().length > 0 && !allExNames.some(n => n.toLowerCase() === search.trim().toLowerCase())

  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!isFree) getPreviousWorkout(sessionType, block).then(setPrevWorkout).catch(() => {})
  }, [isFree, sessionType, block])

  function getPrevSets(exName) {
    if (!prevWorkout) return []
    return (prevWorkout.workout_sets ?? [])
      .filter(s => s.exercise_name === exName)
      .sort((a, b) => a.set_number - b.set_number)
  }

  function updateSet(exIdx, setIdx, field, value) {
    setExercises(prev => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex,
      sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, [field]: value }),
    }))
  }

  function toggleDone(exIdx, setIdx) {
    setExercises(prev => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex,
      sets: ex.sets.map((s, si) => si !== setIdx ? s : { ...s, done: !s.done }),
    }))
  }

  function addSet(exIdx) {
    setExercises(prev => prev.map((ex, ei) => ei !== exIdx ? ex : {
      ...ex,
      sets: [...ex.sets, { setNum: ex.sets.length + 1, weight: '', reps: '', done: false }],
    }))
  }

  function addFreeExercise(name) {
    if (!allExNames.some(n => n.toLowerCase() === name.toLowerCase())) {
      const updated = [...customExNames, name]
      setCustomExNames(updated)
      localStorage.setItem('gym_custom_exercises', JSON.stringify(updated))
    }
    setExercises(prev => [...prev, {
      name, technique: null, reps: '', workingSets: 3, rest: null, sub1: null, sub2: null,
      note: '',
      sets: [{ setNum: 1, weight: '', reps: '', done: false }],
    }])
    setSearch('')
    setShowSearch(false)
    setExpanded(prev => new Set([...prev, exercises.length]))
  }

  async function handleFinish() {
    setSaving(true)
    try {
      await saveWorkout({
        date: toDateStr(TODAY),
        type: isFree ? 'free' : 'program',
        block: block ?? null,
        week: week ?? null,
        sessionType: isFree ? null : sessionType,
        name: sessionInfo.name,
        durationMin: Math.round(elapsed / 60),
        exercises,
      })

      if (!isFree && week && week < 10) {
        const ALL_SESSIONS = ['upper1', 'lower1', 'upper2', 'lower2', 'arms']
        const done = await getCompletedSessionsForWeek(week, block)
        const completedSet = new Set([...done, sessionType])
        if (ALL_SESSIONS.every(s => completedSet.has(s))) {
          const nextWeek = week + 1
          localStorage.setItem('gym_week', String(nextWeek))
          onFinish({ weekAdvanced: true, nextWeek })
          return
        }
      }

      onFinish({})
    } catch (e) {
      alert('Error saving: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const mins = Math.floor(elapsed / 60)
  const secs = String(elapsed % 60).padStart(2, '0')
  const doneSets = exercises.flatMap(e => e.sets).filter(s => s.done).length

  return (
    <div className="app">
      <div className="workout-header">
        <button className="back-btn" onClick={onCancel}>✕</button>
        <div className="workout-header-info">
          <h2>{sessionInfo.name}</h2>
          <p>{week ? `Week ${week} · Block ${block}` : 'Custom'} · {doneSets} sets done</p>
        </div>
        <div className="timer-badge">{mins}:{secs}</div>
      </div>

      <div className="view" style={{ paddingBottom: 100 }}>
        <div className="view-body">
          {exercises.map((ex, exIdx) => {
            const isOpen = expanded.has(exIdx)
            const prevSets = getPrevSets(ex.name)
            const allDone = ex.sets.length > 0 && ex.sets.every(s => s.done)

            return (
              <div key={exIdx} className="ex-card">
                <div className="ex-card-header" onClick={() => {
                  setExpanded(prev => {
                    const n = new Set(prev)
                    n.has(exIdx) ? n.delete(exIdx) : n.add(exIdx)
                    return n
                  })
                }}>
                  <div className={`ex-num ${allDone ? 'done' : ''}`}>
                    {allDone ? '✓' : exIdx + 1}
                  </div>
                  <div className="ex-info">
                    <div className="ex-name">{ex.name}</div>
                    <div className="ex-meta">{ex.workingSets} sets · {ex.reps || '—'} reps{ex.rest ? ` · ${ex.rest}` : ''}</div>
                  </div>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 18, cursor: 'pointer', padding: '0 4px', lineHeight: 1 }}
                    onClick={e => { e.stopPropagation(); setExercises(prev => prev.filter((_, i) => i !== exIdx)) }}
                  >✕</button>
                  <span className={`ex-chevron ${isOpen ? 'open' : ''}`}>›</span>
                </div>

                {isOpen && (
                  <div className="ex-body">
                    {ex.technique && (() => {
                      const def = getTechniqueDef(ex.technique)
                      return (
                        <span
                          className="technique-badge"
                          style={def ? { cursor: 'pointer' } : {}}
                          onClick={() => def && setTechModal(def)}
                        >
                          ⚡ {ex.technique}
                        </span>
                      )
                    })()}

                    {prevSets.length > 0 && (
                      <div className="prev-data">
                        <div className="prev-data-label">Last time</div>
                        <div className="prev-sets">
                          {prevSets.map((s, i) => (
                            <span key={i} className="prev-set">
                              {s.weight != null ? `${s.weight}kg` : '—'} × {s.reps ?? '—'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="sets-table">
                      <div className="set-header-row">
                        <div className="set-col-label">Set</div>
                        <div className="set-col-label">kg</div>
                        <div className="set-col-label">Reps</div>
                        <div />
                      </div>
                      {ex.sets.map((s, sIdx) => (
                        <div key={sIdx} className="set-row">
                          <div className="set-label">{s.setNum}</div>
                          <input
                            className="input-sm"
                            type="number"
                            inputMode="decimal"
                            placeholder="—"
                            value={s.weight}
                            onChange={e => updateSet(exIdx, sIdx, 'weight', e.target.value)}
                          />
                          <input
                            className="input-sm"
                            type="number"
                            inputMode="numeric"
                            placeholder="—"
                            value={s.reps}
                            onChange={e => updateSet(exIdx, sIdx, 'reps', e.target.value)}
                          />
                          <button
                            className={`set-check ${s.done ? 'done' : ''}`}
                            onClick={() => toggleDone(exIdx, sIdx)}
                          >
                            {s.done ? '✓' : ''}
                          </button>
                        </div>
                      ))}
                    </div>

                    <button className="add-set-btn" onClick={() => addSet(exIdx)}>+ Add set</button>

                    {(ex.sub1 || ex.sub2) && (
                      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                        Sub: {[ex.sub1, ex.sub2].filter(Boolean).join(' / ')}
                      </div>
                    )}

                    <textarea
                      className="input"
                      style={{ fontSize: 13, minHeight: 60, resize: 'vertical' }}
                      placeholder="Notes..."
                      value={ex.note ?? ''}
                      onChange={e => setExercises(prev => prev.map((x, i) => i !== exIdx ? x : { ...x, note: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            )
          })}

          {/* Add exercise (available in all session types) */}
          <div>
            {showSearch ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="search-input-wrap">
                  <span className="search-icon">🔍</span>
                  <input
                    className="input"
                    style={{ paddingLeft: 36 }}
                    placeholder="Search or type a new exercise..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                {isNew && (
                  <div
                    className="exercise-option"
                    style={{ borderLeft: '3px solid var(--upper)', color: 'var(--upper)' }}
                    onClick={() => addFreeExercise(search.trim())}
                  >
                    + Add "{search.trim()}"
                  </div>
                )}
                {filtered.slice(0, 8).map((name, i) => (
                  <div key={i} className="exercise-option" onClick={() => addFreeExercise(name)}>
                    {name}
                  </div>
                ))}
                <button className="btn btn-ghost btn-full" onClick={() => { setShowSearch(false); setSearch('') }}>Cancel</button>
              </div>
            ) : (
              <button className="btn btn-ghost btn-full" onClick={() => setShowSearch(true)}>
                + Add exercise
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, padding: '12px 20px 28px', background: 'var(--bg)', borderTop: '1px solid var(--border)' }}>
        <button className="btn btn-green btn-full btn-lg" onClick={handleFinish} disabled={saving}>
          {saving ? 'Saving…' : 'Finish Workout'}
        </button>
      </div>

      {techModal && (
        <div className="modal-overlay" onClick={() => setTechModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>⚡ {techModal.label}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-muted)' }}>{techModal.text}</p>
            <button className="btn btn-primary btn-full" style={{ marginTop: 20 }} onClick={() => setTechModal(null)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── History View ──────────────────────────────────────────────────────────────

function HistoryView({ onDeleted }) {
  const [workouts, setWorkouts] = useState([])
  const [activities, setActivities] = useState([])
  const [expanded, setExpanded] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getWorkouts(), getActivities()])
      .then(([w, a]) => { setWorkouts(w); setActivities(a) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDeleteWorkout(id) {
    if (!confirm('Delete this workout?')) return
    try {
      await deleteWorkout(id)
      setWorkouts(prev => prev.filter(w => w.id !== id))
      onDeleted?.()
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  async function handleDeleteActivity(id) {
    if (!confirm('Delete this activity?')) return
    try {
      await deleteActivity(id)
      setActivities(prev => prev.filter(a => a.id !== id))
      onDeleted?.()
    } catch (e) {
      alert('Error: ' + e.message)
    }
  }

  const allItems = [
    ...workouts.map(w => ({ ...w, kind: 'workout' })),
    ...activities.map(a => ({ ...a, kind: 'activity' })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  function toggleExpand(id) {
    setExpanded(prev => {
      const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
    })
  }

  if (loading) return (
    <div className="view">
      <div className="view-header"><h1>History</h1></div>
      <div className="view-body"><div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</div></div>
    </div>
  )

  return (
    <div className="view">
      <div className="view-header"><h1>History</h1></div>
      <div className="view-body">
        {allItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No workouts logged yet</p>
          </div>
        )}
        {allItems.map(item => {
          const isOpen = expanded.has(item.id)
          const color = item.kind === 'workout' ? sessionColor(item.session_type) : 'var(--activity)'

          if (item.kind === 'activity') {
            const at = ACTIVITY_TYPES.find(t => t.id === item.activity_type)
            return (
              <div key={item.id} className="history-item">
                <div className="history-item-header" onClick={() => toggleExpand(item.id)}>
                  <div className="history-color-bar" style={{ background: color }} />
                  <div className="history-info">
                    <div className="history-name">{at?.emoji} {at?.label ?? item.activity_type}</div>
                    <div className="history-sub">{formatDate(item.date)}{item.duration_min ? ` · ${formatDuration(item.duration_min)}` : ''}</div>
                  </div>
                  <button
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 16, cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}
                    onClick={e => { e.stopPropagation(); handleDeleteActivity(item.id) }}
                  >🗑</button>
                  <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>{isOpen ? '▾' : '›'}</span>
                </div>
                {isOpen && item.notes && (
                  <div className="history-body">
                    <div className="history-ex">{item.notes}</div>
                  </div>
                )}
              </div>
            )
          }

          const setsByEx = {}
          ;(item.workout_sets ?? []).forEach(s => {
            setsByEx[s.exercise_name] = setsByEx[s.exercise_name] ?? []
            setsByEx[s.exercise_name].push(s)
          })

          return (
            <div key={item.id} className="history-item">
              <div className="history-item-header" onClick={() => toggleExpand(item.id)}>
                <div className="history-color-bar" style={{ background: color }} />
                <div className="history-info">
                  <div className="history-name">{item.name}</div>
                  <div className="history-sub">
                    {formatDate(item.date)}
                    {item.week ? ` · Week ${item.week}` : ''}
                    {item.duration_min ? ` · ${formatDuration(item.duration_min)}` : ''}
                  </div>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 16, cursor: 'pointer', padding: '4px 8px', lineHeight: 1 }}
                  onClick={e => { e.stopPropagation(); handleDeleteWorkout(item.id) }}
                >🗑</button>
                <span style={{ color: 'var(--text-dim)', fontSize: 18 }}>{isOpen ? '▾' : '›'}</span>
              </div>
              {isOpen && (
                <div className="history-body">
                  {Object.entries(setsByEx).map(([name, sets]) => {
                    const noteRow = sets.find(s => s.set_number === 0)
                    const workSets = sets.filter(s => s.set_number > 0).sort((a,b) => a.set_number - b.set_number)
                    return (
                      <div key={name} className="history-ex">
                        <strong>{name}</strong>
                        <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {workSets.map((s, i) => (
                            <span key={i} style={{ fontSize: 12, background: 'var(--surface2)', padding: '3px 8px', borderRadius: 6 }}>
                              {s.weight != null ? `${s.weight}kg` : '—'} × {s.reps ?? '—'}
                            </span>
                          ))}
                        </div>
                        {noteRow?.note && (
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                            {noteRow.note}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Log Activity View ─────────────────────────────────────────────────────────

function LogActivityView({ onSaved }) {
  const [actType, setActType] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!actType) return alert('Select an activity type')
    setSaving(true)
    try {
      await saveActivity({
        date: toDateStr(TODAY),
        activity_type: actType,
        duration_min: duration ? parseInt(duration) : null,
        notes: notes || null,
      })
      onSaved()
    } catch (e) {
      alert('Error saving: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="view">
      <div className="view-header"><h1>Log Activity</h1></div>
      <div className="view-body">

        <div className="section-title">Activity type</div>
        <div className="type-grid">
          {ACTIVITY_TYPES.map(t => (
            <div
              key={t.id}
              className={`type-option ${actType === t.id ? 'selected' : ''}`}
              onClick={() => setActType(t.id)}
            >
              <span className="emoji">{t.emoji}</span>
              {t.label}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 8 }}>
          <label className="form-label">Duration (minutes)</label>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            placeholder="e.g. 45"
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Notes</label>
          <textarea
            className="input"
            style={{ resize: 'vertical', minHeight: 80 }}
            placeholder="Easy 5k, felt good…"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <button className="btn btn-full btn-lg" style={{ background: 'var(--activity)', color: '#000', fontWeight: 700, marginTop: 8 }} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Activity'}
        </button>
      </div>
    </div>
  )
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'today',    label: 'Today',    icon: '🏋️' },
    { id: 'history',  label: 'History',  icon: '📋' },
    { id: 'log',      label: 'Activity', icon: '🏃' },
  ]
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('today')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [weekBanner, setWeekBanner] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function startWorkout(config) {
    setActiveWorkout(config ?? { sessionType: 'free', block: null, week: null })
  }

  function finishWorkout({ weekAdvanced, nextWeek } = {}) {
    setActiveWorkout(null)
    setTab('today')
    setRefreshKey(k => k + 1)
    if (weekAdvanced) setWeekBanner(nextWeek)
  }

  if (activeWorkout) {
    return <WorkoutView config={activeWorkout} onFinish={finishWorkout} onCancel={() => setActiveWorkout(null)} />
  }

  return (
    <div className="app">
      {tab === 'calendar' && <CalendarView onStartWorkout={startWorkout} refreshKey={refreshKey} />}
      {tab === 'today'    && <TodayView    onStartWorkout={startWorkout} />}
      {tab === 'history'  && <HistoryView onDeleted={() => setRefreshKey(k => k + 1)} />}
      {tab === 'log'      && <LogActivityView onSaved={() => { setTab('history'); setRefreshKey(k => k + 1) }} />}
      <BottomNav tab={tab} setTab={setTab} />

      {weekBanner && (
        <div
          style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, zIndex: 300, padding: '16px 20px', background: 'var(--lower)', color: '#000', fontWeight: 700, fontSize: 15, textAlign: 'center', cursor: 'pointer' }}
          onClick={() => setWeekBanner(null)}
        >
          🎉 Week complete! Starting week {weekBanner}
        </div>
      )}
    </div>
  )
}
