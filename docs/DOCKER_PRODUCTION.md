# Production deployment on VPS (Docker Compose)

Ниже инструкция под ваш сценарий: **VPS без установленной БД**, память до **10 GB**, frontend публичный, backend приватный.

## Что уже готово в проекте

- `frontend` (Nginx) опубликован наружу только на `80/443`.
- `backend` **не публикуется** наружу (только `expose: 8080` внутри Docker-сети).
- Добавлен контейнер `postgres` (БД внутри вашего VPS).
- `/api` в Nginx проксируется в `backend:8080`.
- Добавлен `certbot` для авто-renew сертификатов.

## 1) Подготовка VPS

Убедитесь, что:

- DNS A-запись домена указывает на IP VPS.
- На VPS открыты порты `80` и `443` (firewall/security group).
- Установлены Docker и Docker Compose plugin:

```bash
docker --version
docker compose version
```

## 2) Подготовка проекта

В папке проекта:

```bash
cp .env.example .env
```

Отредактируйте `.env`:

- `POSTGRES_PASSWORD` — обязательно сложный пароль.
- `JWT_SECRET` — длинный случайный секрет (минимум 32+ символов).
- `CERTBOT_EMAIL` — ваш email.
- `CERTBOT_DOMAIN` — ваш домен (например `example.com`).

## 3) Первый запуск

```bash
docker compose up -d --build
```

Проверка статуса:

```bash
docker compose ps
```

## 4) Выпуск SSL сертификата (Let's Encrypt)

После того как домен уже смотрит на сервер:

```bash
docker compose run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d ${CERTBOT_DOMAIN} \
  --email ${CERTBOT_EMAIL} \
  --agree-tos --no-eff-email \
  --cert-name app
```

Перезапустите frontend для подхвата сертификата:

```bash
docker compose restart frontend
```

> До выпуска сертификата frontend использует временный self-signed сертификат, чтобы сервис не падал.

## 5) Проверка после деплоя

```bash
curl -I http://YOUR_DOMAIN
curl -I https://YOUR_DOMAIN
curl -I https://YOUR_DOMAIN/api/health
```

Если endpoint `/api/health` отсутствует в приложении — проверьте любой существующий API endpoint.

## 6) Рекомендации для VPS до 10 GB RAM

В `docker-compose.yml` уже добавлены разумные лимиты:

- postgres: `1g`
- backend: `768m`
- frontend: `256m`
- certbot: `128m`

Этого обычно достаточно для небольшого/среднего проекта и оставляет запас под ОС.

## 7) Обновление приложения

```bash
git pull
docker compose up -d --build
```

## 8) Резервные копии БД

Минимальный пример ручного бэкапа:

```bash
docker compose exec -T postgres pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup.sql
```

Восстановление:

```bash
cat backup.sql | docker compose exec -T postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB}
```

## Финальная структура инфраструктурных файлов

```text
/AppSport2
  .env.example
  docker-compose.yml
  /docs
    DOCKER_PRODUCTION.md
  /SportApp2
    Dockerfile
    .dockerignore
    /docker
      nginx.conf
      docker-entrypoint.sh
  /sport-app-backend
    Dockerfile
    .dockerignore
```
