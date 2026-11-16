'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const initial = useRef(initialValue)
  const current = useRef({ key, value: initial.current })
  const [value, setValue] = useState(initial.current)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let saved = initial.current
    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        const parsed = JSON.parse(raw)
        // Reject incompatible data instead of crashing array consumers.
        if (Array.isArray(initial.current) ? Array.isArray(parsed) : typeof parsed === typeof initial.current) saved = parsed
      }
    } catch { /* Storage can be disabled or contain invalid JSON. */ }
    current.current = { key, value: saved }
    setValue(saved)
    setLoaded(true)
  }, [key])

  const set = useCallback((update) => {
    const previous = current.current.key === key ? current.current.value : initial.current
    const next = typeof update === 'function' ? update(previous) : update
    current.current = { key, value: next }
    setValue(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* Keep the in-memory update usable. */ }
  }, [key])

  return [value, set, loaded]
}
