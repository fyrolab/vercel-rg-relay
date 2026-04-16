# Telegram API Relay через Vercel

## Проблема

`api.telegram.org` недоступен из РФ из-за блокировки Cloudflare. Нужен прокси-релей через Vercel для пробрасывания запросов к Telegram Bot API.

## Решение

Vercel Serverless Function — catch-all прокси. Принимает любой запрос, проксирует в `api.telegram.org`, возвращает ответ.

## URL-схема

Клиент заменяет `api.telegram.org` на `relay.klsnv.ru/tg`:

```
api.telegram.org/bot<token>/sendMessage
→
relay.klsnv.ru/tg/bot<token>/sendMessage
```

## Архитектура

```
Client → relay.klsnv.ru/tg/bot.../method
       → Vercel rewrite: /tg/* → /api/tg/*
       → Serverless Function: proxy to api.telegram.org
       → Telegram API
       ← response back to client
```

## Структура проекта

```
vercel-rg-relay/
├── api/
│   └── tg/
│       └── [...path].ts      # catch-all proxy function
├── vercel.json                # rewrites + config
├── package.json
└── tsconfig.json
```

## Компоненты

### `api/tg/[...path].ts`

Serverless function:
- Извлекает path из `req.query.path` (массив сегментов)
- Собирает URL: `https://api.telegram.org/${path.join('/')}`
- Пробрасывает query string из оригинального запроса
- Проксирует method, body, content-type
- Добавляет CORS-заголовки (`Access-Control-Allow-Origin: *`)
- Обрабатывает OPTIONS preflight
- Возвращает status code и body от Telegram

### `vercel.json`

- Rewrite: `/tg/:path*` → `/api/tg/:path*`
- Домен `relay.klsnv.ru` привязывается через Vercel Dashboard

## Доступ

Открытый прокси, без авторизации. Кто знает URL — тот и пользуется. Безопасность обеспечивается секретностью bot token в URL.

## Ограничения

- Vercel Hobby: 100GB bandwidth/month, 10s function timeout — более чем достаточно для Telegram API
- Cold start ~100-200ms — некритично для бот-запросов
