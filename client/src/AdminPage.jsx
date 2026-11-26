import { useEffect, useState } from "react";
import { api } from "./api.js";
import { statuses } from "./statuses.js";

export default function AdminPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('desc')
  const [page, setPage] = useState(1)
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    let active = true

    api('/admin/items').then(data => { if (active) setItems(data) })
      .catch(err => { if (active) setError(err.message) })
      .finally(() => { if (active) setLoading(false) })
    
    return () => {
      active = false
    }
  }, [])

  const filtered = items.filter(item => !status || item.status === status).sort((a, b) => sort === 'asc' ? a.id - b.id : b.id - a.id)
  const totalPages = Math.max(1, Math.ceil(filtered.length / 4))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * 4, currentPage * 4)

  async function saveStatus(id, nextStatus) {
    if (savingId !== null) return

    setSavingId(id)
    setError('')
    setMessage('')
    
    try {
      await api(`/admin/items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus })
      })

      setItems(current => current.map(item => item.id == id ? { ...item, status: nextStatus } : item))
      setMessage(`Статус заказа № ${id} сохранён`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <>
      <h1>Администратор</h1>
      <div className="card row">
        <label className="field">
          <span>Фильтр по статусу</span>
          <select
            value={status}
            onChange={event => {
              setStatus(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Все статусы</option>
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Порядок заказов</span>
          <select
            value={sort}
            onChange={event => {
              setSort(event.target.value)
              setPage(1)
            }}
          >
            <option value="desc">Сначала новые</option>
            <option value="asc">Сначала старые</option>
          </select>
        </label>
        <a href="/admin">Обновить список</a>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {message && 
        <div className="notice row" role="status">
          <span>{message}</span>
          <button type="button" className="btn" onClick={() => setMessage('')}>
            Закрыть
          </button>
        </div>
      }

      {!loading && !error && filtered.length === 0 && (
        <p>Заказов не найдено</p>
      )}

      <div className="grid cols-2">
        {visible.map(item => (
          <article className="card stack" key={item.id}>
            <h2>Заказ № {item.id}</h2>
            <h3>{item.title}</h3>
            <p>Пользователь: {item.login}</p>
            <p>Количество: {item.quantity}</p>
            <p>Цена за набор: {Number(item.unit_price).toLocaleString("ru-RU")} ₽</p>
            <p>Итого: {Number(item.total_price).toLocaleString("ru-RU")} ₽</p>
            <p>Дата самовывоза: {item.pickup_date}</p>
            <label className="field">
              <span>Статус (сохраняется сразу)</span>
              <select
                value={item.status}
                disabled={savingId !== null}
                onChange={event => saveStatus(item.id, event.target.value)}
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>

      <nav className="row" aria-label="Страницы заказов">
        <button className="btn" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
          Назад
        </button>

        <span>{currentPage} / {totalPages}</span>

        <button className="btn" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
          Вперёд
        </button>
      </nav>
    </>
  )
}