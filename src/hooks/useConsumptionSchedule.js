import { useEffect, useState } from 'react'

export function useConsumptionSchedule() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const update = () => setNow(new Date())
    const interval = window.setInterval(update, 60_000)
    window.addEventListener('focus', update)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', update)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  return (time) => {
    const [hours, minutes] = time.split('.').map(Number)
    return currentMinutes >= hours * 60 + minutes
  }
}
