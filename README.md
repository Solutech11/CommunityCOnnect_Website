# Community Connect website

React Router's Vite powered, server rendered React and TypeScript website for Community Connect. Visitors can discover public events, create an account, buy event tickets, view verified QR tickets, and ask Community AI about events and the app. Community creation, social chat, wallet tools, and event hosting remain mobile app features.

## Local development

```powershell
yarn install
yarn dev
```

The website runs at `http://localhost:5173`. Start the sibling `Community_Connect_Api` backend on port 5000. The site expects the backend additions in this workspace: `GET /events/discover`, `POST /ai/guest-chat`, and web ticket checkout callbacks. The current database can have no events; the site shows real empty states.

Copy `.env.example` to `.env` if you need to override the API URL or supply an Android APK URL. `VITE_*` values are public browser configuration: never put credentials or server secrets there.

```powershell
yarn typecheck
yarn build
yarn start
```

The production build requires a Node capable host for server rendering. Set `VITE_API_URL` to the public backend URL at build time. Set the backend's `WEB_BASE_URL` to this website's exact production origin, such as `https://example.com`. That origin is added to the backend CORS allowlist and is used for Paystack's `/checkout/return/:orderNumber` callback. Configure the backend's Paystack and email settings there. No production host or live APK URL is configured yet.

## Content and assets

- `app/data/features.ts` is the single catalog for app feature copy and web versus mobile availability. Update it whenever a new mobile feature or major correction ships, as required by the mobile app's `AGENTS.md`.
- Real app screenshots for Home, Events, Ticket/QR, Community, Chat, and AI can replace the current app preview once supplied.
- Event images come from event API records. Editorial fallback photos are served from [Unsplash](https://unsplash.com/license).
- The bundled Nigeria state boundaries in `app/data/nigeria-states.json` come from [geoBoundaries, Nigeria ADM1](https://www.geoboundaries.org/api/current/gbOpen/NGA/ADM1/) (GRID3, CC BY 4.0). Browser coordinates stay on the device while the selected state is resolved. Manual state selection and a Lagos fallback are always available.

## Product references

[Partiful Explore](https://partiful.com/explore) · [Fever](https://feverup.com/en) · [Luma Discover](https://luma.com/discover) · [Resident Advisor](https://ra.co/events) · [DICE](https://dice.fm/) · [Shotgun](https://r.shotgun.live/) · [Eventbrite](https://www.eventbrite.com/) · [Bandsintown](https://www.bandsintown.com/) · [Time Out](https://www.timeout.com/) · [Tomorrowland](https://www.tomorrowland.com/)
