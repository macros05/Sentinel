# Sentinel Watcher - Chrome Extension 🌲

Extensión de Chrome que monitorea el uso de apps distractoras y reporta al servidor de Sentinel.

## Instalación (modo desarrollo)

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el **Modo desarrollador** (esquina superior derecha)
3. Haz clic en **"Cargar descomprimida"**
4. Selecciona esta carpeta (`sentinel-extension`)
5. La extensión aparecerá en la barra de Chrome

## Uso

1. Haz clic en el icono 🌲 en la barra de Chrome
2. Inicia sesión con tu cuenta de Sentinel
3. Pulsa **"Activar Watcher"**
4. La extensión monitorea las pestañas activas cada 5 segundos
5. El consumo se refleja en tiempo real en el dashboard de Sentinel

## Apps soportadas

La extensión detecta estas apps por dominio:

| App | Dominio |
|-----|---------|
| Spotify | open.spotify.com |
| YouTube | youtube.com |
| WhatsApp | web.whatsapp.com |
| Twitter/X | twitter.com, x.com |
| Instagram | instagram.com |
| Facebook | facebook.com |
| TikTok | tiktok.com |
| Reddit | reddit.com |
| Netflix | netflix.com |
| Twitch | twitch.tv |
| Discord | discord.com |
| Telegram | web.telegram.org |

## Añadir más apps

Edita el objeto `APP_DOMAIN_MAP` en `background.js` para añadir nuevos dominios.

## Nota

Para producción, reemplaza `http://REDACTED:8081` por tu dominio en `background.js` y `popup.js`.
