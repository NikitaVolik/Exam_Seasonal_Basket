import { useState } from "react";
import { api } from "./api.js";

const registerFields = [
  ['login', 'Логин', 'text', 'username'],
  ['password', 'Пароль', 'password', 'new-password'],
  ['full_name', 'ФИО', 'text', 'name'],
  ['phone_number', 'Телефон', 'tel', 'tel'],
  ['email', 'Email', 'text', 'email']
]

const loginFields = [
  ['login', 'Логин', 'text', 'username'],
  ['password', 'Пароль', 'password', 'current-password']
]

export default function AuthPage({ register = false }) {
  const [form, setForm] = useState({
    login: '',
    password: '',
    full_name: '',
    phone_number: '',
    email: ''
  })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const fields = register ? registerFields : loginFields

  async function submit(event) {
    event.preventDefault()

    if (saving) return

    setSaving(true)
    setError('')
    setErrors({})
    setMessage('')
    
    try {
      const data = await api(register ? '/register' : '/login', {
        method: 'POST',
        body: JSON.stringify(form)
      })

      if (register) {
        setForm({
          login: '',
          password: '',
          full_name: '',
          phone_number: '',
          email: ''
        })
        setMessage(data.message)
      } else {
        sessionStorage.setItem('exam-token', data.token)
        window.location.assign(data.user.role === 'admin' ? '/admin' : '/')
      }
    } catch (err) {
      setError(err.message)
      setErrors(err.fields || {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1>{register ? 'Регистрация' : 'Вход'}</h1>
      <form className="card stack" onSubmit={submit} noValidate>
        {fields.map(([name, label, type, autoComplete]) => (
          <label className="field" key={name}>
            <span>{label}</span>
            <input
              type={type}
              name={name}
              value={form[name]}
              autoComplete={autoComplete}
              required
              disabled={saving}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${name}-error` : undefined}
              onChange={event => setForm(current => ({
                ...current,
                [name]: event.target.value
              }))}
            />
            {errors[name] && (
              <small className="field-error" id={`${name}-error`}>
                {errors[name]}
              </small>
            )}
          </label>
        ))}
        {register && <small>Логин: латиница и цифры, 6–50 символов. Пароль: от 8 символов, не более 72 байт в UTF-8 (для латиницы — 72 символа, для кириллицы — 36).</small>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-message" role="status">{message} <a href="/login">Войти</a></p>}
        <button className="btn" disabled={saving}>
          {saving ? "Подождите..." : register ? "Зарегистрироваться" : "Войти"}
        </button>
        <a href={register ? "/login" : "/register"}>
          {register ? "Уже зарегистрированы? Вход" : "Ещё не зарегистрированы? Регистрация"}
        </a>
      </form>
    </>
  )
}
