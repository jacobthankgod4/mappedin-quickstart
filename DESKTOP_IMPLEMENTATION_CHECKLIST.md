# DESKTOP IMPLEMENTATION CHECKLIST

## PRE-IMPLEMENTATION
- [ ] Commit current mobile implementation: `git commit -m "Mobile implementation complete"`
- [ ] Create feature branch: `git checkout -b desktop-layout`
- [ ] Backup main.ts: `cp src/main.ts src/main.ts.backup`

---

## PHASE 1: DETECTION & LAYOUT SWITCH (30 min)

### Add Constants
```typescript
const DESKTOP_BREAKPOINT = 1024;
const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;
let currentLayout: 'mobile' | 'desktop' = isDesktop() ? 'desktop' : 'mobile';
```

### Add Resize Handler
```typescript
window.addEventListener('resize', () => {
  const newLayout = isDesktop() ? 'desktop' : 'mobile';
  if (newLayout !== currentLayout) {
    currentLayout = newLayout;
    location.reload(); // Simple approach for MVP
  }
});
```

### Rename Mobile Functions
- [ ] `setupUI()` → `setupMobileUI()`
- [ ] Add conditional in `init()`:
```typescript
if (isDesktop()) {
  setupDesktopUI();
} else {
  setupMobileUI();
}
```

### Test
- [ ] Resize browser window
- [ ] Verify layout detection works
- [ ] Commit: `git commit -m "Phase 1: Layout detection"`

---

## PHASE 2: DESKTOP SIDEBAR (2 hours)

