# Atomic Implementation Plan - Mappedin Shopping Mall

## Executive Summary
Current setup is correct per official Vite + TypeScript tutorial. ShoppingMallMap implementation failed because it made hardcoded assumptions about venue data structure. This plan rebuilds features atomically, adapting to actual venue data.

## Current State Audit

### ✅ WORKING CORRECTLY
- `index.html` - Matches official spec (div id: `mappedin-map`, 100vh height)
- `package.json` - Correct dependencies (@mappedin/mappedin-js v6.0.0)
- `vite.config.ts` - Minimal, correct (port 5173)
- `tsconfig.json` - Proper TypeScript setup
- `src/main.ts` - Uses correct `show3dMap` function, loads map successfully

### ❌ ISSUES
- ShoppingMallMap implementation assumed venue structure (entrances, washrooms, corridors) that demo map doesn't have
- Project contains bloat: ShoppingMallMap.js, InventoryService.js, webpack.config.js, style.css, unused .ts files
- Credentials valid but venue data incompatible with hardcoded logic

## Atomic Implementation Strategy

### Phase 1: Core Map (DONE ✅)
**Status:** Working
- Map loads and renders
- No assumptions about venue structure

### Phase 2: Dynamic Store Directory (ATOMIC)
**Goal:** List all spaces without filtering assumptions

**Implementation:**
```typescript
// Detect all spaces dynamically
const allSpaces = mapData.getByType('space');
const stores = allSpaces.filter(space => space.name); // Only filter out unnamed spaces

// No assumptions about washrooms, corridors, entrances
// Work with whatever exists
```

**Why atomic:** 
- Works with ANY venue data
- No hardcoded space names
- Adapts to actual structure

### Phase 3: Search (ATOMIC)
**Goal:** Search stores by name

**Implementation:**
```typescript
const searchStores = (query: string) => {
  return stores.filter(store =>
    store.name.toLowerCase().includes(query.toLowerCase())
  );
};
```

**Why atomic:**
- Works with any store names
- No category assumptions
- Pure string matching

### Phase 4: Store Selection & Focus (ATOMIC)
**Goal:** Click store, focus camera on it

**Implementation:**
```typescript
const selectStore = (store: any) => {
  mapView.Camera.focusOn(store, {
    zoom: 1000,
    tilt: 30,
    duration: 1000
  });
};
```

**Why atomic:**
- Works with any space
- No venue-specific logic
- Pure camera control

### Phase 5: Labels (ATOMIC)
**Goal:** Show store names on map

**Implementation:**
```typescript
mapView.Labels.labelAll({
  fontSize: 12,
  fontColor: '#2c3e50',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: 4,
  padding: 8
});
```

**Why atomic:**
- Works with all spaces
- No filtering needed
- Pure visual enhancement

### Phase 6: UI Panel (ATOMIC)
**Goal:** Sidebar with store list and search

**Implementation:**
- Create div with search input
- Populate with store list
- Add click handlers for selection
- Update on search

**Why atomic:**
- Pure DOM manipulation
- No venue assumptions
- Responsive to actual data

### Phase 7: Floor Indicator (ATOMIC)
**Goal:** Show current floor

**Implementation:**
```typescript
const floors = mapData.getByType('floor');
mapView.on('floor-change', (event) => {
  updateFloorDisplay(event.floor.name);
});
```

**Why atomic:**
- Works with any floor structure
- Event-driven
- No assumptions

## Implementation Order

1. **Keep Phase 1** (core map working)
2. **Add Phase 2** (dynamic store list)
3. **Add Phase 3** (search)
4. **Add Phase 4** (selection)
5. **Add Phase 5** (labels)
6. **Add Phase 6** (UI panel)
7. **Add Phase 7** (floor indicator)

Each phase is independent and testable.

## Code Structure

```
src/main.ts
├── Imports
├── Options (credentials)
├── State variables
├── init() - Phase 1
├── setupStores() - Phase 2
├── searchStores() - Phase 3
├── selectStore() - Phase 4
├── setupLabels() - Phase 5
├── setupUI() - Phase 6
├── setupFloorIndicator() - Phase 7
└── Event handlers
```

## Testing Strategy

After each phase:
1. Run `npm run dev`
2. Open http://localhost:5173
3. Verify feature works
4. Commit to git
5. Push to Vercel
6. Test on mobile

## Files to Remove

- `ShoppingMallMap.js` - React component, not needed
- `InventoryService.js` - Unused
- `webpack.config.js` - Vite doesn't use it
- `style.css` - Styles in index.html
- `defaultThings.ts` - Unused
- `products.json` - Unused
- `product-finding.zip` - Unused
- `run.sh` - Unused
- `db.json` - Unused
- `thumbnail.png` - Unused
- `MAPPEDIN_*.md` - Documentation clutter
- `REBUILD_PLAN.md` - Old plan

## Success Criteria

✅ Map loads on mobile
✅ Store list displays
✅ Search works
✅ Click store to focus
✅ Labels show store names
✅ Floor indicator updates
✅ No console errors
✅ Responsive on mobile

## Rollback Plan

If any phase breaks:
```bash
git revert <commit-hash>
git push
```

Current working commit: `775aaea` (basic map only)

## Notes

- Do NOT assume venue structure
- Do NOT hardcode space names
- Do NOT filter without reason
- DO work with actual data
- DO test each phase independently
- DO commit after each phase
