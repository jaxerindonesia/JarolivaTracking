export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('jaxlab-token')
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
      ? data.message
      : `Permintaan gagal (${response.status} ${response.statusText}).`
    throw new Error(message)
  }
  return data
}
