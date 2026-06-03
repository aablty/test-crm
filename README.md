# Мини-CRM с real-time обновлением задач

## Стек

- Frontend: React, TypeScript, Vite, Tailwind CSS, Socket.IO Client
- Backend: NestJS, TypeScript, Passport JWT, class-validator, Socket.IO Gateway
- Database: PostgreSQL, Prisma ORM
- Infrastructure: Docker Compose, Redis

Redis поднят в `docker-compose.yml`.

## Запуск через Docker

```bash
docker compose up --build
```

| Контейнер  | Порт |
| ---------- | ---- |
| Client     | 5173 |
| Server     | 3000 |
| PostgreSQL | 5432 |
| Redis      | 6379 |

Backend контейнер перед стартом выполняет:

```bash
npx prisma migrate deploy
```

## API

Auth:

- `POST /auth/register` - регистрация, body: `{ email, password }`
- `POST /auth/login` - вход, возвращает `{ access_token }`
- `GET /auth/profile` - профиль текущего пользователя

Tasks:

- `GET /tasks` - список задач текущего пользователя
- `POST /tasks` - создать задачу
- `PATCH /tasks/:id` - обновить задачу или статус
- `DELETE /tasks/:id` - удалить задачу

Все routes кроме register/login защищены JWT guard. Токен передается в заголовке:

```http
Authorization: Bearer <access_token>
```

## WebSocket

Клиент передает JWT при подключении:

```ts
io(VITE_API_URL, {
  auth: { token },
  transports: ["websocket"],
});
```

Backend проверяет JWT и подключает socket к комнате текущего пользователя.

События:

- `task.created` - создана задача, payload: полная задача
- `task.updated` - задача обновлена, payload: полная задача
- `task.deleted` - задача удалена, payload: `{ id, timestamp }`
- `task.statusChanged` - изменился статус, payload: `{ id, status, timestamp }`

На фронте при `task.statusChanged` дополнительно выполняется `GET /tasks`, чтобы список полностью синхронизировался с сервером.

## Структура проекта

```text
.
├── client
│   ├── src
│   │   ├── features
│   │   │   ├── auth
│   │   │   └── tasks
│   │   └── shared
├── server
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── src
│   │   ├── auth
│   │   ├── prisma
│   │   ├── tasks
│   │   └── users
└── docker-compose.yml
```
