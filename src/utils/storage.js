const KEYS = {
  ANSWERS: 'shnavi_answers',
  RESULT: 'shnavi_result',
  CHECKLIST: 'shnavi_checklist',
}

export function saveAnswers(answers) {
  try {
    localStorage.setItem(KEYS.ANSWERS, JSON.stringify(answers))
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

export function saveChecklist(checklist) {
  try {
    localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(checklist))
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

export function clearAll() {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  } catch (e) {
    console.warn('localStorage clear failed', e)
  }
}
