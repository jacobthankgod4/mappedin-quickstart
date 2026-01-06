# MOBILE UI REDESIGN SPECIFICATION
## Atomic Implementation Plan

---

## EXECUTIVE SUMMARY

**Objective:** Transform current bottom sheet UI to fixed top bar + bottom tab bar layout  
**Constraint:** Zero functionality loss  
**Strategy:** Incremental migration with feature toggle  
**Estimated Effort:** 12-16 hours

---

## CURRENT STATE ANALYSIS

### Layout Structure
```
┌─────────────────────┐
│                     │
│                     │
│        MAP          │
│     (Full Screen)   │
│                     │
├─────────────────────┤
│   BOTTOM SHEET      │
│   (Draggable)       │
│   - Search Bar      │
│   - Category Pills  │
│   - Store Cards     │
│   - Store List      │
└─────────────────────┘
```

### Key Components
1. **Bottom Sheet** (`#bottomSheet`)
   - Height: 20vh-85vh (draggable)
   - Contains: Search, categories, cards, list
   - File: `main.ts` lines 800-1100

2. **Search Bar** (`#searchInput`)
   - Location: Inside bottom sheet
   - Function: Live filter stores
   - File: `main.ts` lines 850-900

3. **Category Pills** (`#categoryPills`)
   - Location: Inside bottom sheet
   - Function: Filter by category
   - File: `main.ts` lines 1150-1200

4. **Store Cards** (`#storeCardsRow`)
   - Location: Inside bottom sheet
   - Function: Featured stores
   - File: `main.ts` lines 1200-1250

5. **Store List** (`#sheetContent`)
   - Location: Inside bottom sheet
   - Function: All stores scrollable
   - File: `main.ts` lines 950-1050

---

## TARGET STATE DESIGN

### New Layout Structure
```
┌─────────────────────┐
│   TOP BAR (56px)    │
│   - Search          │
│   - Menu            │
├─────────────────────┤
│                     │
│        MAP          │
│   (Full Screen)     │
│                     │
├─────────────────────┤
│  BOTTOM TABS (80px) │
│  6 Category Icons   │
└─────────────────────┘
```

### New Components

#### 1. Top Bar
```typescript
<div id="topBar" style="
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  padding: 0 16px;
">
  <input id="topSearchInput" placeholder="Search" style="
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #dadce0;
    border-radius: 24px;
    font-size: 14px;
  " />
  <button id="menuBtn" style="
    margin-left: 12px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  ">☰</button>
</div>
```

#### 2. Bottom Tab Bar
```typescript
<div id="bottomTabBar" style="
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: white;
  z-index: 1000;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
">
  <button data-category="facility" style="
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    cursor: pointer;
  ">
    <div style="
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: #17a2b8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    ">🚶</div>
    <span style="font-size: 10px;">Facility</span>
  </button>
  <!-- Repeat for 5 more categories -->
</div>
```

#### 3. Store Detail Card (Overlay)
```typescript
<div id="storeDetailCard" style="
  position: fixed;
  bottom: 80px;
  left: 16px;
  right: 16px;
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
  z-index: 999;
  max-height: 60vh;
  overflow-y: auto;
  display: none;
">
  <!-- Store detail content -->
</div>
```

---

## ATOMIC IMPLEMENTATION STEPS

### PHASE 1: ADD NEW UI (Non-Breaking)

#### Step 1.1: Add UI Mode State
**File:** `main.ts` line 48  
**Action:** Add after `let floors: any[] = [];`
```typescript
let uiMode: 'legacy' | 'new' = 'legacy';
```

#### Step 1.2: Create Top Bar HTML
**File:** `main.ts` line 800 (before `setupMobileUI()`)  
**Action:** Add new function
```typescript
function createTopBar() {
  const topBar = document.createElement('div');
  topBar.id = 'topBar';
  topBar.style.cssText = 'position:fixed;top:0;left:0;right:0;height:56px;background:white;z-index:1000;box-shadow:0 2px 4px rgba(0,0,0,0.1);display:none;';
  topBar.innerHTML = `
    <input id="topSearchInput" placeholder="Search" style="flex:1;padding:8px 12px;border:1px solid #dadce0;border-radius:24px;font-size:14px;" />
    <button id="menuBtn" style="margin-left:12px;background:none;border:none;font-size:24px;cursor:pointer;">☰</button>
  `;
  document.body.appendChild(topBar);
}
```

