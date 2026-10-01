# Ale — l'agent équitation (Google ADK)

**Ale** est une licorne mascotte, agent autonome construit avec [Google ADK](https://google.github.io/adk-docs/) et exposé via FastAPI, avec une UI React.

- **Rations adaptées aux pathologies** : PSSM1, coliques à répétition, SME, Cushing, ulcères, asthme, fourbure, HYPP, problèmes dentaires. Les contraintes se combinent (le plafond d'amidon le plus strict gagne, un aliment évité par une pathologie n'est jamais conseillé par une autre, les conflits sont signalés).
- **Fiches chevaux** : poids et historique, note d'état corporel, travail, pathologies, carnet de santé (vaccins, vermifuges, maréchal, dentiste, véto, ostéo), séances, et soins à prévoir calculés.
- **Mémoire long terme** : conversations et faits explicites (`remember`) persistés en SQLite et réinjectés automatiquement (`PreloadMemoryTool`).
- **Réveil autonome par localisation** : à l'arrivée à l'écurie, Ale prend la parole, propose les soins du jour, rappelle la ration et demande si la séance a été faite.
- **Mascotte expressive** : chaque réponse porte une humeur (`[mood:x]`), et l'UI anime le visage (synchro labiale, clignements).

## Architecture (hexagonale)

```
equine/                 # domaine pur, aucune dépendance ADK ni SQL
  models.py             # modèles pydantic (Horse, HealthEntry, Workout, Place...)
  conditions.py         # catalogue des pathologies et de leurs contraintes
  nutrition.py          # moteur de ration
  care.py               # échéances des soins
  geofence.py           # lieux connus + règle de réveil (arrivée, anti-rebond 3 h)
  briefing.py           # fiche complète / briefing écurie
  ports.py              # port DocumentStoreI
  adapters/             # SqliteDocumentStore (réel) + MockDocumentStore (tests)
  stable.py             # dépôts typés au-dessus du port
  container.py          # new_stable() / new_test_stable()
agents/ale/
  agent.py              # root_agent (convention ADK)
  instruction.py        # prompt système dynamique (date, chevaux de l'utilisatrice)
  protocol.py           # balises d'humeur + marqueur de réveil
  tools/                # 15 outils : chevaux, santé, séances, rations, constantes, mémoire
app/
  runtime.py            # Runner + DatabaseSessionService + SqliteMemoryService
  memory_service.py     # BaseMemoryService ADK persistant (SQLite)
  conversation.py       # un tour d'agent, historique
  wakeup.py             # réveil par position
  routes/               # chat, horses, places
web/                    # UI React + TypeScript + Tailwind (DA Sway)
assets-src/mascot/      # sources PNG de la mascotte (non servies)
```

## Installation

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env   # puis renseigner GOOGLE_API_KEY
```

Les données (sessions, mémoire, chevaux, lieux) sont dans `data/` (configurable via `ALE_DATA_DIR`).

## Lancer

```bash
.venv/bin/uvicorn app.main:app --reload     # API : http://localhost:8000/docs
cd web && npm install --ignore-scripts && npm run dev   # UI : http://localhost:5173
```

La géolocalisation et les notifications du navigateur exigent HTTPS ou `localhost` : sur téléphone, passer par un tunnel HTTPS. Le bouton « Simuler mon arrivée » de l'onglet Lieux déclenche le réveil sans bouger.

| Endpoint | Description |
|---|---|
| `POST /chat` | Message → réponse, humeur, outils appelés |
| `GET /sessions/{user_id}/{session_id}` | Historique (sans les messages de réveil) |
| `GET /conditions` | Pathologies gérées |
| `GET/POST /horses`, `GET/PUT/DELETE /horses/{id}` | Fiches chevaux (le détail inclut ration et soins à prévoir) |
| `POST /horses/{id}/health`, `/weights`, `/workouts` | Carnet de santé, pesées, séances |
| `GET/POST/DELETE /places` | Lieux connus |
| `POST /presence` | Position GPS → réveil d'Ale à l'arrivée dans un lieu |
| `POST /wakeup` | Réveil forcé pour un lieu |

## Interface de dev ADK

```bash
cp .env agents/ale/.env
PYTHONPATH=. .venv/bin/adk web agents   # la racine doit être importable (package equine)
```

## Tests

```bash
.venv/bin/pytest            # backend : domaine, outils, mémoire, API avec un faux LLM
cd web && npm run coverage  # frontend : 100 % de couverture des composants
```

## Limites

- Pas d'authentification : l'identifiant utilisateur est généré et gardé dans le navigateur.
- Les rations sont des ordres de grandeur issus des recommandations de nutrition équine, pas un avis vétérinaire.
