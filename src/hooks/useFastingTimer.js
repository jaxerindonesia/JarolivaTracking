import { useState, useEffect } from 'react'

/**
 * useFastingTimer — custom hook
 * Returns live elapsed seconds from a given start timestamp
 */
export function useFastingTimer(startIso, targetHours = 72) {
  const startMs = new Date(startIso).getTime()
  const targetMs = targetHours * 60 * 60 * 1000

  const getElapsed = () => {
    const now = Date.now()
    return Math.max(0, now - startMs)
  }

  const [elapsed, setElapsed] = useState(getElapsed)

  useEffect(() => {
    const id = setInterval(() => setElapsed(getElapsed()), 1000)
    return () => clearInterval(id)
  }, [startIso])

  const totalSeconds = Math.floor(elapsed / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const pad = (n) => String(n).padStart(2, '0')
  const timeString = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`

  const percentage = Math.min(100, (elapsed / targetMs) * 100)
  const remaining = Math.max(0, targetMs - elapsed)
  const remainingHours = Math.floor(remaining / 3600000)
  const remainingMinutes = Math.floor((remaining % 3600000) / 60000)

  return {
    timeString,
    hours,
    minutes,
    seconds,
    percentage,
    remainingHours,
    remainingMinutes,
    totalSeconds,
  }
}

export function formatDuration(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}m`
  return `${Math.floor(hours)}j`
}
