# Kombi Dispečer

UI/UX prototip aplikacije za organizaciju kombi prevoza i rad dispečera.

## Trenutna verzija

Aktuelni V7 prototip objedinjuje:

- početni dispečerski dashboard
- ture i popunjenost vozila
- prijave putnika sa sajta
- putnike i pakete
- vozila, servis i dokumente
- operativni pregled naplate
- vozački prikaz
- javnu prijavu putnika
- klikabilne KPI/status kartice koje vode direktno do relevantnog ekrana
- navigaciju **Nazad** kroz prethodno posećene ekrane
- responzivan desktop i mobilni prikaz

## Live preview

https://kombi-dispecer-v7-qyk0cc.v2.appdeploy.ai/

## Lokalno pokretanje

```bash
npm install
npm run dev
```

Za production build:

```bash
npm run build
npm run preview
```

## Struktura

- `index.html` — glavni UI
- `src/main.ts` — interakcije i logika prototipa
- `src/styles.css` — glavni stilovi
- `src/navigation.css` — stilovi navigacije i dugmeta Nazad
- `tests/tests.txt` — opis ključnih UX tokova
- `legacy-prototypes/` — ranije verzije i prototipovi

> Trenutno je ovo frontend prototip. Podaci nisu povezani sa produkcionom bazom, autentikacijom, SMS/Viber servisom ili pravim sistemom naplate.
