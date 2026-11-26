import { useEffect, useState } from 'react'
import { api } from './api.js'
import AuthPage from './AuthPage.jsx'
import NewItemPage from './NewItemPage.jsx'
import Dashboard from './Dashboard.jsx'
import AdminPage from './AdminPage.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        if (sessionStorage.getItem('exam-token')) {
          const data = await api('/me')
          if (active) setUser(data)
        }
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadUser()

    return () => {
      active = false
    }
  }, [])

  function logout() {
    sessionStorage.removeItem('exam-token')
    window.location.assign('/login')
  }

  let page

  if (loading) {
    page = <p>Загрузка...</p>
  } else if (error) {
    page = <p className='form-error' role='alert'>{error} <a href={path}>Повторить</a></p>
  } else if (path === '/login') {
    page = <AuthPage />
  } else if (path === '/register') {
    page = <AuthPage register />
  } else if (!['/', '/new', '/admin'].includes(path)) {
    page = <h1>Страница не найдена</h1>
  } else if (!user) {
    page = <p>Для продолжения <a href='/login'>войдите</a> или <a href='/register'>зарегистрируйтесь</a>.</p>
  } else if (path === '/admin') {
    page = user.role === 'admin' ? <AdminPage /> : <p role='alert'>Доступ только администратору</p>
  } else if (path === '/new') {
    page = <NewItemPage />
  } else {
    page = <Dashboard user={user} />
  }

  return (
    <>
      <header className='site-header'>
        <nav className='container row' aria-label='Главное меню'>
          <a href='/'>Личный кабинет</a>
          {user ? 
            <>
              <a href='/new'>Новый заказ</a>
              {user.role === 'admin' && <a href='/admin'>Администратор</a>}
              <button type='button' className='btn' onClick={logout}>Выйти</button>
            </> :
            <>
              <a href='/login'>Вход</a>
              <a href='/register'>Регистрация</a>
            </>}
        </nav>
      </header>
      <main className='container stack page'>
        {page}
      </main>
      <footer className='container page'>
        <small>«Сезонная корзина»</small>
      </footer>
    </>
  )
}
