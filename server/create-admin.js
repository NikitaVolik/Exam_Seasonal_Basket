import bcrypt from "bcryptjs"
import { db } from "./db.js"

try {
  const login = process.env.ADMIN_LOGIN
  const password = process.env.ADMIN_PASSWORD

  if (!login || !password) {
    throw new Error("Заполните логин и пароль администратора")
  }

  if (!/^[A-Za-z0-9]{6,50}$/.test(login) || password.length < 6 || bcrypt.truncates(password)) {
    throw new Error("Логин: латиница и цифры, 6–50 символов. Пароль: 6 символов, не более 72 байт в UTF-8")
  }

  const [rows] = await db.query(
    `SELECT id FROM users WHERE login = ?`,
    [login]
  )

  if (rows.length > 0) {
    console.log("Логин уже существует. Данные и роль не изменены.")
  } else {
    const hash = await bcrypt.hash(password, 10)
    await db.query(
      `INSERT INTO users (login, password_hash, role, full_name, phone_number, email)
      VALUES (?, ?, 'admin', ?, ?, ?)`,
      [login, hash, "Администратор", "+79990000000", "admin@example.com"]
    )
    
    console.log("Администратор создан")
  }
} finally {
  await db.end()
}
