# О проекте

«Сезонная корзина» — портал, на котором доступен предзаказ продуктовых наборов с самовывозом.

# База данных

Запусти MariaDB в Docker. Подключись через HeidiSQL и выполни sql/setup.sql. Скрипты используют базу exam_seasonal_basket.

# Настройка окружения

Скопируй server/.env.example в server/.env. Заполни параметры подключения к MariaDB и JWT_SECRET. Для DB_PORT укажи порт Docker на хосте, по которому подключается HeidiSQL.

# Запуск и вход

Сервер — из корня Exam_Seasonal_Basket, после импорта SQL и настройки .env:

```
cd server
npm ci
npm run create-admin
npm run dev
```

Клиент — в новом терминале, тоже из корня Exam_Seasonal_Basket:

```
cd client
npm ci
npm run dev
```

Открой адрес, который выведет Vite. Для кода укажи экзаменационные реквизиты — Admin26 / Demo20.

[ER-диаграмма](docs/er-diagram.md)