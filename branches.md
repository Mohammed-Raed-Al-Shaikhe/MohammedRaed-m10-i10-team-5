# Frontend lead — ملخّص الشغل

- **الـ Branch:** `frontend/nextjs-pages`
- **الدور:** Frontend lead (يملك الـ Next.js app + الـ browser-side contract)
- **الـ Reviewer للـ internal PR:** Backend lead (لأن أي تغيير على `web/lib/types.ts` لازم يطابق `api/models.py`)

## شو عملت بكل ملف

| الملف | الحالة | شو عملت |
|------|--------|---------|
| `web/lib/types.ts` | عُدّل (extend) | الـ response interfaces كانت موجودة ومطابقة لـ `api/models.py` حرف بحرف (`chunk_id` مش `chunkId` — احترمت snake_case). أضفت 3 request interfaces: `ExtractRequest`, `KGRequest`, `RAGRequest` تطابق الـ `*Request` Pydantic shapes، عشان نبعث typed fetch bodies. ما غيّرت أي اسم حقل. |
| `web/pages/extract.tsx` | عُدّل (extend) | الـ fetch body صار typed عبر `ExtractRequest`. الصفحة أصلاً بتعالج 422 / 503 / network وبترندر الـ entities بالـ types. |
| `web/pages/kg.tsx` | عُدّل (extend) | الـ fetch body صار typed عبر `KGRequest`. بتعالج 422 (مع `supported_patterns`) و 503 و network، وبترندر الـ rows. |
| `web/pages/rag.tsx` | عُدّل (extend) | الـ fetch body صار typed عبر `RAGRequest` (`question` + `k`). بترندر الجواب وعلامات الاقتباس بصيغة `[N]` (`data-testid="citation-marker"`) + الـ confidence. |
| `web/playwright.config.ts` | عُدّل | غيّرت `reuseExistingServer` من `!process.env.CI` إلى `true`. السبب: الـ autograder بيشغّل `npx playwright test ../tests/frontend/playwright` ضد حاوية `web` اللي شغّالة على :3000 من Compose؛ بالـ CI كانت القيمة `false` فبيحاول يطلّع `npm run dev` تاني على نفس البورت ويفشل بـ "port already used". |
| `tests/frontend/playwright/extract.spec.ts` | كُتب من جديد (كان stub) | smoke test: يفتح `/extract`، يدخل نص، يضغط الزر، يتأكّد من ظهور `entity-span`. |
| `tests/frontend/playwright/kg.spec.ts` | كُتب من جديد (كان stub) | smoke test: سؤال مزروع "Find Sichuan recipes" → يتأكّد من ظهور `kg-row`. |
| `tests/frontend/playwright/rag.spec.ts` | كُتب من جديد (كان stub) | smoke test: السؤال المزروع → يتأكّد من ظهور `rag-answer` + علامة اقتباس `[N]`. |

## ملفات أنشأتها / عدّلتها (للـ contribution summary)

- عُدّل: `web/lib/types.ts`
- عُدّل: `web/pages/extract.tsx`, `web/pages/kg.tsx`, `web/pages/rag.tsx`
- عُدّل: `web/playwright.config.ts`
- كُتب (كان `test.skip` stub): `tests/frontend/playwright/extract.spec.ts`, `kg.spec.ts`, `rag.spec.ts`
- أُنشئ: `branches.md`

> `web/Dockerfile` و `web/.dockerignore` تركتهم زي ما هم: الـ base image (`node:20-slim`) ونمط non-standalone مقصودين حسب التعليمات، والـ `.dockerignore` أصلاً بيستثني `node_modules` و `tests` فالصورة ما بتنتفخ. ما "صلّحتهم" يرجعوا لنمط الـ Lab.

## الـ contract — حقول الـ backend

- **ما في أي حقل افترضته أو محتاجه مش موجود.** كل الحقول اللي استعملتها موجودة فعلاً في `api/models.py`:
  - request: `text`, `question`, `k`
  - response: `entities[{text,label,start,end}]`, `cypher`, `rows`, `count`, `answer`, `citations[{chunk_id, score}]`, `confidence`, `reason`, `supported_patterns`
- **تنبيه للـ Backend lead:** أي rename لأي حقل (خصوصاً `chunk_id`) لازم ينعلن على الـ Slack channel وأحدّث `web/lib/types.ts` بنفس review cycle — وإلا الـ Playwright بالـ team-submission بيفشل صامت.

## للتحقق محلياً

```bash
# الـ structural gate لملفات الـ frontend
python3 -m pytest tests/test_playwright_specs.py tests/test_cross_boundary.py::test_openapi_contract_matches_ts -v

# الـ Playwright ضد الـ stack الشغّال (من داخل web/)
cd web && npx playwright test ../tests/frontend/playwright

# قيود مهمة:
# - NEXT_PUBLIC_API_URL = http://localhost:8000 (host-facing، مش http://api:8000)
#   لأن المتصفح ما بيقدر يحلّ اسم الخدمة داخل شبكة Compose.
```
