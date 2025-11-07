# Playwright + TypeScript: Web UI + API

Framework with POM, wrappers, data fixtures (JSON/YAML/Excel), visual testing, network intercept/mocking, storage state auth, and HTML + Allure reports.

## Folder Map
- `src/
- `core/           # browser/HTTP/visual helpers, interceptors, logger
- `utils/          # env, JSON/YAML/Excel readers, data fixture
- `wrappers/       # page wrapper with retries/highlighting/screenshots
- `api/            # REST client, models, schema, services
- `pages/          # POMs + components
- `tests/          # web, api, mixed specs

## Environment
Copy `.env.example` to `.env` and set `API_TOKEN` for API tests. `DATA_SOURCE` controls test data source priority: excel > yaml > json > fixture.

## Scripts
- `npm run test:web` run Sauce Demo web tests.
- `npm run test:api` run GoREST API tests (needs `API_TOKEN`).
- `npm run report:open` open Playwright HTML.
- `npm run allure:generate` then `npm run allure:open`.
- `npm run visual:update` update baselines.

## Reporting
HTML report: `playwright-report/`.  
Allure: `allure-results/` → generate UI with `allure generate`.

## Data Sources
- JSON: `src/config/testdata.json`
- YAML: `src/config/testdata.yaml`
- Excel: generated at `src/config/excel/users.xlsx` on `npm ci` (see `tools/generate-excel.mjs`).

## Notes
- Storage state created in `global-setup.ts` with `standard_user`.
- Network demos:
  - **{Deprecated}Inject "Test Jacket"** by fulfilling `inventory.html`.
  - **Simulated 500 on add-to-cart** by routing `/mock/add-to-cart` and patching buttons to show a banner error. Pattern illustrates UI error handling.
- Visuals: see `src/tests/web/inventory.visual.spec.ts` and `cart-badge`.

## Troubleshooting
- If API tests skip: set `API_TOKEN` in `.env`.
- First visual run will create baselines; review diffs before `visual:update`.
- If Excel missing: `npm ci` regenerates it. Or run `node tools/generate-excel.mjs`.
- Playwright browsers: run `npx playwright install --with-deps` if missing.