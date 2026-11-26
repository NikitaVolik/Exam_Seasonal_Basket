```mermaid
erDiagram
    users ||..o{ items : "создаёт"
    users {
        int id PK
        varchar(50) login UK
        varchar(255) password_hash
        varchar(100) full_name
        varchar(20) phone_number
        varchar(255) email
        enum role
    }
    items {
        int id PK
        int user_id FK
        varchar(150) title
        int quantity
        varchar(10) pickup_date
        int unit_price
        int total_price
        varchar(20) status
        timestamp created_at
    }
```