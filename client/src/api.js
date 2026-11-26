export async function api(path, options = {}) {
  const token = sessionStorage.getItem('exam-token')

  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })

  let data
  let invalidJson = false
  try {
    data = await response.json()
  } catch {
    data = null
    invalidJson = true
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Не удалось выполнить запрос (HTTP ${response.status})`)
    error.status = response.status
    error.fields = data?.errors || {}

    if (response.status === 401 && token) {
      sessionStorage.removeItem('exam-token')
      window.location.assign('/login')
    }

    throw error
  }

  if (invalidJson && response.status !== 204) {
    const error = new Error('Сервер вернул некорректный ответ. Попробуйте ещё раз.')
    error.status = response.status
    throw error
  }

  return data
}
