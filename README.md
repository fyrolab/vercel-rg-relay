# Telegram API Relay

Прокси-релей для Telegram Bot API через Vercel. Решает проблему блокировки `api.telegram.org` в РФ.

## Использование

Замени `api.telegram.org` на `relay.klsnv.ru/tg` в запросах:

```
# Было
https://api.telegram.org/bot<TOKEN>/sendMessage

# Стало
https://relay.klsnv.ru/tg/bot<TOKEN>/sendMessage
```

Поддерживаются все методы Telegram Bot API — GET, POST, любой формат body (JSON, form-data).

## Пример: отправка сообщения

```bash
curl -X POST "https://relay.klsnv.ru/tg/bot<TOKEN>/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "123456789", "text": "Привет!"}'
```

## Пример: JavaScript (fetch)

```javascript
await fetch("https://relay.klsnv.ru/tg/bot<TOKEN>/sendMessage", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: "123456789",
    text: "Новая заявка с сайта!"
  })
});
```

## Деплой своего инстанса

1. Форкни репо
2. Импортируй в [Vercel](https://vercel.com/new)
3. Deploy (настройки по умолчанию)
4. Привяжи свой домен в Settings → Domains
5. Настрой DNS: CNAME → `cname.vercel-dns.com`
