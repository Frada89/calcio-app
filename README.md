# ⚽ Il Pallone — V3

App web completa con notizie, risultati live, calendario, classifiche, fantacalcio e radio sportive.

## ✨ Cosa c'è dentro

- 📰 **Notizie** — 14 fonti italiane (anche per Premier, Liga, Bundesliga, Ligue 1)
- ⚡ **Risultati live** — partite in corso con marcatori, ultimi risultati
- 📅 **Calendario** — prossime partite raggruppate per giornata di campionato
- 📊 **Classifica + Capocannonieri** — tabella completa con colorazione zone Champions/Europa/retrocessione, podio dei top scorer
- 🎮 **Fanta** — 8 link rapidi (probabili formazioni, voti, indisponibili) + feed notizie da SOS Fanta, FantaCalcio.it, FantaMaster, TMW Fanta
- 📻 **Radio** — player streaming integrato per Radio Sportiva, Rai Radio Sport, TMW Radio, Centro Suono Sport, Kiss Kiss Napoli, RMC Sport. La radio continua a suonare mentre navighi.

---

## 🚀 Aggiornare l'app già pubblicata

Se hai già il deploy su Vercel funzionante (versione precedente), basta sostituire i file su GitHub:

### Step 1 — Sostituisci i file su GitHub

1. Vai sul repository GitHub (es. `Frada89/calcio-app`)
2. **Cancella i file esistenti** uno per uno:
   - Apri ciascun file → icona cestino 🗑️ in alto → "Commit"
   - Ripeti per `package.json`, `src/app/page.js`, `src/app/api/...`, `src/lib/config.js`
   - Più semplice: cancella tutto e ricarica
3. **Carica i nuovi file**: estrai questo zip, apri la cartella estratta, seleziona TUTTO il contenuto (incluso `src`), trascinalo su GitHub, "Commit changes"

### Step 2 — Vercel ripubblica automaticamente

Vercel rileva il commit e fa un nuovo deploy in 1-2 minuti. Non devi fare nulla.

⚠️ **L'API key football-data.org rimane impostata** dalle volte precedenti. Non serve riaggiungerla.

---

## 🆕 Prima installazione (solo se è la prima volta)

### 1) Ottieni la API key football-data.org
- https://www.football-data.org/client/register
- Free Tier, conferma email, copia la API key dal profilo

### 2) Carica i file su GitHub
- Crea repository pubblico vuoto
- Trascina TUTTO il contenuto della cartella estratta (NON la cartella stessa)
- Commit changes

### 3) Deploy su Vercel
- New Project → importa il repository
- **Environment Variables**: `FOOTBALL_DATA_API_KEY` = la tua key
- Deploy

---

## 📻 Note sulla radio

Le radio italiane non sempre permettono lo streaming diretto da browser per limiti tecnici/legali (CORS, restrizioni HTTPS).

- ✅ **Quando lo stream funziona**: l'audio parte direttamente dall'app
- ⚠️ **Quando lo stream è bloccato**: l'app mostra un avviso giallo e ti propone di aprire il sito ufficiale della radio (dove c'è il loro player)

Le radio più affidabili sono **Radio Sportiva** e **Rai Radio Sport**. Se una non parte, prova le altre.

---

## 🐛 Problemi comuni

**Notizie Fanta vuote** → Alcuni feed possono essere temporaneamente offline. L'app mostra solo quelli funzionanti. Riprova dopo qualche minuto.

**Calendario vuoto** → Verifica di aver selezionato un campionato (non "Tutti").

**"Servizio non disponibile" su Risultati/Classifica/Calendario** → API key football-data.org mancante o errata. Vercel → Settings → Environment Variables.

**Radio non parte** → Tocca un'altra radio o apri direttamente il sito ufficiale (icona ↗).

---

## 📦 Struttura

```
calcio-app/
├── package.json
├── next.config.js, tailwind.config.js, postcss.config.js, jsconfig.json
├── src/
│   ├── lib/config.js               ← feed, leghe, squadre, radio, fanta
│   └── app/
│       ├── globals.css, layout.js, page.js
│       └── api/
│           ├── news/                ← notizie generali
│           ├── matches/             ← partite + calendario
│           ├── standings/           ← classifica
│           ├── scorers/             ← capocannonieri
│           └── fanta/               ← notizie fanta
```

---

## 🎯 Tab dell'app

1. **Notizie** — filtri per campionato e squadra, ricerca testuale
2. **Risultati** — live + ultime partite con marcatori
3. **Calendario** — prossime partite raggruppate per giornata
4. **Classifica** — tabella + capocannonieri sotto
5. **Fanta** — link rapidi + notizie fanta
6. **Radio** — 6 emittenti in streaming

Il **mini player radio** appare in basso quando hai una radio attiva e ti permette di metterla in pausa, regolare il volume, chiuderla — anche mentre navighi nelle altre tab.

---

✦ **Notizie**: Sky · Gazzetta · CDS · Tuttosport · ANSA · Calciomercato.com · TMW
✦ **Risultati & Tabelle**: Football-Data.org
✦ **Fanta**: SOS Fanta · Fantacalcio.it · FantaMaster · TMW Fanta
✦ **Radio**: Sportiva · RAI Sport · TMW Radio · Centro Suono Sport · Kiss Kiss Napoli · RMC Sport
