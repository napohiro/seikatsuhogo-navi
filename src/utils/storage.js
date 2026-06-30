const KEYS = {
  ANSWERS: 'shnavi_answers',
  ANSWERS_AT: 'shnavi_answers_at',
  RESULT: 'shnavi_result',
  CHECKLIST: 'shnavi_checklist',
  CHECKLIST_AT: 'shnavi_checklist_at',
  SIMULATOR: 'shnavi_simulator',
  HOUSEHOLD: 'shnavi_household',
  AIMEMO: 'shnavi_aimemo',
}

// ── Questionnaire ────────────────────────────────────────────────

export function saveAnswers(answers) {
  try {
    localStorage.setItem(KEYS.ANSWERS, JSON.stringify(answers))
    localStorage.setItem(KEYS.ANSWERS_AT, new Date().toISOString())
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadAnswers() {
  try {
    const raw = localStorage.getItem(KEYS.ANSWERS)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function loadAnswersAt() {
  return localStorage.getItem(KEYS.ANSWERS_AT) || null
}

export function saveResult(result) {
  try {
    localStorage.setItem(KEYS.RESULT, JSON.stringify(result))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadResult() {
  try {
    const raw = localStorage.getItem(KEYS.RESULT)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ── Checklist ────────────────────────────────────────────────────

export function saveChecklist(checklist) {
  try {
    localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(checklist))
    localStorage.setItem(KEYS.CHECKLIST_AT, new Date().toISOString())
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadChecklist() {
  try {
    const raw = localStorage.getItem(KEYS.CHECKLIST)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function loadChecklistAt() {
  return localStorage.getItem(KEYS.CHECKLIST_AT) || null
}

// ── Living Simulator ─────────────────────────────────────────────

export function saveSimulator(answers) {
  try {
    localStorage.setItem(KEYS.SIMULATOR, JSON.stringify({ answers, updatedAt: new Date().toISOString() }))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadSimulator() {
  try {
    const raw = localStorage.getItem(KEYS.SIMULATOR)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSimulator() {
  try {
    localStorage.removeItem(KEYS.SIMULATOR)
  } catch (e) {
    console.warn('localStorage clear failed', e)
  }
}

// ── Household Nav ────────────────────────────────────────────────

export function saveHousehold(answers) {
  try {
    localStorage.setItem(KEYS.HOUSEHOLD, JSON.stringify({ answers, updatedAt: new Date().toISOString() }))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadHousehold() {
  try {
    const raw = localStorage.getItem(KEYS.HOUSEHOLD)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearHousehold() {
  try {
    localStorage.removeItem(KEYS.HOUSEHOLD)
  } catch (e) {
    console.warn('localStorage clear failed', e)
  }
}

// ── AI Memo ──────────────────────────────────────────────────────

export function saveAiMemo(inputs) {
  try {
    localStorage.setItem(KEYS.AIMEMO, JSON.stringify({ inputs, updatedAt: new Date().toISOString() }))
  } catch (e) {
    console.warn('localStorage save failed', e)
  }
}

export function loadAiMemo() {
  try {
    const raw = localStorage.getItem(KEYS.AIMEMO)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearAiMemo() {
  try {
    localStorage.removeItem(KEYS.AIMEMO)
  } catch (e) {
    console.warn('localStorage clear failed', e)
  }
}

// ── Utilities ────────────────────────────────────────────────────

export function formatUpdatedAt(isoStr) {
  if (!isoStr) return null
  try {
    const d = new Date(isoStr)
    const y = d.getFullYear()
    const mo = d.getMonth() + 1
    const day = d.getDate()
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${y}年${mo}月${day}日 ${h}時${min}分`
  } catch {
    return null
  }
}

export function clearAll() {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  } catch (e) {
    console.warn('localStorage clear failed', e)
  }
}