#### Step 1.3: Create Bottom Tab Bar HTML
**File:** `main.ts` line 820  
**Action:** Add new function
```typescript
function createBottomTabBar() {
  const tabBar = document.createElement('div');
  tabBar.id = 'bottomTabBar';
  tabBar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:80px;background:white;z-index:1000;box-shadow:0 -2px 4px rgba(0,0,0,0.1);display:none;';
  tabBar.innerHTML = `
    <button data-category="facility">🚶 Facility</button>
    <button data-category="food">🍴 Food</button>
    <button data-category="leisure">🎫 Leisure</button>
    <button data-category="shops">🛍️ Shops</button>
    <button data-category="promos">% Promos</button>
    <button data-category="events">📅 Events</button>
  `;
  document.body.appendChild(tabBar);
}
```

#### Step 1.4: Create Store Detail Card HTML
**File:** `main.ts` line 840  
**Action:** Add new function
```typescript
function createStoreDetailCard() {
  const card = document.createElement('div');
  card.id = 'storeDetailCard';
  card.style.cssText = 'position:fixed;bottom:80px;left:16px;right:16px;background:white;border-radius:16px 16px 0 0;padding:20px;box-shadow:0 -4px 12px rgba(0,0,0,0.15);z-index:999;display:none;';
  document.body.appendChild(card);
}
```

#### Step 1.5: Call Creation Functions
**File:** `main.ts` line 75 (in `init()` function)  
**Action:** Add before `if (isDesktop())`
```typescript
if (!isDesktop()) {
  createTopBar();
  createBottomTabBar();
  createStoreDetailCard();
}
```

---

### PHASE 2: ADD TOGGLE MECHANISM

#### Step 2.1: Create Toggle Button
**File:** `main.ts` line 860  
**Action:** Add new function
```typescript
function createUIToggle() {
  const toggle = document.createElement('button');
  toggle.id = 'uiToggle';
  toggle.textContent = 'Switch UI';
  toggle.style.cssText = 'position:fixed;top:70px;right:16px;z-index:10001;padding:8px 16px;background:#1a73e8;color:white;border:none;border-radius:20px;cursor:pointer;';
  toggle.addEventListener('click', toggleUIMode);
  document.body.appendChild(toggle);
}
```

#### Step 2.2: Create Toggle Function
**File:** `main.ts` line 875  
**Action:** Add new function
```typescript
function toggleUIMode() {
  uiMode = uiMode === 'legacy' ? 'new' : 'legacy';
  
  if (uiMode === 'new') {
    // Hide legacy UI
    document.getElementById('bottomSheet')!.style.display = 'none';
    // Show new UI
    document.getElementById('topBar')!.style.display = 'flex';
    document.getElementById('bottomTabBar')!.style.display = 'flex';
  } else {
    // Show legacy UI
    document.getElementById('bottomSheet')!.style.display = 'block';
    // Hide new UI
    document.getElementById('topBar')!.style.display = 'none';
    document.getElementById('bottomTabBar')!.style.display = 'none';
    document.getElementById('storeDetailCard')!.style.display = 'none';
  }
}
```

#### Step 2.3: Add Toggle to Init
**File:** `main.ts` line 78 (in `init()` function)  
**Action:** Add after new UI creation
```typescript
if (!isDesktop()) {
  createUIToggle();
}
```

---

### PHASE 3: WIRE NEW UI FUNCTIONALITY

#### Step 3.1: Wire Top Search Bar
**File:** `main.ts` line 900  
**Action:** Add new function
```typescript
function wireTopSearch() {
  const input = document.getElementById('topSearchInput') as HTMLInputElement;
  input.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    if (query.trim()) {
      searchResults = stores.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase())
      );
      showStoreListOverlay();
    }
  });
}
```

#### Step 3.2: Wire Bottom Tabs
**File:** `main.ts` line 915  
**Action:** Add new function
```typescript
function wireBottomTabs() {
  const tabs = document.querySelectorAll('#bottomTabBar button');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category')!;
      activeCategory = category;
      
      if (category === 'all') {
        searchResults = stores;
      } else {
        searchResults = stores.filter(s => 
          s.categories?.some((c: any) => c.name === category)
        );
      }
      
      showStoreListOverlay();
    });
  });
}
```