### Create Sidebar Container
```typescript
function setupDesktopUI() {
  const sidebar = document.createElement('div');
  sidebar.id = 'desktopSidebar';
  sidebar.style.cssText = `
    position: fixed;
    left: 0;
    top: 0;
    width: 380px;
    height: 100vh;
    background: white;
    box-shadow: 2px 0 16px rgba(0,0,0,0.1);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;
  document.body.appendChild(sidebar);
  
  // Adjust map container
  const mapContainer = document.getElementById('mappedin-map')!;
  mapContainer.style.marginLeft = '380px';
  mapContainer.style.width = 'calc(100% - 380px - 80px)';
}
```

### Add Search Section
```typescript
function renderDesktopSearch(): string {
  return `
    <div style="position: relative;">
      <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #5f6368;">
        ${icons.search}
      </span>
      <input id="desktopSearchInput" type="text" placeholder="Search the mall..." 
             style="width: 100%; padding: 12px 48px; border: none; border-radius: 24px; 
                    background: #f2f2f2; font-size: 14px; outline: none;" />
      <button id="desktopFilterBtn" style="position: absolute; right: 16px; top: 50%; 
                                           transform: translateY(-50%); background: none; 
                                           border: none; cursor: pointer; color: #5f6368;">
        ${icons.filter}
      </button>
      <div id="desktopSearchResults" style="display: none; position: absolute; top: 100%; 
                                            left: 0; right: 0; background: white; 
                                            border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
                                            margin-top: 8px; max-height: 300px; overflow-y: auto; z-index: 10;">
      </div>
    </div>
  `;
}
```

### Add Category Pills
```typescript
function renderDesktopCategories(): string {
  const categories = ['all', ...allCategories.slice(0, 5)];
  return `
    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
      ${categories.map(cat => `
        <button class="desktop-category-pill ${cat === activeCategory ? 'active' : ''}" 
                data-category="${cat}"
                style="padding: 8px 16px; border-radius: 20px; border: none; 
                       background: ${cat === activeCategory ? '#1a73e8' : '#f1f3f4'}; 
                       color: ${cat === activeCategory ? 'white' : '#202124'}; 
                       font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
          ${cat === 'all' ? 'All' : cat}
        </button>
      `).join('')}
    </div>
  `;
}
```

### Add Store Cards
```typescript
function renderDesktopStoreCards(): string {
  const featured = searchResults.slice(0, 10);
  return `
    <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; 
                -webkit-overflow-scrolling: touch;">
      ${featured.map(store => {
        const logo = store.logoImage?.url || store.images?.[0]?.url;
        return `
          <div class="desktop-store-card" data-id="${store.id}"
               style="min-width: 140px; padding: 16px; background: white; 
                      border: 1px solid #e8eaed; border-radius: 12px; 
                      text-align: center; cursor: pointer; transition: all 0.2s;">
            ${logo 
              ? `<img src="${logo}" style="width: 80px; height: 80px; object-fit: contain; 
                                           border-radius: 8px; margin-bottom: 12px;" />`
              : `<div style="width: 80px; height: 80px; background: #f1f3f4; 
                             border-radius: 8px; margin: 0 auto 12px; display: flex; 
                             align-items: center; justify-content: center; color: #5f6368;">
                   ${icons.store}
                 </div>`
            }
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; 
                        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${store.name}
            </div>
            <div style="font-size: 12px; color: #5f6368;">
              ${store.floor?.shortName || 'L1'}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
```

### Add Store List
```typescript
function renderDesktopStoreList(): string {
  return searchResults.map(store => `
    <div class="desktop-store-item" data-id="${store.id}"
         style="padding: 12px; margin-bottom: 8px; border-radius: 8px; 
                background: ${selectedStore?.id === store.id ? '#e8f0fe' : 'white'}; 
                border: 1px solid ${selectedStore?.id === store.id ? '#1a73e8' : '#e8eaed'}; 
                cursor: pointer; transition: all 0.2s;">
      <div style="font-weight: 500; font-size: 14px; color: #202124; margin-bottom: 4px;">
        ${store.name}
      </div>
      <div style="font-size: 12px; color: #5f6368;">
        ${store.floor?.name || 'Lower Level'}
      </div>
    </div>
  `).join('');
}
```

### Assemble Sidebar
```typescript
function setupDesktopUI() {
  const sidebar = document.createElement('div');
  sidebar.id = 'desktopSidebar';
  sidebar.style.cssText = `...`; // from above
  
  sidebar.innerHTML = `
    <div style="padding: 20px; border-bottom: 1px solid #e8eaed;">
      ${renderDesktopSearch()}
    </div>
    <div style="padding: 16px; border-bottom: 1px solid #e8eaed;">
      ${renderDesktopCategories()}
    </div>
    <div style="padding: 16px; border-bottom: 1px solid #e8eaed; overflow-x: auto;">
      ${renderDesktopStoreCards()}
    </div>
    <div id="desktopStoreList" style="flex: 1; overflow-y: auto; padding: 16px;">
      ${renderDesktopStoreList()}
    </div>
  `;
  
  document.body.appendChild(sidebar);
  
  // Adjust map
  const mapContainer = document.getElementById('mappedin-map')!;
  mapContainer.style.marginLeft = '380px';
  mapContainer.style.width = 'calc(100% - 380px - 80px)';
  
  attachDesktopEventHandlers();
}
```

### Add Event Handlers
```typescript
function attachDesktopEventHandlers() {
  // Search
  const searchInput = document.getElementById('desktopSearchInput') as HTMLInputElement;
  searchInput.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    if (query.trim()) {
      searchResults = stores.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
    } else {
      searchResults = stores;
    }
    updateDesktopStoreList();
  });
  
  // Category pills
  document.querySelectorAll('.desktop-category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category')!;
      activeCategory = category;
      if (category === 'all') {
        searchResults = stores;
      } else {
        searchResults = stores.filter(s => s.categories?.some((c: any) => c.name === category));
      }
      updateDesktopSidebar();
    });
  });
  
  // Store cards
  document.querySelectorAll('.desktop-store-card').forEach(card => {
    card.addEventListener('click', () => {
      const storeId = card.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) selectStore(store);
    });
  });
  
  // Store list
  document.querySelectorAll('.desktop-store-item').forEach(item => {
    item.addEventListener('click', () => {
      const storeId = item.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) selectStore(store);
    });
  });
}
```

### Test
- [ ] Sidebar renders
- [ ] Search filters stores
- [ ] Category pills work
- [ ] Store cards clickable
- [ ] Store list clickable
- [ ] Commit: `git commit -m "Phase 2: Desktop sidebar"`

---

## PHASE 3: DESKTOP CONTROLS (1 hour)

### Create Control Panel
```typescript
function setupDesktopControls() {
  const controls = document.createElement('div');
  controls.style.cssText = `
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;
  
  controls.innerHTML = `
    ${renderDesktopFloorSelector()}
    <div style="height: 1px; background: #e8eaed; margin: 8px 0;"></div>
    <button id="desktopFullscreen" class="desktop-control-btn" title="Fullscreen">
      ${icons.fullscreen}
    </button>
    <button id="desktopZoomIn" class="desktop-control-btn" title="Zoom In">
      ${icons.zoomIn}
    </button>
    <button id="desktopZoomOut" class="desktop-control-btn" title="Zoom Out">
      ${icons.zoomOut}
    </button>
  `;
  
  document.body.appendChild(controls);
  attachDesktopControlHandlers();
}
```

### Add Floor Selector
```typescript
function renderDesktopFloorSelector(): string {
  return floors.map(floor => `
    <button class="desktop-floor-btn" data-floor-id="${floor.id}"
            style="width: 56px; height: 56px; border-radius: 28px; 
                   background: ${floor.id === currentFloor?.id ? '#1a73e8' : 'white'}; 
                   color: ${floor.id === currentFloor?.id ? 'white' : '#202124'}; 
                   border: 1px solid #dadce0; font-weight: 600; font-size: 14px; 
                   cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
                   transition: all 0.2s;">
      ${floor.shortName || floor.name}
    </button>
  `).join('');
}
```

### Add Control Handlers
```typescript
function attachDesktopControlHandlers() {
  // Floor selector
  document.querySelectorAll('.desktop-floor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const floorId = btn.getAttribute('data-floor-id');
      const floor = floors.find(f => f.id === floorId);
      if (floor) {
        mapView.setFloor(floor);
        currentFloor = floor;
        updateDesktopFloorSelector();
      }
    });
  });
  
  // Fullscreen
  document.getElementById('desktopFullscreen')!.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
  
  // Zoom
  document.getElementById('desktopZoomIn')!.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoomLevel;
    mapView.Camera.animateTo({ zoomLevel: currentZoom + 1 });
  });
  
  document.getElementById('desktopZoomOut')!.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoomLevel;
    mapView.Camera.animateTo({ zoomLevel: currentZoom - 1 });
  });
}
```

### Add to setupDesktopUI()
```typescript
function setupDesktopUI() {
  // ... sidebar code ...
  setupDesktopControls();
}
```

### Test
- [ ] Floor selector switches floors
- [ ] Zoom controls work
- [ ] Fullscreen toggle works
- [ ] Commit: `git commit -m "Phase 3: Desktop controls"`

---

## PHASE 4: DESKTOP MODALS (1 hour)

### Store Detail Modal
```typescript
function showDesktopStoreDetail(store: any) {
  const modal = document.createElement('div');
  modal.id = 'desktopStoreModal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 380px;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  `;
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 20px; max-width: 500px; width: 100%; 
                max-height: 80vh; overflow-y: auto; box-shadow: 0 8px 32px rgba(0,0,0,0.2); 
                position: relative;">
      <button onclick="document.getElementById('desktopStoreModal').remove()" 
              style="position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; 
                     border-radius: 20px; background: #f1f3f4; border: none; cursor: pointer; 
                     font-size: 20px; color: #5f6368;">
        ×
      </button>
      <div style="padding: 24px;">
        ${renderStoreDetailContent(store)}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  mapView.Camera.focusOn(store); // No offset needed
}
```

### Modify selectStore()
```typescript
function selectStore(store: any) {
  // Highlight logic (same)
  if (selectedPolygon && selectedPolygon !== store) {
    try { mapView.updateState(selectedPolygon, { color: 'initial' }); } catch (err) {}
  }
  selectedStore = store;
  selectedPolygon = store;
  try { mapView.updateState(store, { color: '#3498db' }); } catch (err) {}
  
  // Layout-specific UI
  if (isDesktop()) {
    showDesktopStoreDetail(store);
  } else {
    updateMobileStoreList();
  }
}
```

### Test
- [ ] Store detail modal opens
- [ ] Modal close button works
- [ ] Map highlights store
- [ ] Camera focuses on store
- [ ] Commit: `git commit -m "Phase 4: Desktop modals"`

---

## PHASE 5: DESKTOP NAVIGATION (2 hours)

### Directions Sidebar
```typescript
function showDesktopDirections(store: any) {
  const sidebar = document.getElementById('desktopSidebar')!;
  
  sidebar.innerHTML = `
    <div style="padding: 20px; border-bottom: 1px solid #e8eaed;">
      <button onclick="exitDesktopDirections()" 
              style="background: none; border: none; cursor: pointer; color: #5f6368; 
                     font-size: 14px; margin-bottom: 12px;">
        ← Back
      </button>
      <h2 style="margin: 0; font-size: 20px; font-weight: 600;">Directions</h2>
    </div>
    
    <div style="padding: 20px;">
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; color: #5f6368; margin-bottom: 8px;">FROM</label>
        <input id="desktopFromInput" type="text" placeholder="Choose starting point" readonly 
               style="width: 100%; padding: 12px; border: 1px solid #dadce0; border-radius: 12px; cursor: pointer;" />
        <div id="desktopFromDropdown" style="display: none;"></div>
      </div>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; font-size: 12px; color: #5f6368; margin-bottom: 8px;">TO</label>
        <input type="text" value="${store.name}" readonly 
               style="width: 100%; padding: 12px; border: 1px solid #dadce0; border-radius: 12px; background: #f8f9fa;" />
      </div>
      
      <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; cursor: pointer;">
        <input type="checkbox" id="desktopAccessibleToggle" />
        <span style="font-size: 14px;">Accessible Route</span>
      </label>
      
      <button id="desktopStartNav" class="btn-primary" disabled>Start Navigation</button>
    </div>
    
    <div id="desktopMostPopular" style="padding: 20px; border-top: 1px solid #e8eaed;">
      <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #5f6368;">Most Popular</h3>
      ${stores.slice(0, 5).map(s => `
        <div class="desktop-popular-item" data-id="${s.id}" 
             style="padding: 12px; margin-bottom: 8px; border-radius: 8px; background: #f8f9fa; cursor: pointer;">
          <div style="font-weight: 500; font-size: 14px;">${s.name}</div>
          <div style="font-size: 12px; color: #5f6368;">${s.floor?.name || 'Lower Level'}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  attachDesktopDirectionsHandlers(store);
}

