'use client'
import { useState, useEffect } from 'react'
export function useLocalStorage(key, init) {
  const [val, setVal] = useState(init)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setVal(JSON.parse(s)) } catch {}
    setLoaded(true)
  }, [key])
  const set = (v) => {
    const next = typeof v === 'function' ? v(val) : v
    setVal(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }
  return [val, set, loaded]
}
