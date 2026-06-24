# Team Roster — Module 10 Integration

- **Team name:** team-5
- **Team Slack channel:** #team5channel
- **Team-formation date:** 2026-06-22
- **Designated team submitter:** Backend lead

---

## Team Roster

| Role                   | Team Member identifier | Assigned by        | Branch                  | Internal-PR reviewer | Primary files owned                                                                                           |
| ---------------------- | ---------------------- | ------------------ | ----------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Backend lead           | Mohammed               | Instructional team | `backend/api-endpoints` | Frontend lead        | `api/main.py`, `api/models.py`, `api/rag.py`, `api/deps.py`, `api/Dockerfile`                                 |
| Frontend lead          | Momen                  | Instructional team | `frontend/nextjs-pages` | Backend lead         | `web/pages/{extract,kg,rag}.tsx`, `web/lib/types.ts`, `web/Dockerfile`, `tests/frontend/playwright/*`         |
| Infra-Integration lead | Rand                   | Instructional team | `infra/docker-compose`  | Backend lead         | `docker-compose.yml`, `seed_neo4j.sh`, `seed_weaviate.sh`, `.env.example`, `README.md`, `tests/integration/*` |

---

## Per-Role File Checklist

### Backend lead

- [x] `api/main.py` — path operations, `lifespan`, CORS middleware
- [x] `api/models.py` — Pydantic shapes
- [x] `api/rag.py` — RAG composer with grounding contract
- [x] `api/deps.py` — `Depends()` functions
- [x] `api/Dockerfile` — single-stage Python

### Frontend lead

- [x] `web/pages/extract.tsx`
- [x] `web/pages/kg.tsx`
- [x] `web/pages/rag.tsx`
- [x] `web/lib/types.ts`
- [x] `web/Dockerfile`
- [x] `tests/frontend/playwright/*.spec.ts`

### Infra-Integration lead

- [x] `docker-compose.yml` — four services, healthchecks, `depends_on` chain, named volumes
- [x] `seed_neo4j.sh`
- [x] `seed_weaviate.sh`
- [x] `.env.example`
- [x] `README.md` runbook
- [x] `tests/integration/test_stack_e2e.py`

---

## Escalation Checklist (apply in order)

When a disagreement about scope, role boundaries, or contract changes arises:

1. **Inline comment on the internal PR.** State the disagreement specifically and link the contract artifact (Pydantic shape, TypeScript interface, Compose service entry).
2. **Team Slack channel with TA tagged.** Tag the TA who covers the team. Allow up to 4 working hours for response.
3. **Support Instructor.** If the TA decision is contested or the TA is unavailable, escalate to the Support Instructor via the cohort Slack channel.
4. **Lead Instructor.** Only if a role-rebalancing decision is needed or the disagreement is not resolved by the Support Instructor.

Document the escalation path taken in the team submission PR description.

---

## Contract-Change Protocol

- **Backend lead** announces any Pydantic shape change on the team Slack channel **before** the change lands.
- **Frontend lead** requests new backend fields via an internal-PR comment on the Backend lead's branch — does not assume.
- **Infra-Integration lead** announces any `.env` or DNS-affecting change before the change lands.

The protocol is enforced by the internal-PR review — the reviewer rejects PRs where the contract change was not announced.

---

## Submission

When all three role branches merge to the team fork's `main` and `docker compose up -d` smoke passes locally for each Team Member:

1. The team submitter pastes the team fork URL into TalentLMS → Module 10 → Integration Task.
2. Each Team Member separately submits the participation-confirmation TalentLMS unit naming their assigned role and the files they authored.