(window as any).exitDesktopDirections = () => {
  setupDesktopUI();
};
```

### Active Navigation Overlay
```typescript
function drawDesktopNavigation() {
  if (!navStartPoint || !navEndPoint || !activeDirections) return;
  
  const navOverlay = document.createElement('div');
  navOverlay.id = 'desktopNavOverlay';
  navOverlay.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2000;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    padding: 20px;
    min-width: 400px;
  `;
  
  const distance = activeDirections.distance?.toFixed(0) || 'N/A';
  const time = activeDirections.distance ? Math.ceil(activeDirections.distance / 1.4 / 60) : 'N/A';
  
  navOverlay.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
      <button onclick="exitDesktopNavigation()" 
              style="background: none; border: none; cursor: pointer; color: #5f6368;">←</button>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 16px;">Directions to ${navEndPoint.name}</div>
        <div style="font-size: 14px; color: #5f6368;">Arrive in ${time} minutes</div>
      </div>
    </div>
    
    <div style="background: #e8f0fe; padding: 16px; border-radius: 12px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="color: #1a73e8;">${icons.walk}</div>
        <div id="desktopCurrentInstruction" style="flex: 1; font-weight: 500;">
          Start at ${navStartPoint.name}
        </div>
      </div>
    </div>
    
    <div style="display: flex; gap: 8px;">
      <button onclick="prevInstruction()" class="btn-secondary" style="flex: 1;">Previous</button>
      <button onclick="nextInstruction()" class="btn-primary" style="flex: 1;">Next Step</button>
    </div>
  `;
  
  document.body.appendChild(navOverlay);
}

