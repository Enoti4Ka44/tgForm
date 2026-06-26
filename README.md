# tgForm

Express-сервер для приёма формы и отправки заявок в Telegram.

## Деплой (Docker + GitHub Actions)

При пуше в `main` workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml):
1. Собирает Docker-образ и пушит в GitHub Container Registry (`ghcr.io/<owner>/<repo>`).
2. По SSH подключается к серверу, генерирует `.env` и `docker-compose.yml`, выполняет `docker compose pull && up -d`.

### Нужные secrets в GitHub (Settings → Secrets and variables → Actions)

| Secret | Описание |
|---|---|
| `SSH_HOST` | IP/домен сервера |
| `SSH_USER` | Пользователь для SSH |
| `SSH_KEY` | Приватный SSH-ключ (без пароля) |
| `SSH_PORT` | Порт SSH (опционально, по умолчанию 22) |
| `PORT` | Порт приложения, например `3000` |
| `TG_BOT_TOKEN` | Токен Telegram-бота |
| `TG_CHAT_ID` | ID чата для уведомлений |
| `ALLOWED_ORIGIN` | Разрешённый origin для CORS |

`GITHUB_TOKEN` для пуша/пулла образа из GHCR создаётся автоматически, добавлять его не нужно.

### Требования к серверу

- Установлен Docker и Docker Compose plugin (`docker compose version`).
- Пакет `ghcr.io/<owner>/tgform` должен быть доступен пользователю — либо сделайте его публичным в настройках пакета на GitHub, либо workflow логинится в GHCR от имени `github.actor` с тем же `GITHUB_TOKEN`, чем он и пушился, так что доступ есть по умолчанию.

## Локальный запуск через Docker

```bash
docker build -t tgform .
docker run --env-file .env -p 3000:3000 tgform
```
