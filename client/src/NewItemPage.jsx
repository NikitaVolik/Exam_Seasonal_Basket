import { useState } from "react";
import { api } from "./api.js";

const setPrices = new Map([
  ["Овощной", 690],
  ["Фруктовый", 890],
  ["Завтрак", 990]
])

export default function NewItemPage() {
  const [form, setForm] = useState({
    title: '',
    quantity: '1',
    pickup_date: ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const quantity = Number(form.quantity)
  const unitPrice = setPrices.get(form.title)
  const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= 5
  const total = unitPrice !== undefined && validQuantity ? unitPrice * quantity : null

  function change(event) {
    const { name, value } = event.target
    setForm(current => ({ ...current, [name]: value }))
    setMessage('')
  }

  async function submit(event) {
    event.preventDefault()

    if (saving) return

    setSaving(true)
    setError('')
    setMessage('')
    
    try {
      const data = await api('/items', {
        method: 'POST',
        body: JSON.stringify(form)
      })

      setForm({
        title: '',
        quantity: '1',
        pickup_date: ''
      })
      setMessage(`Заказ № ${data.id} оформлен. Итог: ` + Number(data.total_price).toLocaleString('ru-RU') + ' ₽')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1>Новый заказ</h1>
      <form className="card stack" onSubmit={submit}>
        <label className="field">
          <span>Набор</span>
          <select
            name="title"
            value={form.title}
            onChange={change}
            required
            disabled={saving}
          >
            <option value="" disabled hidden>Выберите набор</option>
            {[...setPrices].map(([title, price]) => (
              <option key={title} value={title}>
                {title} — {price} ₽ за набор
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Количество наборов</span>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={change}
            required
            min="1"
            max="5"
            step="1"
            disabled={saving}
          />
        </label>
        <label className="field">
          <span>Дата самовывоза</span>
          <input
            name="pickup_date"
            value={form.pickup_date}
            placeholder="ДД.ММ.ГГГГ"
            onChange={change}
            required
            maxLength={10}
            disabled={saving}
          />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-message" role="status">{message} <a href="/">Мои заказы</a></p>}
        <div className="row order-summary">
          <p aria-live="polite">
            Итого: {total === null ? "—" : total.toLocaleString("ru-RU") + " ₽"}
          </p>
        </div>
        <button className="btn" disabled={saving}>
          {saving ? "Сохранение.." : "Добавить"}
        </button>
      </form>
    </>
  )
}