(window as any).exitDesktopNavigation = () => {
  document.getElementById('desktopNavOverlay')?.remove();
  mapView.Navigation.clear();
  setupDesktopUI();
};
```

### Test
- [ ] Directions sidebar shows
- [ ] FROM dropdown works
- [ ] Route preview draws
- [ ] Start navigation works
- [ ] Active navigation overlay shows
- [ ] Next/Previous buttons work
- [ ] Commit: `git commit -m "Phase 5: Desktop navigation"`

---

## PHASE 6: CSS & POLISH (1 hour)

### Add Desktop CSS
```css
/* Desktop Sidebar */
#desktopSidebar::-webkit-scrollbar {
  width: 8px;
}

#desktopSidebar::-webkit-scrollbar-thumb {
  background: #dadce0;
  border-radius: 4px;
}

.desktop-store-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.desktop-store-item:hover {
  background: #f8f9fa !important;
}

.desktop-control-btn {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: white;
  border: 1px solid #dadce0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5f6368;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.desktop-control-btn:hover {
  background: #f1f3f4;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Responsive */
@media (max-width: 1023px) {
  #desktopSidebar,
  .desktop-control-btn,
  #desktopStoreModal,
  #desktopNavOverlay {
    display: none !important;
  }
}

@media (min-width: 1024px) {
  #bottomSheet {
    display: none !important;
  }
  
  #mappedin-map {
    margin-left: 380px !important;
    width: calc(100% - 380px - 80px) !important;
  }
}
```

### Test
- [ ] Hover states work
- [ ] Transitions smooth
- [ ] Responsive breakpoints work
- [ ] Commit: `git commit -m "Phase 6: CSS polish"`

---

## FINAL TESTING

### Desktop Features
- [ ] Sidebar renders correctly
- [ ] Search filters stores
- [ ] Category pills filter
- [ ] Store cards clickable
- [ ] Store list clickable
- [ ] Store detail modal opens/closes
- [ ] Directions flow works
- [ ] Navigation works
- [ ] Floor selector works
- [ ] Zoom controls work
- [ ] Fullscreen works

### Responsive
- [ ] Desktop UI at 1024px+
- [ ] Mobile UI below 1024px
- [ ] Resize switches layouts
- [ ] No overlap

### Shared Features
- [ ] Store selection works on both
- [ ] Search works on both
- [ ] Navigation works on both
- [ ] Map interactions work on both

---

## DEPLOYMENT

- [ ] Merge to main: `git checkout main && git merge desktop-layout`
- [ ] Push: `git push origin main`
- [ ] Deploy to Vercel
- [ ] Test on production
- [ ] Test on mobile device
- [ ] Test on desktop browser

---

## ROLLBACK (if needed)

```bash
git revert HEAD
git push origin main
```

---

## COMPLETION

✅ Desktop implementation complete
✅ All features preserved
✅ Responsive behavior working
✅ No functionality loss
✅ Production deployed