#### Step 3.3: Show Store List Overlay
**File:** `main.ts` line 935  
**Action:** Add new function
```typescript
function showStoreListOverlay() {
  const card = document.getElementById('storeDetailCard')!;
  card.style.display = 'block';
  card.innerHTML = searchResults.map(store => `
    <div class="store-item" data-id="${store.id}" style="
      padding: 12px;
      border-bottom: 1px solid #e8eaed;
      cursor: pointer;
    ">
      <div style="font-weight: 500;">${store.name}</div>
      <div style="font-size: 12px; color: #5f6368;">${store.floor?.name || 'Floor G'}</div>
    </div>
  `).join('');
  
  card.querySelectorAll('.store-item').forEach(item => {
    item.addEventListener('click', () => {
      const storeId = item.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) showStoreDetailInCard(store);
    });
  });
}
```

#### Step 3.4: Show Store Detail in Card
**File:** `main.ts` line 960  
**Action:** Add new function
```typescript
function showStoreDetailInCard(store: any) {
  const card = document.getElementById('storeDetailCard')!;
  card.innerHTML = `
    <button onclick="closeStoreDetail()" style="
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    ">×</button>
    <h2>${store.name}</h2>
    <p>${store.floor?.name || 'Floor G'}</p>
    <button onclick="showDirectionsInNewUI('${store.id}')" class="btn-primary">
      Directions
    </button>
  `;
  
  // Highlight on map
  selectStore(store);
}
```

#### Step 3.5: Wire Functions to Init
**File:** `main.ts` line 80 (in `init()` function)  
**Action:** Add after toggle creation
```typescript
if (!isDesktop()) {
  wireTopSearch();
  wireBottomTabs();
}
```

---

### PHASE 4: NAVIGATION IN NEW UI

