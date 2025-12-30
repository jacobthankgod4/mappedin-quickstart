# Mappedin Project Rebuild - Atomic Expert Implementation Plan

## Overview
Rebuild the entire project following the official Vite + TypeScript tutorial for Mappedin Web SDK v6.

## Phase 1: Clean Setup (Steps 1-3)
1. Delete all React/CRA files and configs
2. Create Vite config files (vite.config.ts, tsconfig.json)
3. Update package.json to Vite + TypeScript + SDK v6

## Phase 2: Core Files (Steps 4-6)
4. Create root index.html with mappedin-map div
5. Create src/main.ts with getMapData/show3DMap
6. Create src/vite-env.d.ts for TypeScript

## Phase 3: Cleanup (Steps 7-8)
7. Delete src/ React files (App.tsx, index.jsx, ShoppingMallMap.js, etc.)
8. Delete public/ folder (Vite uses root index.html)

## Phase 4: Verification (Step 9)
9. Verify structure matches official tutorial exactly

## Files to Delete
- src/App.tsx
- src/App.js
- src/index.jsx
- src/index.js
- src/index.ts
- src/ShoppingMallMap.js
- src/Diagnostic.js
- src/GroceryInventoryAdapter.js
- src/LocationMappingService.js
- src/EnterpriseConfigService.js
- public/ folder
- .env
- .env.production
- tsconfig.json (old)

## Files to Create
- vite.config.ts
- tsconfig.json (new)
- src/vite-env.d.ts
- src/main.ts
- index.html (root)

## Files to Modify
- package.json

## Expected Final Structure
```
mappedin-quickstart/
├── index.html
├── src/
│   ├── main.ts
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── node_modules/
```

## Success Criteria
- `npm run dev` starts Vite dev server on http://localhost:5173
- Map renders with getMapData/show3DMap functions
- No React dependencies
- TypeScript compiles without errors