#### Step 4.1: Show Directions in New UI
**File:** `main.ts` line 985  
**Action:** Add new function
```typescript
function showDirectionsInNewUI(storeId: string) {
  const store = stores.find(s => s.id === storeId);
  if (!store) return;
  
  const card = document.getElementById('storeDetailCard')!;
  card.innerHTML = `
    <h3>Directions to ${store.name}</h3>
    <div style="margin: 16px 0;">
      <label>FROM</label>
      <select id="fromSelect">
        ${stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select>
    </div>
    <div style="margin: 16px 0;">
      <label>TO</label>
      <input value="${store.name}" readonly />
    </div>
    <button id="startNavNewUI" class="btn-primary">Start</button>
  `;
  
  document.getElementById('startNavNewUI')!.addEventListener('click', () => {
    const fromId = (document.getElementById('fromSelect') as HTMLSelectElement).value;
    navStartPoint = stores.find(s => s.id === fromId);
    navEndPoint = store;
    startNavigationInNewUI();
  });
}
```

#### Step 4.2: Start Navigation in New UI
**File:** `main.ts` line 1015  
**Action:** Add new function
```typescript
async function startNavigationInNewUI() {
  if (!navStartPoint || !navEndPoint) return;
  
  const directions = await mapView.getDirections(navStartPoint, navEndPoint);
  if (!directions) return;
  
  activeDirections = directions;
  await mapView.Navigation.draw(directions, {
    pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5 },
    markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' }
  });
  
  showActiveNavigationInNewUI();
}
```

#### Step 4.3: Show Active Navigation
**File:** `main.ts` line 1035  
**Action:** Add new function
```typescript
function showActiveNavigationInNewUI() {
  const card = document.getElementById('storeDetailCard')!;
  const inst = activeDirections.instructions[currentInstructionIndex];
  
  card.innerHTML = `
    <div style="background: #e8f0fe; padding: 16px; border-radius: 8px;">
      <div>Step ${currentInstructionIndex + 1} of ${activeDirections.instructions.length}</div>
      <div style="font-weight: 500; margin: 8px 0;">
        ${inst.action.type === 'Departure' ? 'Start walking' : 'Continue'}
      </div>
    </div>
    <div style="display: flex; gap: 8px; margin-top: 12px;">
      <button onclick="prevInstructionNewUI()" class="btn-secondary" style="flex: 1;">Previous</button>
      <button onclick="nextInstructionNewUI()" class="btn-primary" style="flex: 1;">Next</button>
    </div>
    <button onclick="endNavigationNewUI()" class="btn-secondary" style="margin-top: 8px;">End Route</button>
  `;
}
```

---

### PHASE 5: HELPER FUNCTIONS

#### Step 5.1: Close Store Detail
**File:** `main.ts` line 1060  
**Action:** Add new function
```typescript
function closeStoreDetail() {
  document.getElementById('storeDetailCard')!.style.display = 'none';
  if (selectedPolygon) {
    mapView.updateState(selectedPolygon, { color: 'initial' });
    selectedPolygon = null;
  }
  selectedStore = null;
}
```

#### Step 5.2: Navigation Controls
**File:** `main.ts` line 1070  
**Action:** Add new functions
```typescript
function prevInstructionNewUI() {
  if (currentInstructionIndex > 0) {
    currentInstructionIndex--;
    showActiveNavigationInNewUI();
  }
}

function nextInstructionNewUI() {
  if (currentInstructionIndex < activeDirections.instructions.length - 1) {
    currentInstructionIndex++;
    showActiveNavigationInNewUI();
  } else {
    showArrivalScreenNewUI();
  }
}

function showArrivalScreenNewUI() {
  const card = document.getElementById('storeDetailCard')!;
  card.innerHTML = `
    <div style="text-align: center; padding: 32px;">
      <div style="font-size: 48px;">🎯</div>
      <h2>You've Arrived!</h2>
      <p>${navEndPoint.name}</p>
      <button onclick="endNavigationNewUI()" class="btn-primary">Done</button>
    </div>
  `;
}

function endNavigationNewUI() {
  mapView.Navigation.clear();
  activeDirections = null;
  currentInstructionIndex = 0;
  navStartPoint = null;
  navEndPoint = null;
  closeStoreDetail();
}
```

#### Step 5.3: Expose to Window
**File:** `main.ts` line 1110  
**Action:** Add after existing window exports
```typescript
(window as any).closeStoreDetail = closeStoreDetail;
(window as any).showDirectionsInNewUI = showDirectionsInNewUI;
(window as any).prevInstructionNewUI = prevInstructionNewUI;
(window as any).nextInstructionNewUI = nextInstructionNewUI;
(window as any).endNavigationNewUI = endNavigationNewUI;
```

---

## FUNCTIONALITY MAPPING

| Feature | Legacy Location | New Location | Function Reuse |
|---------|----------------|--------------|----------------|
| Search | Bottom sheet | Top bar | ✅ Same filter logic |
| Categories | Bottom sheet pills | Bottom tabs | ✅ Same filter logic |
| Store list | Sheet content | Detail card overlay | ✅ Same rendering |
| Store detail | Sheet expansion | Detail card | ✅ Same data |
| Directions | Sheet replacement | Detail card | ✅ Same navigation |
| Active nav | Sheet content | Detail card | ✅ Same instructions |

---

## TESTING CHECKLIST

### Phase 1 Tests
- [ ] New UI elements created but hidden
- [ ] Legacy UI still works
- [ ] No console errors

### Phase 2 Tests
- [ ] Toggle button appears
- [ ] Toggle switches between UIs
- [ ] Both UIs functional

### Phase 3 Tests
- [ ] Top search filters stores
- [ ] Bottom tabs filter by category
- [ ] Store list shows in card
- [ ] Store detail shows in card

### Phase 4 Tests
- [ ] Directions planning works
- [ ] Route draws on map
- [ ] Active navigation shows steps
- [ ] Next/Previous buttons work
- [ ] Arrival screen appears

### Phase 5 Tests
- [ ] Close button works
- [ ] End navigation clears map
- [ ] All onclick handlers work

---

## ROLLOUT PLAN

1. **Week 1:** Implement Phase 1-2 (Add UI + Toggle)
2. **Week 2:** Implement Phase 3 (Wire functionality)
3. **Week 3:** Implement Phase 4-5 (Navigation + Polish)
4. **Week 4:** Testing + Bug fixes
5. **Week 5:** Remove legacy UI (if approved)

---

## RISK MITIGATION

1. **Feature Toggle:** Both UIs available during migration
2. **Incremental:** Each phase independently testable
3. **Rollback:** Can revert to legacy UI anytime
4. **Zero Loss:** All existing functions preserved

---

## SUCCESS CRITERIA

✅ New UI matches target design  
✅ All existing features work  
✅ No functionality lost  
✅ Toggle between UIs works  
✅ Performance maintained  
✅ No console errors  

---

## NEXT STEPS

1. Review this specification
2. Approve implementation approach
3. Begin Phase 1 implementation
4. Test after each phase
5. Iterate based on feedback
