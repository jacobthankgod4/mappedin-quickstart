import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';
import './styles.css';

// SVG Icon Helper
const icons = {
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  filter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></svg>',
  store: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M9 22V12h6v10"/></svg>',
  location: '<svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor"><path d="M47.782 55.36c5.513.635 10.687-1.049 14.638-4.763c4.012-3.771 5.817-7.914 5.817-13.354c0-5.508-1.823-9.633-5.955-13.478c-1.826-1.7-4.227-3.095-6.844-3.978c-2.14-.723-6.883-.903-9.427-.358c-2.833.606-6.203 2.365-8.336 4.349c-3.99 3.712-5.901 8.075-5.901 13.465c0 3.231.472 5.255 1.915 8.206c1.05 2.147 1.444 2.682 3.406 4.633c1.708 1.699 2.645 2.425 4.074 3.159c2.355 1.208 4.406 1.865 6.613 2.12zm1.036 44.214c-.388-.236-2.127-1.926-3.865-3.756C31.64 81.798 22.345 68.161 17.3 55.241c-1.518-3.887-2.08-5.85-2.675-9.33c-1.823-10.67.36-21.094 6.272-29.96c2.25-3.375 6.816-7.95 10.075-10.098c11.891-7.835 26.22-7.802 38.166.087c3.1 2.048 7.711 6.702 9.906 10c4.018 6.039 6.16 12.237 6.81 19.715c.531 6.102-.383 12.06-2.862 18.694c-4.826 12.902-13.598 25.78-28.706 42.144c-3.373 3.653-3.971 3.99-5.468 3.08z"/></svg>',
  target: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  walk: '<svg width="24" height="24" viewBox="0 0 100 100" fill="currentColor"><path d="M55.017 7.5c-3.844 0-6.892 3.18-6.892 7.024s3.048 7.025 6.892 7.025c3.976 0 7.024-3.181 7.024-7.025c0-3.843-3.048-7.024-7.024-7.024zm-5.964 13.518c-1.458.133-2.651.928-3.579 1.59c-1.193.929-3.048 2.917-3.048 2.917v.132c-.133 0-7.422 8.482-11.663 12.458c-.398.398-.663.795-.795 1.326l-2.12 11.53c-.398 1.325.662 2.916 1.987 3.18c1.326.266 2.916-.794 3.048-2.252l2.121-10.736l8.217-8.217v21.868l-4.639 11.53L24.27 86.623a3.994 3.994 0 0 0-.663 2.784c.133.927.663 1.855 1.458 2.385c.795.663 1.855.795 2.916.663c.927-.265 1.855-.795 2.385-1.59v-.133l14.446-20.41l.398-.795l5.434-13.519l10.735 14.446l7.952 18.555c.663 1.723 3.048 2.65 4.771 1.855c1.723-.662 2.651-3.048 1.988-4.77l-8.084-18.82l-.398-.796L57.27 52.694V35.862l4.108 4.771l.398.398l10.602 8.217c.928.795 2.784.663 3.579-.398c.795-1.06.53-2.783-.398-3.71l-10.337-8.085c-3.181-3.711-7.29-8.88-9.145-11.265c-.928-1.193-3.314-4.374-6.362-4.772z"/></svg>',
  arrowUp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  arrowDown: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>',
  arrowRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
  arrowLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  arrowUpRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>',
  arrowUpLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 17L7 7M17 7H7v10"/></svg>',
  straight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M19 12l-7-7-7 7"/></svg>',
  zoomIn: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  zoomOut: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  fullscreen: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
  refresh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>',
  share: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>'
};

const options = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c'
};

const DESKTOP_BREAKPOINT = 768;
const isDesktop = () => window.innerWidth >= DESKTOP_BREAKPOINT;
let currentLayout: 'mobile' | 'desktop' = isDesktop() ? 'desktop' : 'mobile';

let mapView: any = null;
let mapData: any = null;
let stores: any[] = [];
let searchResults: any[] = [];
let selectedStore: any = null;
let currentFloor: any = null;
let selectedPolygon: any = null;
let navStartPoint: any = null;
let navEndPoint: any = null;
let activeDirections: any = null;
let currentInstructionIndex: number = 0;
let activeCategory: string = 'all';
let allCategories: string[] = [];
let floors: any[] = [];
let uiMode: 'legacy' | 'new' = 'legacy';

async function init() {
  const container = document.getElementById('mappedin-map')!;
  container.style.position = 'relative';

  mapData = await getMapData(options);
  mapView = await show3dMap(container, mapData);
  setupStores(mapData);
  setupFloors(mapData);
  setupCategories();
  setupFloorIndicator(mapData);
  addLabels();
  addPromotionalMarkers();
  addDirectoryKiosks(mapData);
  setupMapControls();
  
  // Debug indicator
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debugIndicator';
  debugDiv.style.cssText = 'position:fixed;top:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:8px 16px;border-radius:20px;font-size:12px;z-index:10000;pointer-events:none;';
  debugDiv.textContent = `${window.innerWidth}px - ${isDesktop() ? 'DESKTOP' : 'MOBILE'}`;
  document.body.appendChild(debugDiv);
  
  if (!isDesktop()) {
    createTopBar();
    createBottomTabBar();
    createStoreDetailCard();
    createUIToggle();
    wireTopSearch();
    wireBottomTabs();
  }
  
  if (isDesktop()) {
    setupDesktopUI();
  } else {
    setupMobileUI();
  }
}

window.addEventListener('resize', () => {
  const newLayout = isDesktop() ? 'desktop' : 'mobile';
  const debugDiv = document.getElementById('debugIndicator');
  if (debugDiv) {
    debugDiv.textContent = `${window.innerWidth}px - ${newLayout.toUpperCase()}`;
  }
  if (newLayout !== currentLayout) {
    currentLayout = newLayout;
    location.reload();
  }
});

function setupStores(mapData: any) {
  try {
    if (mapData.locations && mapData.locations.length > 0) {
      stores = mapData.locations;
    } else {
      const spaces = mapData.getByType?.('space') || [];
      stores = spaces.filter((s: any) => s && s.name);
    }
    
    searchResults = stores;
  } catch (err) {
    stores = [];
    searchResults = [];
  }
}

function setupFloors(data: any) {
  floors = data.getByType?.('floor') || [];
}

function setupCategories() {
  const categorySet = new Set<string>();
  stores.forEach((store: any) => {
    if (store.categories) {
      store.categories.forEach((cat: any) => categorySet.add(cat.name));
    }
  });
  allCategories = Array.from(categorySet);
}

function setupFloorIndicator(mapData: any) {
  const floors = mapData.getByType('floor');
  currentFloor = floors[0];
  
  const indicator = document.createElement('div');
  indicator.className = 'floor-indicator';
  indicator.textContent = currentFloor?.shortName || currentFloor?.name || 'L1';
  indicator.style.cursor = 'pointer';
  document.body.appendChild(indicator);
  
  const dropdown = document.createElement('div');
  dropdown.className = 'floor-dropdown';
  dropdown.style.display = 'none';
  document.body.appendChild(dropdown);
  
  indicator.addEventListener('click', () => {
    if (dropdown.style.display === 'none') {
      dropdown.innerHTML = floors.map((floor: any) => `
        <div class="floor-dropdown-item" data-floor-id="${floor.id}" style="
          padding: 12px 16px;
          cursor: pointer;
          background: ${floor.id === currentFloor?.id ? '#e8f0fe' : 'white'};
          font-weight: ${floor.id === currentFloor?.id ? '600' : '400'};
          color: ${floor.id === currentFloor?.id ? '#1a73e8' : '#202124'};
        ">
          ${floor.shortName || floor.name}
        </div>
      `).join('');
      dropdown.style.display = 'block';
      
      dropdown.querySelectorAll('.floor-dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
          const floorId = item.getAttribute('data-floor-id');
          const floor = floors.find((f: any) => f.id === floorId);
          if (floor) {
            mapView.setFloor(floor);
            currentFloor = floor;
            indicator.textContent = floor.shortName || floor.name;
            dropdown.style.display = 'none';
          }
        });
      });
    } else {
      dropdown.style.display = 'none';
    }
  });
  
  document.addEventListener('click', (e) => {
    if (!indicator.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      dropdown.style.display = 'none';
    }
  });
  
  mapView.on('floor-change', (event: any) => {
    currentFloor = event.floor;
    indicator.textContent = currentFloor?.shortName || currentFloor?.name || 'L1';
  });
}

function addLabels() {
  try {
    stores.forEach((store) => {
      mapView.Labels.add(store, store.name, {
        fontSize: 12,
        fontColor: '#2c3e50',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 4,
        padding: 8
      });
    });
  } catch (err) {
    console.error('Labels error:', err);
  }
}

function addPromotionalMarkers() {
  const promotionTypes = ['SALE', 'NEW', 'HOT', '50% OFF', 'GRAND OPENING'];
  const colors = ['#e74c3c', '#f39c12', '#e67e22', '#27ae60', '#9b59b6'];
  
  stores.slice(0, 5).forEach((store, index) => {
    try {
      mapView.Markers.add(store, `
        <div style="
          background: ${colors[index]};
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 11px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${promotionTypes[index]}
        </div>
      `, { rank: 2 });
    } catch (err) {}
  });
}

function addDirectoryKiosks(mapData: any) {
  try {
    const spaces = mapData.getByType?.('space') || [];
    const entrances = spaces.filter((s: any) => s.name && s.name.toLowerCase().includes('entrance'));
    
    entrances.forEach((entrance: any) => {
      mapView.Markers.add(entrance, `
        <div style="
          background: #3498db;
          color: white;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        ">
          ℹ️
        </div>
      `, { rank: 3 });
    });
  } catch (err) {}
}

function setupMapControls() {
  const controls = document.createElement('div');
  controls.style.cssText = 'position:fixed;right:16px;top:240px;z-index:50;display:flex;flex-direction:column;gap:8px;';
  
  controls.innerHTML = `
    <button id="fullscreenBtn" class="map-control-btn" title="Fullscreen">${icons.fullscreen}</button>
    <button id="zoomInBtn" class="map-control-btn" title="Zoom In">${icons.zoomIn}</button>
    <button id="zoomOutBtn" class="map-control-btn" title="Zoom Out">${icons.zoomOut}</button>
  `;
  
  document.body.appendChild(controls);
  
  document.getElementById('fullscreenBtn')!.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
  
  document.getElementById('zoomInBtn')!.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoomLevel;
    mapView.Camera.animateTo({ zoomLevel: currentZoom + 1 });
  });
  
  document.getElementById('zoomOutBtn')!.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoomLevel;
    mapView.Camera.animateTo({ zoomLevel: currentZoom - 1 });
  });
  
  if (floors.length > 1) {
    const floorSelector = document.createElement('div');
    floorSelector.id = 'floorSelector';
    floorSelector.style.cssText = 'position:fixed;right:16px;top:80px;z-index:50;display:flex;flex-direction:column;gap:8px;';
    
    floorSelector.innerHTML = floors.map((floor, index) => `
      <button class="floor-btn" data-floor-id="${floor.id}" 
              style="width:48px;height:48px;border-radius:24px;background:${index === 0 ? '#1a73e8' : 'white'};color:${index === 0 ? 'white' : '#202124'};border:1px solid #dadce0;font-weight:500;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        ${floor.shortName || floor.name}
      </button>
    `).join('');
    
    document.body.appendChild(floorSelector);
    
    floorSelector.querySelectorAll('.floor-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const floorId = btn.getAttribute('data-floor-id');
        const floor = floors.find((f: any) => f.id === floorId);
        if (floor) {
          mapView.setFloor(floor);
          floorSelector.querySelectorAll('.floor-btn').forEach(b => {
            (b as HTMLElement).style.background = 'white';
            (b as HTMLElement).style.color = '#202124';
          });
          (btn as HTMLElement).style.background = '#1a73e8';
          (btn as HTMLElement).style.color = 'white';
        }
      });
    });
  }
}



let isSelectStoreRunning = false;
function selectStore(store: any) {
  if (isSelectStoreRunning) {
    console.warn('[WARN] selectStore already running, preventing cascade');
    return;
  }
  isSelectStoreRunning = true;
  
  try {
    if (selectedPolygon && selectedPolygon !== store) {
      try {
        mapView.updateState(selectedPolygon, { color: 'initial' });
      } catch (err) {}
    }
    
    selectedStore = store;
    selectedPolygon = store;
    
    try {
      mapView.updateState(store, { color: '#3498db' });
    } catch (err) {}
    
    try {
      if (isDesktop()) {
        mapView.Camera.focusOn(store);
        renderDesktopStoreDetail(store);
      } else {
        if (uiMode === 'new') {
          mapView.Camera.setScreenOffsets({ bottom: 80, type: 'pixel' });
          mapView.Camera.focusOn(store);
          showStoreDetailInCard(store);
        } else {
          const vh = window.innerHeight / 100;
          mapView.Camera.setScreenOffsets({ bottom: 60 * vh, type: 'pixel' });
          mapView.Camera.focusOn(store);
          updateStoreList();
        }
      }
    } catch (err) {}
  } finally {
    isSelectStoreRunning = false;
  }
}

function showDirections() {
  const content = document.getElementById('sheetContent')!;
  const searchBar = document.getElementById('searchInput')!.parentElement!.parentElement!;
  searchBar.style.display = 'none';
  
  content.innerHTML = `
    <div class="directions-card" style="display:flex;flex-direction:column;height:100%;padding:12px;">
      <div style="font-size:16px;font-weight:500;color:#202124;margin-bottom:12px;cursor:grab;" class="directions-page-header">Get Directions</div>
      
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#5f6368;margin-bottom:6px;">FROM</label>
        <div style="position:relative;">
          <input id="startInput" class="location-input" style="padding:8px 12px;font-size:13px;" type="text" placeholder="Choose starting point" readonly />
          <div id="startDropdown" class="location-dropdown" style="display:none;"></div>
        </div>
      </div>
      
      <div style="margin-bottom:10px;">
        <label style="display:block;font-size:11px;color:#5f6368;margin-bottom:6px;">TO</label>
        <div style="position:relative;">
          <input id="endInput" class="location-input" style="padding:8px 12px;font-size:13px;" type="text" value="${selectedStore.name}" readonly />
        </div>
      </div>
      
      <div style="margin-top:auto;">
        <button class="btn-primary" id="startNavBtn" style="padding:10px;font-size:13px;" disabled>Start Navigation</button>
        <button class="btn-secondary" style="margin-top:6px;padding:10px;font-size:13px;" onclick="updateStoreList()">Cancel</button>
      </div>
    </div>
  `;
  
  const startInput = document.getElementById('startInput') as HTMLInputElement;
  const startDropdown = document.getElementById('startDropdown')!;
  const startNavBtn = document.getElementById('startNavBtn') as HTMLButtonElement;
  
  startInput.addEventListener('click', () => {
    startDropdown.innerHTML = stores.map(s => `
      <div class="dropdown-item" data-id="${s.id}">${s.name}</div>
    `).join('');
    startDropdown.style.display = 'block';
    
    startDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        navStartPoint = stores.find(st => st.id === item.getAttribute('data-id'));
        (startInput as HTMLInputElement).value = navStartPoint!.name;
        startDropdown.style.display = 'none';
        startNavBtn.disabled = false;
        
        // Draw path and show overview
        (async () => {
          const directions = await mapView.getDirections(navStartPoint, selectedStore);
          if (directions) {
            activeDirections = directions;
            await mapView.Navigation.draw(directions, {
              pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5, pulseColor: '#4285f4' },
              markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' },
              setMapToDeparture: false,
              animatePathDrawing: true
            });
            
            // Set camera padding to account for 40vh sheet
            const vh = window.innerHeight / 100;
            mapView.Camera.setScreenOffsets({ bottom: 40 * vh, type: 'pixel' });
            await mapView.Camera.focusOn(directions.path, { maxZoomLevel: 18 });
            
            // Reduce sheet to 40vh to show route
            const sheet = document.getElementById('bottomSheet')!;
            sheet.style.maxHeight = '40vh';
          }
        })();
      });
    });
  });
  
  startNavBtn.addEventListener('click', async () => {
    navEndPoint = selectedStore;
    await drawNavigation();
  });
  
  // Make directions header draggable
  const directionsHeader = document.querySelector('.directions-page-header') as HTMLElement;
  if (directionsHeader) {
    directionsHeader.addEventListener('touchstart', (e) => {
      const sheet = document.getElementById('bottomSheet')!;
      sheetStartY = e.touches[0].clientY;
      sheetCurrentHeight = sheet.offsetHeight;
      sheetIsDragging = true;
      sheet.style.transition = 'none';
    });
  }
}

async function drawNavigation() {
  if (!navStartPoint || !navEndPoint || !activeDirections) return;
  try {
    currentInstructionIndex = 0;
    
    // Clear camera offset and focus on start location
    mapView.Camera.setScreenOffsets({ bottom: 0, type: 'pixel' });
    await mapView.Camera.focusOn(activeDirections.instructions[0].coordinate);
    
    const content = isDesktop() ? document.getElementById('desktopSidebar') : document.getElementById('sheetContent');
    if (!content) return;
    
    const distance = activeDirections.distance ? activeDirections.distance.toFixed(0) : 'N/A';
    const time = activeDirections.distance ? Math.ceil(activeDirections.distance / 1.4 / 60) : 'N/A';
    
    const getInstructionIcon = (type: string, bearing?: string) => {
      if (type === 'Departure') return icons.walk;
      if (type === 'Arrival') return icons.target;
      if (type === 'TakeConnection') return icons.arrowUp;
      if (type === 'ExitConnection') return icons.arrowDown;
      if (bearing === 'Right') return icons.arrowRight;
      if (bearing === 'Left') return icons.arrowLeft;
      if (bearing === 'SlightRight') return icons.arrowUpRight;
      if (bearing === 'SlightLeft') return icons.arrowUpLeft;
      return icons.straight;
    };
    
    const getInstructionText = (inst: any) => {
      const type = inst.action.type;
      const bearing = inst.action.bearing;
      const dist = inst.distance.toFixed(0);
      
      if (type === 'Departure') return `Start at ${navStartPoint.name}`;
      if (type === 'Arrival') return `Arrive at ${navEndPoint.name}`;
      if (type === 'TakeConnection') {
        const conn = inst.action.connection?.type || 'connection';
        return `Take ${conn} ${inst.action.direction || ''}`;
      }
      if (type === 'ExitConnection') return `Exit and continue`;
      if (type === 'Turn') return `Turn ${bearing?.toLowerCase() || 'ahead'} (${dist}m)`;
      return `Continue ${dist}m`;
    };
    
    const instructionsHtml = activeDirections.instructions.map((inst: any, idx: number) => `
      <div id="inst-${idx}" style="display:flex;align-items:start;gap:12px;padding:12px;border-bottom:1px solid #e8eaed;opacity:0.5;">
        <div style="flex-shrink:0;color:#5f6368;">${getInstructionIcon(inst.action.type, inst.action.bearing)}</div>
        <div style="flex:1;">
          <div style="font-size:14px;color:#202124;font-weight:500;">${getInstructionText(inst)}</div>
          ${inst.action.fromFloor && inst.action.toFloor ? `<div style="font-size:12px;color:#5f6368;margin-top:4px;">Floor ${inst.action.fromFloor.name} → ${inst.action.toFloor.name}</div>` : ''}
        </div>
      </div>
    `).join('');
    
    const navUI = `
      <div class="directions-card">
        <div id="currentInstruction" style="padding:16px;background:#e8f0fe;border-radius:8px;margin-bottom:12px;cursor:pointer;" onclick="toggleSheet()">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="color:#1a73e8;" id="currentIcon">${icons.walk}</div>
            <div style="flex:1;">
              <div style="font-weight:500;font-size:16px;color:#202124;" id="currentText">Start at ${navStartPoint.name}</div>
              <div style="font-size:12px;color:#5f6368;margin-top:4px;">${time} min • ${distance}m</div>
            </div>
            <div style="font-size:20px;color:#5f6368;" id="expandIcon">▲</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <button class="btn-secondary" onclick="prevInstruction()" id="prevBtn" style="flex:1;">Previous</button>
          <button class="btn-primary" onclick="nextInstruction()" id="nextBtn" style="flex:1;">Next Step</button>
        </div>
        <div id="allSteps" style="display:none;margin:16px 0;">
          <div style="font-size:14px;font-weight:500;color:#202124;margin-bottom:8px;">All Steps</div>
          <div style="max-height:200px;overflow-y:auto;border:1px solid #e8eaed;border-radius:8px;">
            ${instructionsHtml}
          </div>
        </div>
        <button class="btn-secondary" onclick="clearNavigation()">End route</button>
      </div>
    `;
    
    if (isDesktop()) {
      content.innerHTML = `
        <div style="padding:20px;border-bottom:1px solid #e8eaed;">
          <button onclick="returnToDesktopStoreList()" style="background:none;border:none;cursor:pointer;color:#5f6368;font-size:14px;margin-bottom:12px;">← Back</button>
          <h2 style="margin:0;font-size:20px;font-weight:600;">Navigation</h2>
        </div>
        <div style="flex:1;overflow-y:auto;padding:20px;">
          ${navUI}
        </div>
      `;
    } else {
      content.innerHTML = navUI;
      document.getElementById('searchInput')!.parentElement!.parentElement!.style.display = 'none';
      const sheet = document.getElementById('bottomSheet')!;
      sheet.style.maxHeight = '35vh';
    }
    
    updateCurrentInstruction();
  } catch (err) {}
}

function clearSelection() {
  const sheet = document.getElementById('bottomSheet')!;
  
  if (selectedPolygon) {
    try { 
      mapView.updateState(selectedPolygon, { color: 'initial' });
    } catch (err) {}
    selectedPolygon = null;
  }
  
  selectedStore = null;
  sheet.style.maxHeight = '70vh';
  
  // Show search bar
  document.getElementById('searchInput')!.parentElement!.parentElement!.style.display = 'block';
  
  const content = document.getElementById('sheetContent')!;
  content.innerHTML = `
    <div style="padding:16px;text-align:center;">
      <div style="font-size:14px;color:#5f6368;margin-bottom:12px;">Tap to view stores</div>
      <button class="btn-primary" onclick="updateStoreList()">Show Stores</button>
    </div>
  `;
}

function clearNavigation() {
  mapView.Navigation.clear();
  mapView.Navigation.clearHighlightedPathSection();
  activeDirections = null;
  currentInstructionIndex = 0;
  navStartPoint = null;
  navEndPoint = null;
  
  if (isDesktop()) {
    returnToDesktopStoreList();
  } else {
    document.getElementById('searchInput')!.parentElement!.parentElement!.style.display = 'block';
    clearSelection();
  }
}

function toggleSheet() {
  if (isDesktop()) {
    const expandIcon = document.getElementById('expandIcon');
    const allSteps = document.getElementById('allSteps');
    if (!expandIcon || !allSteps) return;
    
    if (allSteps.style.display === 'none') {
      allSteps.style.display = 'block';
      expandIcon.textContent = '▼';
    } else {
      allSteps.style.display = 'none';
      expandIcon.textContent = '▲';
    }
  } else {
    const sheet = document.getElementById('bottomSheet')!;
    const expandIcon = document.getElementById('expandIcon')!;
    const allSteps = document.getElementById('allSteps')!;
    
    if (sheet.classList.contains('expanded')) {
      sheet.classList.remove('expanded');
      sheet.style.maxHeight = '70vh';
      expandIcon.textContent = '▲';
      allSteps.style.display = 'none';
    } else {
      sheet.classList.add('expanded');
      sheet.style.maxHeight = '85vh';
      expandIcon.textContent = '▼';
      allSteps.style.display = 'block';
    }
  }
}

function prevInstruction() {
  if (!activeDirections || currentInstructionIndex <= 0) return;
  
  currentInstructionIndex--;
  updateCurrentInstruction();
  
  const currentInst = activeDirections.instructions[currentInstructionIndex];
  const startCoord = activeDirections.instructions[0].coordinate;
  
  if (currentInstructionIndex === 0) {
    mapView.Navigation.clearHighlightedPathSection();
  } else {
    try {
      mapView.Navigation.highlightPathSection(startCoord, currentInst.coordinate, {
        color: '#34a853',
        nearRadius: 0.6,
        farRadius: 1.8
      });
    } catch (err) {}
  }
  
  // Calculate bearing to next instruction for camera direction
  let bearing = 0;
  if (currentInstructionIndex < activeDirections.instructions.length - 1) {
    const nextInst = activeDirections.instructions[currentInstructionIndex + 1];
    const dx = nextInst.coordinate.longitude - currentInst.coordinate.longitude;
    const dy = nextInst.coordinate.latitude - currentInst.coordinate.latitude;
    bearing = Math.atan2(dx, dy) * (180 / Math.PI);
  }
  
  try {
    const vh = window.innerHeight / 100;
    mapView.Camera.setScreenOffsets({ bottom: 35 * vh, type: 'pixel' });
    mapView.Camera.focusOn(currentInst.coordinate, { maxZoomLevel: 20, pitch: 45, bearing });
  } catch (err) {}
}

function nextInstruction() {
  if (!activeDirections) return;
  
  currentInstructionIndex++;
  
  if (currentInstructionIndex >= activeDirections.instructions.length) {
    if (isDesktop()) {
      const sidebar = document.getElementById('desktopSidebar');
      if (sidebar) {
        sidebar.innerHTML = `
          <div style="padding:20px;border-bottom:1px solid #e8eaed;">
            <button onclick="returnToDesktopStoreList()" style="background:none;border:none;cursor:pointer;color:#5f6368;font-size:14px;margin-bottom:12px;">← Back</button>
            <h2 style="margin:0;font-size:20px;font-weight:600;">Arrived</h2>
          </div>
          <div style="flex:1;overflow-y:auto;padding:20px;">
            <div class="directions-card" style="text-align:center;padding:32px;">
              <div style="color:#34a853;margin-bottom:16px;">${icons.target}</div>
              <div style="font-size:20px;font-weight:500;color:#202124;margin-bottom:8px;">You've Arrived!</div>
              <div style="color:#5f6368;margin-bottom:24px;">${navEndPoint.name}</div>
              <button class="btn-primary" onclick="clearNavigation()">Done</button>
            </div>
          </div>
        `;
      }
    } else {
      const content = document.getElementById('sheetContent')!;
      content.innerHTML = `
        <div class="directions-card" style="text-align:center;padding:32px;">
          <div style="color:#34a853;margin-bottom:16px;">${icons.target}</div>
          <div style="font-size:20px;font-weight:500;color:#202124;margin-bottom:8px;">You've Arrived!</div>
          <div style="color:#5f6368;margin-bottom:24px;">${navEndPoint.name}</div>
          <button class="btn-primary" onclick="clearNavigation()">Done</button>
        </div>
      `;
      const sheet = document.getElementById('bottomSheet')!;
      sheet.style.maxHeight = '40vh';
    }
    return;
  }
  
  updateCurrentInstruction();
  
  const currentInst = activeDirections.instructions[currentInstructionIndex];
  const startCoord = activeDirections.instructions[0].coordinate;
  
  try {
    mapView.Navigation.highlightPathSection(startCoord, currentInst.coordinate, {
      color: '#34a853',
      nearRadius: 0.6,
      farRadius: 1.8
    });
  } catch (err) {}
  
  let bearing = 0;
  if (currentInstructionIndex < activeDirections.instructions.length - 1) {
    const nextInst = activeDirections.instructions[currentInstructionIndex + 1];
    const dx = nextInst.coordinate.longitude - currentInst.coordinate.longitude;
    const dy = nextInst.coordinate.latitude - currentInst.coordinate.latitude;
    bearing = Math.atan2(dx, dy) * (180 / Math.PI);
  }
  
  try {
    if (!isDesktop()) {
      const vh = window.innerHeight / 100;
      mapView.Camera.setScreenOffsets({ bottom: 35 * vh, type: 'pixel' });
    }
    mapView.Camera.focusOn(currentInst.coordinate, { maxZoomLevel: 20, pitch: 45, bearing });
  } catch (err) {}
}

function updateCurrentInstruction() {
  if (!activeDirections) return;
  
  const inst = activeDirections.instructions[currentInstructionIndex];
  const getInstructionIcon = (type: string, bearing?: string) => {
    if (type === 'Departure') return icons.walk;
    if (type === 'Arrival') return icons.target;
    if (type === 'TakeConnection') return icons.arrowUp;
    if (type === 'ExitConnection') return icons.arrowDown;
    if (bearing === 'Right') return icons.arrowRight;
    if (bearing === 'Left') return icons.arrowLeft;
    if (bearing === 'SlightRight') return icons.arrowUpRight;
    if (bearing === 'SlightLeft') return icons.arrowUpLeft;
    return icons.straight;
  };
  
  const getInstructionText = (inst: any) => {
    const type = inst.action.type;
    const bearing = inst.action.bearing;
    const dist = inst.distance.toFixed(0);
    
    if (type === 'Departure') return `Start at ${navStartPoint.name}`;
    if (type === 'Arrival') return `Arrive at ${navEndPoint.name}`;
    if (type === 'TakeConnection') {
      const conn = inst.action.connection?.type || 'connection';
      return `Take ${conn} ${inst.action.direction || ''}`;
    }
    if (type === 'ExitConnection') return `Exit and continue`;
    if (type === 'Turn') return `Turn ${bearing?.toLowerCase() || 'ahead'} (${dist}m)`;
    return `Continue ${dist}m`;
  };
  
  const icon = getInstructionIcon(inst.action.type, inst.action.bearing);
  const text = getInstructionText(inst);
  
  document.getElementById('currentIcon')!.innerHTML = icon;
  document.getElementById('currentText')!.textContent = text;
  
  activeDirections.instructions.forEach((_: any, idx: number) => {
    const elem = document.getElementById(`inst-${idx}`);
    if (elem) {
      elem.style.opacity = idx <= currentInstructionIndex ? '1' : '0.5';
      elem.style.background = idx === currentInstructionIndex ? '#e8f0fe' : 'transparent';
    }
  });
  
  const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
  const prevBtn = document.getElementById('prevBtn') as HTMLButtonElement;
  
  if (prevBtn) prevBtn.disabled = currentInstructionIndex === 0;
  
  if (currentInstructionIndex === activeDirections.instructions.length - 1) {
    nextBtn.textContent = 'Arrive';
  } else {
    nextBtn.textContent = 'Next Step';
  }
}

function hideSheet() {
  document.getElementById('bottomSheet')!.style.display = 'none';
}

(window as any).clearSelection = clearSelection;
(window as any).clearNavigation = clearNavigation;
(window as any).hideSheet = hideSheet;
(window as any).showDirections = showDirections;
(window as any).nextInstruction = nextInstruction;
(window as any).prevInstruction = prevInstruction;
(window as any).toggleSheet = toggleSheet;
(window as any).updateStoreList = updateStoreList;

function createTopBar() {
  const topBar = document.createElement('div');
  topBar.id = 'topBar';
  topBar.style.cssText = 'position:fixed;top:0;left:0;right:0;height:56px;background:white;z-index:1000;box-shadow:0 2px 4px rgba(0,0,0,0.1);display:none;align-items:center;padding:0 16px;';
  topBar.innerHTML = `
    <div style="position:relative;flex:1;">
      <input id="topSearchInput" placeholder="Search" style="width:100%;padding:8px 12px;border:1px solid #dadce0;border-radius:24px;font-size:14px;" />
      <div id="topSearchDropdown" style="display:none;position:absolute;top:100%;left:0;right:0;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);margin-top:8px;max-height:300px;overflow-y:auto;z-index:10;"></div>
    </div>
    <button id="menuBtn" style="margin-left:12px;background:none;border:none;font-size:24px;cursor:pointer;">☰</button>
  `;
  document.body.appendChild(topBar);
}

function createBottomTabBar() {
  const tabBar = document.createElement('div');
  tabBar.id = 'bottomTabBar';
  tabBar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:80px;background:white;z-index:1000;box-shadow:0 -2px 4px rgba(0,0,0,0.1);display:none;justify-content:space-around;align-items:center;';
  tabBar.innerHTML = `
    <button data-category="facility" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:10px;">🚶<br>Facility</button>
    <button data-category="food" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:10px;">🍴<br>Food</button>
    <button data-category="leisure" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:10px;">🎫<br>Leisure</button>
    <button data-category="shops" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:10px;">🛍️<br>Shops</button>
    <button data-category="promos" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:10px;">%<br>Promos</button>
    <button data-category="events" style="display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-size:10px;">📅<br>Events</button>
  `;
  document.body.appendChild(tabBar);
}

function createStoreDetailCard() {
  const card = document.createElement('div');
  card.id = 'storeDetailCard';
  card.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:white;border-radius:16px 16px 0 0;padding:20px;padding-bottom:100px;box-shadow:0 -4px 12px rgba(0,0,0,0.15);z-index:999;max-height:85vh;overflow-y:auto;display:none;';
  document.body.appendChild(card);
}

function createUIToggle() {
  const toggle = document.createElement('button');
  toggle.id = 'uiToggle';
  toggle.textContent = 'Switch UI';
  toggle.style.cssText = 'position:fixed;top:70px;right:16px;z-index:10001;padding:8px 16px;background:#1a73e8;color:white;border:none;border-radius:20px;cursor:pointer;';
  toggle.addEventListener('click', toggleUIMode);
  document.body.appendChild(toggle);
}

function toggleUIMode() {
  uiMode = uiMode === 'legacy' ? 'new' : 'legacy';
  
  if (uiMode === 'new') {
    document.getElementById('bottomSheet')!.style.display = 'none';
    document.getElementById('topBar')!.style.display = 'flex';
    document.getElementById('bottomTabBar')!.style.display = 'flex';
  } else {
    document.getElementById('bottomSheet')!.style.display = 'block';
    document.getElementById('topBar')!.style.display = 'none';
    document.getElementById('bottomTabBar')!.style.display = 'none';
    document.getElementById('storeDetailCard')!.style.display = 'none';
    document.getElementById('topSearchDropdown')!.style.display = 'none';
  }
}

let isWireTopSearchInitialized = false;
function wireTopSearch() {
  if (isWireTopSearchInitialized) {
    console.warn('[WARN] wireTopSearch already initialized, skipping');
    return;
  }
  isWireTopSearchInitialized = true;
  
  const input = document.getElementById('topSearchInput') as HTMLInputElement;
  const dropdown = document.getElementById('topSearchDropdown')!;
  if (!input) return;
  
  // Single delegated event listener on dropdown (prevents memory leaks)
  dropdown.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest('.search-dropdown-item');
    if (item) {
      const storeId = item.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) {
        dropdown.style.display = 'none';
        input.value = '';
        selectStore(store);
      }
    }
  });
  
  input.addEventListener('focus', () => {
    searchResults = stores;
    showSearchDropdown();
  });
  
  let searchTimeout: any;
  input.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = (e.target as HTMLInputElement).value;
      if (query.trim()) {
        searchResults = stores.filter(s => 
          s.name.toLowerCase().includes(query.toLowerCase())
        );
      } else {
        searchResults = stores;
      }
      showSearchDropdown();
    }, 150);
  });
  
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      dropdown.style.display = 'none';
    }
  });
}

function showSearchDropdown() {
  const dropdown = document.getElementById('topSearchDropdown')!;
  const MAX_RESULTS = 50;
  
  if (searchResults.length === 0) {
    dropdown.innerHTML = '<div style="padding:16px;text-align:center;color:#5f6368;">No stores found</div>';
    dropdown.style.display = 'block';
    return;
  }
  
  const limitedResults = searchResults.slice(0, MAX_RESULTS);
  
  dropdown.innerHTML = limitedResults.map(store => `
    <div class="search-dropdown-item" data-id="${store.id}" style="
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #e8eaed;
    ">
      <div style="font-weight: 500;">${store.name}</div>
      <div style="font-size: 12px; color: #5f6368;">${store.floor?.name || 'Floor G'}</div>
    </div>
  `).join('');
  
  if (searchResults.length > MAX_RESULTS) {
    dropdown.innerHTML += `<div style="padding:12px;text-align:center;color:#5f6368;font-size:12px;">
      Showing ${MAX_RESULTS} of ${searchResults.length} results
    </div>`;
  }
  
  dropdown.style.display = 'block';
}

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

function showStoreListOverlay() {
  const card = document.getElementById('storeDetailCard')!;
  card.style.display = 'block';
  
  if (searchResults.length === 0) {
    card.innerHTML = '<div style="padding:32px;text-align:center;color:#5f6368;">No stores found</div>';
    return;
  }
  
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

function showStoreDetailInCard(store: any) {
  const card = document.getElementById('storeDetailCard')!;
  
  card.style.display = 'none';
  
  const hasCategories = store.categories && store.categories.length > 0;
  const hasHours = store.operationHours;
  const hasImages = store.images && store.images.length > 0;
  const hasLogo = store.logoImage?.url;
  const hasDescription = store.description;
  const hasPhone = store.phone;
  const hasWebsite = store.website?.href;
  
  let html = `
    <div class="detail-drag-handle" style="padding:8px 0;cursor:grab;user-select:none;-webkit-user-select:none;text-align:center;">
      <div style="width:40px;height:4px;background:#dadce0;border-radius:2px;margin:0 auto;"></div>
    </div>
    <button onclick="closeStoreDetail()" style="position:absolute;top:20px;right:12px;background:none;border:none;font-size:24px;cursor:pointer;z-index:10;">×</button>
  `;
  
  if (hasImages) {
    html += `<img src="${store.images[0].url}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px;pointer-events:none;" />`;
  } else if (hasLogo) {
    html += `<img src="${hasLogo}" style="width:100%;height:200px;object-fit:contain;border-radius:8px;margin-bottom:16px;background:#f8f9fa;padding:20px;pointer-events:none;" />`;
  }
  
  html += `
    <div style="display:flex;align-items:start;gap:12px;margin-bottom:16px;pointer-events:none;">
      <div style="width:48px;height:48px;border-radius:24px;background:#1a73e8;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${icons.location}</div>
      <div style="flex:1;">
        <div style="font-size:20px;font-weight:500;color:#202124;">${store.name}</div>
        <div style="font-size:14px;color:#5f6368;margin-top:4px;">${store.floor?.name || 'Store'}</div>
      </div>
    </div>
  `;
  
  if (hasHours) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    const todayHours = store.operationHours[today];
    if (todayHours) {
      html += `
        <div style="margin:16px 0;">
          <div style="font-weight:500;margin-bottom:8px;font-size:14px;">Hours</div>
          <div style="font-size:14px;color:#202124;">${todayHours.open} - ${todayHours.close}</div>
        </div>
      `;
    }
  }
  
  if (hasCategories) {
    html += `
      <div style="margin:16px 0;">
        <div style="font-weight:500;margin-bottom:8px;font-size:14px;">Categories</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${store.categories.map((cat: any) => `<span style="background:#f1f3f4;color:#202124;padding:6px 12px;border-radius:16px;font-size:13px;">${cat.name}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  if (hasDescription) {
    html += `<p style="color:#5f6368;font-size:14px;line-height:1.5;margin:16px 0;">${hasDescription}</p>`;
  }
  
  if (hasWebsite) {
    html += `<a href="${hasWebsite}" target="_blank" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:12px;text-decoration:none;">🔗 Visit Website</a>`;
  }
  
  if (hasPhone) {
    html += `<a href="tel:${hasPhone}" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:16px;text-decoration:none;">📞 ${hasPhone}</a>`;
  }
  
  html += `
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button onclick="refreshStore()" style="flex:1;padding:10px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">${icons.refresh}</button>
      <button onclick="shareStore()" style="flex:1;padding:10px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">${icons.share}</button>
    </div>
    <button class="btn-primary" onclick="showDirectionsInNewUIMode('${store.id}')" style="margin-top:12px;width:100%;">Directions</button>
  `;
  
  card.innerHTML = html;
  
  requestAnimationFrame(() => {
    card.style.display = 'block';
    setupCardDragHandlers();
  });
  
  selectStore(store);
}

let cardStartY = 0;
let cardCurrentHeight = 0;
let cardIsDragging = false;

function setupCardDragHandlers() {
  const card = document.getElementById('storeDetailCard')!;
  const dragHandle = card.querySelector('.detail-drag-handle') as HTMLElement;
  
  if (!dragHandle) return;
  
  dragHandle.addEventListener('touchstart', (e) => {
    cardStartY = e.touches[0].clientY;
    cardCurrentHeight = card.offsetHeight;
    cardIsDragging = true;
    card.style.transition = 'none';
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!cardIsDragging) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - cardStartY;
    const newHeight = cardCurrentHeight - deltaY;
    const vh = window.innerHeight / 100;
    
    if (newHeight >= 30 * vh && newHeight <= 85 * vh) {
      card.style.maxHeight = `${newHeight}px`;
    }
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (!cardIsDragging) return;
    cardIsDragging = false;
    card.style.transition = 'max-height 0.3s ease';
    
    const vh = window.innerHeight / 100;
    const currentHeightVh = card.offsetHeight / vh;
    
    if (currentHeightVh < 40) {
      card.style.maxHeight = '30vh';
    } else if (currentHeightVh < 65) {
      card.style.maxHeight = '50vh';
    } else {
      card.style.maxHeight = '85vh';
    }
  });
}

function closeStoreDetail() {
  document.getElementById('storeDetailCard')!.style.display = 'none';
  if (selectedPolygon) {
    try {
      mapView.updateState(selectedPolygon, { color: 'initial' });
    } catch (err) {}
    selectedPolygon = null;
  }
  selectedStore = null;
  mapView.Camera.setScreenOffsets({ bottom: 0, type: 'pixel' });
}

(window as any).closeStoreDetail = closeStoreDetail;

// Phase 4: Navigation in New UI
function showDirectionsInNewUIMode(storeId: string) {
  const store = stores.find(s => s.id === storeId);
  if (!store) return;
  
  const card = document.getElementById('storeDetailCard')!;
  card.innerHTML = `
    <h3>Directions to ${store.name}</h3>
    <div style="margin: 16px 0;">
      <label>FROM</label>
      <select id="fromSelectNewUI" style="width:100%;padding:8px;border:1px solid #dadce0;border-radius:8px;">
        ${stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select>
    </div>
    <div style="margin: 16px 0;">
      <label>TO</label>
      <input value="${store.name}" readonly style="width:100%;padding:8px;border:1px solid #dadce0;border-radius:8px;background:#f8f9fa;" />
    </div>
    <button id="startNavBtnNewUI" class="btn-primary">Start</button>
  `;
  
  document.getElementById('startNavBtnNewUI')!.addEventListener('click', async () => {
    const fromId = (document.getElementById('fromSelectNewUI') as HTMLSelectElement).value;
    navStartPoint = stores.find(s => s.id === fromId);
    navEndPoint = store;
    await startNavigationNewUIMode();
  });
}

async function startNavigationNewUIMode() {
  if (!navStartPoint || !navEndPoint) return;
  
  const directions = await mapView.getDirections(navStartPoint, navEndPoint);
  if (!directions) return;
  
  activeDirections = directions;
  await mapView.Navigation.draw(directions, {
    pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5 },
    markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' },
    setMapToDeparture: false,
    animatePathDrawing: true
  });
  
  currentInstructionIndex = 0;
  showActiveNavigationNewUIMode();
}

function showActiveNavigationNewUIMode() {
  if (!activeDirections) return;
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
      <button onclick="prevInstructionNewUIMode()" class="btn-secondary" style="flex: 1;">Previous</button>
      <button onclick="nextInstructionNewUIMode()" class="btn-primary" style="flex: 1;">Next</button>
    </div>
    <button onclick="endNavigationNewUIMode()" class="btn-secondary" style="margin-top: 8px;">End Route</button>
  `;
}

function prevInstructionNewUIMode() {
  if (!activeDirections || currentInstructionIndex <= 0) return;
  currentInstructionIndex--;
  showActiveNavigationNewUIMode();
}

function nextInstructionNewUIMode() {
  if (!activeDirections) return;
  if (currentInstructionIndex < activeDirections.instructions.length - 1) {
    currentInstructionIndex++;
    showActiveNavigationNewUIMode();
  } else {
    showArrivalScreenNewUIMode();
  }
}

function showArrivalScreenNewUIMode() {
  const card = document.getElementById('storeDetailCard')!;
  card.innerHTML = `
    <div style="text-align: center; padding: 32px;">
      <div style="font-size: 48px;">🎯</div>
      <h2>You've Arrived!</h2>
      <p>${navEndPoint.name}</p>
      <button onclick="endNavigationNewUIMode()" class="btn-primary">Done</button>
    </div>
  `;
}

function endNavigationNewUIMode() {
  mapView.Navigation.clear();
  mapView.Navigation.clearHighlightedPathSection();
  activeDirections = null;
  currentInstructionIndex = 0;
  navStartPoint = null;
  navEndPoint = null;
  closeStoreDetail();
}

(window as any).showDirectionsInNewUIMode = showDirectionsInNewUIMode;
(window as any).prevInstructionNewUIMode = prevInstructionNewUIMode;
(window as any).nextInstructionNewUIMode = nextInstructionNewUIMode;
(window as any).endNavigationNewUIMode = endNavigationNewUIMode;

function showDirectionsInNewUI(storeId: string) {
  const store = stores.find(s => s.id === storeId);
  if (!store) return;
  
  const card = document.getElementById('storeDetailCard')!;
  card.innerHTML = `
    <h3>Directions to ${store.name}</h3>
    <div style="margin: 16px 0;">
      <label>FROM</label>
      <select id="fromSelect" style="width:100%;padding:8px;border:1px solid #dadce0;border-radius:8px;">
        ${stores.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
      </select>
    </div>
    <div style="margin: 16px 0;">
      <label>TO</label>
      <input value="${store.name}" readonly style="width:100%;padding:8px;border:1px solid #dadce0;border-radius:8px;background:#f8f9fa;" />
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

async function startNavigationInNewUI() {
  if (!navStartPoint || !navEndPoint) return;
  
  const directions = await mapView.getDirections(navStartPoint, navEndPoint);
  if (!directions) return;
  
  activeDirections = directions;
  await mapView.Navigation.draw(directions, {
    pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5 },
    markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' },
    setMapToDeparture: false,
    animatePathDrawing: true
  });
  
  currentInstructionIndex = 0;
  showActiveNavigationInNewUI();
}

function showActiveNavigationInNewUI() {
  if (!activeDirections) return;
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

function prevInstructionNewUI() {
  if (!activeDirections || currentInstructionIndex <= 0) return;
  currentInstructionIndex--;
  showActiveNavigationInNewUI();
}

function nextInstructionNewUI() {
  if (!activeDirections) return;
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
  mapView.Navigation.clearHighlightedPathSection();
  activeDirections = null;
  currentInstructionIndex = 0;
  navStartPoint = null;
  navEndPoint = null;
  closeStoreDetail();
}

(window as any).showDirectionsInNewUI = showDirectionsInNewUI;
(window as any).prevInstructionNewUI = prevInstructionNewUI;
(window as any).nextInstructionNewUI = nextInstructionNewUI;
(window as any).endNavigationNewUI = endNavigationNewUI;

let sheetStartY = 0;
let sheetCurrentHeight = 0;
let sheetIsDragging = false;

function setupMobileUI() {
  const uiContainer = document.createElement('div');
  uiContainer.innerHTML = `
    <div id="bottomSheet" class="bottom-sheet">
      <div class="sheet-header" id="sheetHeader">
        <div style="width:100%;display:flex;justify-content:center;">
          <div style="width:40px;height:4px;background:#dadce0;border-radius:2px;"></div>
        </div>
      </div>
      <div style="padding:8px 16px;background:#f8f9fa;border-bottom:1px solid #e8eaed;">
        <div style="position:relative;">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#5f6368;">${icons.search}</span>
          <input id="searchInput" style="width:100%;padding:10px 40px 10px 40px;border:1px solid #dadce0;border-radius:12px;font-size:14px;outline:none;" type="text" placeholder="Search stores..." />
          <button id="filterBtn" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#5f6368;cursor:pointer;padding:4px;">${icons.filter}</button>
          <div id="searchResults" class="search-results" style="display:none;"></div>
        </div>
      </div>
      <div style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e8eaed;">
        <div id="categoryPills" style="display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
          <style>#categoryPills::-webkit-scrollbar{display:none;}</style>
        </div>
      </div>
      <div style="padding:12px 16px;background:#f8f9fa;border-bottom:1px solid #e8eaed;">
        <div id="storeCardsRow" style="display:flex;gap:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
          <style>#storeCardsRow::-webkit-scrollbar{display:none;}</style>
        </div>
      </div>
      <div id="sheetContent" class="sheet-content"></div>
    </div>
  `;
  document.body.appendChild(uiContainer);

  const sheet = document.getElementById('bottomSheet')!;
  const header = document.getElementById('sheetHeader')!;
  const searchSection = document.querySelector('#searchInput')?.parentElement?.parentElement as HTMLElement;
  const categorySection = document.getElementById('categoryPills')?.parentElement as HTMLElement;
  const cardsSection = document.getElementById('storeCardsRow')?.parentElement as HTMLElement;
  
  const dragElements = [header, searchSection, categorySection, cardsSection].filter(el => el);
  
  dragElements.forEach(element => {
    element.addEventListener('touchstart', (e) => {
      sheetStartY = e.touches[0].clientY;
      sheetCurrentHeight = sheet.offsetHeight;
      sheetIsDragging = true;
      sheet.style.transition = 'none';
    });
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!sheetIsDragging) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - sheetStartY;
    const newHeight = sheetCurrentHeight - deltaY;
    const vh = window.innerHeight / 100;
    
    if (newHeight >= 20 * vh && newHeight <= 60 * vh) {
      sheet.style.maxHeight = `${newHeight}px`;
      // Update camera offset as sheet is dragged
      if (selectedStore) {
        mapView.Camera.setScreenOffsets({ bottom: newHeight, type: 'pixel' });
      }
    }
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (!sheetIsDragging) return;
    sheetIsDragging = false;
    sheet.style.transition = 'max-height 0.3s ease';
    
    const vh = window.innerHeight / 100;
    const currentHeightVh = sheet.offsetHeight / vh;
    
    if (currentHeightVh < 30) {
      sheet.style.maxHeight = '20vh';
    } else if (currentHeightVh < 50) {
      sheet.style.maxHeight = '70vh';
      if (sheet.classList.contains('expanded')) {
        sheet.classList.remove('expanded');
        const expandIcon = document.getElementById('expandIcon');
        const allSteps = document.getElementById('allSteps');
        if (expandIcon) expandIcon.textContent = '▲';
        if (allSteps) allSteps.style.display = 'none';
      }
    } else {
      sheet.style.maxHeight = '85vh';
      if (!sheet.classList.contains('expanded') && document.getElementById('expandIcon')) {
        sheet.classList.add('expanded');
        const expandIcon = document.getElementById('expandIcon');
        const allSteps = document.getElementById('allSteps');
        if (expandIcon) expandIcon.textContent = '▼';
        if (allSteps) allSteps.style.display = 'block';
      }
    }
  });

  const searchInput = document.getElementById('searchInput')!;
  const searchResultsDiv = document.getElementById('searchResults')!;
  
  const filterBtn = document.getElementById('filterBtn')!;
  filterBtn.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;max-height:80vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3 style="margin:0;font-size:18px;">Filter & Sort</h3>
          <button onclick="this.closest('div[style*=fixed]').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#5f6368;">&times;</button>
        </div>
        <div style="margin-bottom:16px;">
          <label style="display:block;font-weight:500;margin-bottom:8px;font-size:14px;">Categories</label>
          ${allCategories.map(cat => `
            <label style="display:flex;align-items:center;gap:8px;padding:8px;cursor:pointer;">
              <input type="checkbox" class="category-filter" value="${cat}" />
              <span style="font-size:14px;">${cat}</span>
            </label>
          `).join('')}
        </div>
        <button onclick="applyFilters();this.closest('div[style*=fixed]').remove()" class="btn-primary">Apply Filters</button>
      </div>
    `;
    document.body.appendChild(modal);
  });
  
  (window as any).applyFilters = () => {
    const checked = Array.from(document.querySelectorAll('.category-filter:checked')).map((el: any) => el.value);
    if (checked.length === 0) {
      searchResults = stores;
      activeCategory = 'all';
    } else {
      searchResults = stores.filter((s: any) => 
        s.categories?.some((c: any) => checked.includes(c.name))
      );
    }
    renderCategoryPills();
    renderStoreCards();
    updateStoreList();
  };
  
  renderCategoryPills();
  renderStoreCards();
  
  searchInput.addEventListener('input', (e) => {
    const query = ((e.target as HTMLInputElement).value);
    if (query.trim()) {
      const results = stores.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
      if (results.length > 0) {
        searchResultsDiv.innerHTML = results.map(s => `
          <div class="search-result-item" data-id="${s.id}">${s.name}</div>
        `).join('');
        searchResultsDiv.style.display = 'block';
        searchResultsDiv.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', () => {
            const store = stores.find(st => st.id === item.getAttribute('data-id'));
            if (store) {
              selectStore(store);
              (searchInput as HTMLInputElement).value = '';
              searchResultsDiv.style.display = 'none';
            }
          });
        });
      } else {
        searchResultsDiv.style.display = 'none';
      }
    } else {
      searchResultsDiv.style.display = 'none';
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target as Node) && !searchResultsDiv.contains(e.target as Node)) {
      searchResultsDiv.style.display = 'none';
    }
  });

  attachStoreListeners();
  updateStoreList();
}

function updateStoreList() {
  const content = document.getElementById('sheetContent')!;
  const sheet = document.getElementById('bottomSheet')!;
  sheet.style.display = 'block';

  if (selectedStore) {
    sheet.style.maxHeight = '85vh';
    
    // Hide search/category/cards sections when showing store details
    const searchSection = document.getElementById('searchInput')?.parentElement?.parentElement;
    const categorySection = document.getElementById('categoryPills')?.parentElement;
    const cardsSection = document.getElementById('storeCardsRow')?.parentElement;
    if (searchSection) searchSection.style.display = 'none';
    if (categorySection) categorySection.style.display = 'none';
    if (cardsSection) cardsSection.style.display = 'none';
    
    // Give full height to content
    content.classList.add('full-height');
    
    const hasCategories = selectedStore.categories && selectedStore.categories.length > 0;
    const hasHours = selectedStore.operationHours;
    const hasImages = selectedStore.images && selectedStore.images.length > 0;
    const hasLogo = selectedStore.logoImage?.url;
    const hasDescription = selectedStore.description;
    const hasPhone = selectedStore.phone;
    const hasWebsite = selectedStore.website?.href;
    
    let html = `<div class="directions-card" style="padding-top:0;">`;
    
    html += `<div class="detail-drag-area" style="padding:20px 16px 12px;cursor:grab;user-select:none;-webkit-user-select:none;">`;
    
    if (hasImages) {
      html += `<img src="${selectedStore.images[0].url}" class="store-detail-image" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px;pointer-events:none;" />`;
    } else if (hasLogo) {
      html += `<img src="${hasLogo}" class="store-detail-image" style="width:100%;height:200px;object-fit:contain;border-radius:8px;margin-bottom:16px;background:#f8f9fa;padding:20px;pointer-events:none;" />`;
    }
    
    html += `
      <div class="directions-header" style="pointer-events:none;">
        <div class="directions-icon" style="background:#1a73e8;">${icons.location}</div>
        <div class="directions-info">
          <div style="font-size:20px;font-weight:500;color:#202124;">${selectedStore.name}</div>
          <div style="font-size:14px;color:#5f6368;margin-top:4px;">${selectedStore.floor?.name || 'Store'}</div>
        </div>
      </div>
    </div>`;
    
    setTimeout(() => {
      const dragArea = content.querySelector('.detail-drag-area') as HTMLElement;
      if (dragArea) {
        dragArea.addEventListener('touchstart', (e) => {
          sheetStartY = e.touches[0].clientY;
          sheetCurrentHeight = sheet.offsetHeight;
          sheetIsDragging = true;
          sheet.style.transition = 'none';
        });
      }
    }, 0);
    
    
    if (hasHours) {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = days[now.getDay()];
      const todayHours = selectedStore.operationHours[today];
      
      if (todayHours) {
        html += `
          <div style="margin:16px 0;">
            <div style="font-weight:500;margin-bottom:8px;font-size:14px;">Hours</div>
            <div style="font-size:14px;color:#202124;">${todayHours.open} - ${todayHours.close}</div>
          </div>
        `;
      }
    }
    
    if (hasCategories) {
      html += `
        <div style="margin:16px 0;">
          <div style="font-weight:500;margin-bottom:8px;font-size:14px;">Categories</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            ${selectedStore.categories.map((cat: any) => `
              <span style="background:#f1f3f4;color:#202124;padding:6px 12px;border-radius:16px;font-size:13px;">${cat.name}</span>
            `).join('')}
          </div>
        </div>
      `;
    }
    
    if (hasDescription) {
      html += `<p style="color:#5f6368;font-size:14px;line-height:1.5;margin:16px 0;">${hasDescription}</p>`;
    }
    
    if (hasWebsite) {
      html += `<a href="${hasWebsite}" target="_blank" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:12px;text-decoration:none;">🔗 Visit Website</a>`;
    }
    
    if (hasPhone) {
      html += `<a href="tel:${hasPhone}" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:16px;text-decoration:none;">📞 ${hasPhone}</a>`;
    }
    
    html += `
      <div style="display:flex;gap:12px;margin-top:16px;">
        <button onclick="refreshStore()" style="flex:1;padding:10px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
          ${icons.refresh}
        </button>
        <button onclick="shareStore()" style="flex:1;padding:10px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;">
          ${icons.share}
        </button>
      </div>
      <button class="btn-primary" onclick="showDirections()" style="margin-top:12px;">Directions</button>
      <button class="btn-secondary" style="margin-top:8px;" onclick="clearSelection()">Close</button>
    </div>`;
    
    content.innerHTML = html;
  } else {
    // Show search/category/cards sections when showing store list
    const searchSection = document.getElementById('searchInput')?.parentElement?.parentElement;
    const categorySection = document.getElementById('categoryPills')?.parentElement;
    const cardsSection = document.getElementById('storeCardsRow')?.parentElement;
    if (searchSection) searchSection.style.display = 'block';
    if (categorySection) categorySection.style.display = 'block';
    if (cardsSection) cardsSection.style.display = 'block';
    
    // Remove full height from content
    content.classList.remove('full-height');
    
    sheet.style.maxHeight = '70vh';
    content.innerHTML = searchResults.map(store => `
      <div class="store-card" data-id="${store.id}">
        <div class="store-icon">${icons.store}</div>
        <div class="store-info">
          <div class="store-name">${store.name}</div>
          <div class="store-type">${store.floor?.name || 'Store'}</div>
        </div>
      </div>
    `).join('');
    attachStoreListeners();
  }
}

(window as any).refreshStore = () => {
  if (selectedStore) {
    updateStoreList();
  }
};

(window as any).shareStore = () => {
  if (selectedStore && navigator.share) {
    navigator.share({
      title: selectedStore.name,
      text: `Check out ${selectedStore.name}`,
      url: window.location.href
    }).catch(() => {});
  } else if (selectedStore) {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  }
};

function attachStoreListeners() {
  const content = document.getElementById('sheetContent');
  if (!content) return;
  
  content.onclick = (e) => {
    const card = (e.target as HTMLElement).closest('.store-card');
    if (card) {
      const storeId = card.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) selectStore(store);
    }
  };
}

function renderCategoryPills() {
  const container = document.getElementById('categoryPills');
  if (!container) return;
  
  const categories = ['all', ...allCategories.slice(0, 5)];
  
  container.innerHTML = categories.map(cat => `
    <button class="category-pill ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
      ${cat === 'all' ? 'All' : cat}
    </button>
  `).join('');
  
  container.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category')!;
      activeCategory = category;
      
      if (category === 'all') {
        searchResults = stores;
      } else {
        searchResults = stores.filter((s: any) => 
          s.categories?.some((c: any) => c.name === category)
        );
      }
      
      renderCategoryPills();
      renderStoreCards();
      updateStoreList();
    });
  });
}

function renderStoreCards() {
  const container = document.getElementById('storeCardsRow');
  if (!container) return;
  
  const featured = searchResults.slice(0, 5);
  
  container.innerHTML = featured.map(store => {
    const logo = store.logoImage?.url || store.images?.[0]?.url || '';
    return `
      <div class="store-card-horizontal" data-id="${store.id}">
        ${logo ? `<img src="${logo}" alt="${store.name}" style="width:50px;height:50px;object-fit:contain;border-radius:8px;" />` : `<div style="width:50px;height:50px;background:#f1f3f4;border-radius:8px;margin:0 auto;display:flex;align-items:center;justify-content:center;color:#5f6368;font-size:20px;">${icons.store}</div>`}
        <div style="font-weight:500;font-size:12px;margin:2px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${store.name}</div>
        <div style="font-size:11px;color:#5f6368;">${store.floor?.name || store.floor?.shortName || 'L1'}</div>
      </div>
    `;
  }).join('');
  
  container.querySelectorAll('.store-card-horizontal').forEach(card => {
    card.addEventListener('click', () => {
      const storeId = card.getAttribute('data-id');
      const store = stores.find((s: any) => s.id === storeId);
      if (store) selectStore(store);
    });
  });
}

// Desktop UI Functions
function setupDesktopUI() {
  const sidebar = document.createElement('div');
  sidebar.id = 'desktopSidebar';
  sidebar.style.cssText = `position:fixed;left:0;top:0;width:380px;height:100vh;background:white;box-shadow:2px 0 16px rgba(0,0,0,0.1);z-index:1000;display:flex;flex-direction:column;overflow:hidden;`;
  
  sidebar.innerHTML = `
    <div style="padding:20px;border-bottom:1px solid #e8eaed;">
      <div style="position:relative;">
        <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#5f6368;">${icons.search}</span>
        <input id="desktopSearchInput" type="text" placeholder="Search the mall..." style="width:100%;padding:12px 48px;border:none;border-radius:24px;background:#f2f2f2;font-size:14px;outline:none;" />
        <button id="desktopFilterBtn" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#5f6368;">${icons.filter}</button>
        <div id="desktopSearchResults" style="display:none;position:absolute;top:100%;left:0;right:0;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);margin-top:8px;max-height:300px;overflow-y:auto;z-index:10;"></div>
      </div>
    </div>
    <div style="padding:16px;border-bottom:1px solid #e8eaed;">
      <div id="desktopCategoryPills" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
    </div>
    <div style="padding:16px;border-bottom:1px solid #e8eaed;overflow-x:auto;">
      <div id="desktopStoreCards" style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch;"></div>
    </div>
    <div id="desktopStoreList" style="flex:1;overflow-y:auto;padding:16px;"></div>
  `;
  
  document.body.appendChild(sidebar);
  
  const mapContainer = document.getElementById('mappedin-map')!;
  mapContainer.style.marginLeft = '380px';
  mapContainer.style.width = 'calc(100% - 460px)';
  
  renderDesktopCategories();
  renderDesktopStoreCards();
  renderDesktopStoreList();
  attachDesktopEventHandlers();
  setupDesktopControls();
}

function renderDesktopCategories() {
  const container = document.getElementById('desktopCategoryPills');
  if (!container) return;
  const categories = ['all', ...allCategories.slice(0, 5)];
  container.innerHTML = categories.map(cat => `
    <button class="desktop-category-pill ${cat === activeCategory ? 'active' : ''}" data-category="${cat}" style="padding:8px 16px;border-radius:20px;border:none;background:${cat === activeCategory ? '#1a73e8' : '#f1f3f4'};color:${cat === activeCategory ? 'white' : '#202124'};font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;">${cat === 'all' ? 'All' : cat}</button>
  `).join('');
}

function renderDesktopStoreCards() {
  const container = document.getElementById('desktopStoreCards');
  if (!container) return;
  const featured = searchResults.slice(0, 10);
  container.innerHTML = featured.map(store => {
    const logo = store.logoImage?.url || store.images?.[0]?.url;
    return `
      <div class="desktop-store-card" data-id="${store.id}" style="min-width:140px;padding:16px;background:white;border:1px solid #e8eaed;border-radius:12px;text-align:center;cursor:pointer;transition:all 0.2s;">
        ${logo ? `<img src="${logo}" style="width:80px;height:80px;object-fit:contain;border-radius:8px;margin-bottom:12px;" />` : `<div style="width:80px;height:80px;background:#f1f3f4;border-radius:8px;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#5f6368;">${icons.store}</div>`}
        <div style="font-weight:500;font-size:14px;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${store.name}</div>
        <div style="font-size:12px;color:#5f6368;">${store.floor?.shortName || 'L1'}</div>
      </div>
    `;
  }).join('');
}

function renderDesktopStoreList() {
  const container = document.getElementById('desktopStoreList');
  if (!container) return;
  container.innerHTML = searchResults.map(store => `
    <div class="desktop-store-item" data-id="${store.id}" style="padding:12px;margin-bottom:8px;border-radius:8px;background:${selectedStore?.id === store.id ? '#e8f0fe' : 'white'};border:1px solid ${selectedStore?.id === store.id ? '#1a73e8' : '#e8eaed'};cursor:pointer;transition:all 0.2s;">
      <div style="font-weight:500;font-size:14px;color:#202124;margin-bottom:4px;">${store.name}</div>
      <div style="font-size:12px;color:#5f6368;">${store.floor?.name || 'Lower Level'}</div>
    </div>
  `).join('');
}

function attachDesktopEventHandlers() {
  const searchInput = document.getElementById('desktopSearchInput') as HTMLInputElement;
  const searchResultsDiv = document.getElementById('desktopSearchResults')!;
  
  searchInput?.addEventListener('input', (e) => {
    const query = (e.target as HTMLInputElement).value;
    if (query.trim()) {
      const results = stores.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));
      if (results.length > 0) {
        searchResultsDiv.innerHTML = results.map(s => `<div class="desktop-search-item" data-id="${s.id}" style="padding:12px 16px;cursor:pointer;border-bottom:1px solid #e8eaed;font-size:14px;color:#202124;">${s.name}</div>`).join('');
        searchResultsDiv.style.display = 'block';
      } else {
        searchResultsDiv.style.display = 'none';
      }
    } else {
      searchResultsDiv.style.display = 'none';
    }
  });
  
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.closest('.desktop-category-pill')) {
      const btn = target.closest('.desktop-category-pill') as HTMLElement;
      const category = btn.getAttribute('data-category')!;
      activeCategory = category;
      searchResults = category === 'all' ? stores : stores.filter(s => s.categories?.some((c: any) => c.name === category));
      renderDesktopCategories();
      renderDesktopStoreCards();
      renderDesktopStoreList();
      attachDesktopEventHandlers();
    } else if (target.closest('.desktop-store-card')) {
      const card = target.closest('.desktop-store-card') as HTMLElement;
      const store = stores.find(s => s.id === card.getAttribute('data-id'));
      if (store) selectStore(store);
    } else if (target.closest('.desktop-store-item')) {
      const item = target.closest('.desktop-store-item') as HTMLElement;
      const store = stores.find(s => s.id === item.getAttribute('data-id'));
      if (store) selectStore(store);
    } else if (target.closest('.desktop-search-item')) {
      const item = target.closest('.desktop-search-item') as HTMLElement;
      const store = stores.find(s => s.id === item.getAttribute('data-id'));
      if (store) {
        selectStore(store);
        searchInput.value = '';
        searchResultsDiv.style.display = 'none';
      }
    }
  });
}

function setupDesktopControls() {
  const controls = document.createElement('div');
  controls.id = 'desktopControls';
  controls.style.cssText = `position:fixed;right:20px;top:50%;transform:translateY(-50%);z-index:1000;display:flex;flex-direction:column;gap:12px;`;
  
  controls.innerHTML = `
    ${floors.map(floor => `<button class="desktop-floor-btn" data-floor-id="${floor.id}" style="width:56px;height:56px;border-radius:28px;background:${floor.id === currentFloor?.id ? '#1a73e8' : 'white'};color:${floor.id === currentFloor?.id ? 'white' : '#202124'};border:1px solid #dadce0;font-weight:600;font-size:14px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;">${floor.shortName || floor.name}</button>`).join('')}
    <div style="height:1px;background:#e8eaed;margin:8px 0;"></div>
    <button id="desktopFullscreen" class="desktop-control-btn" title="Fullscreen" style="width:56px;height:56px;border-radius:28px;background:white;border:1px solid #dadce0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5f6368;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;">${icons.fullscreen}</button>
    <button id="desktopZoomIn" class="desktop-control-btn" title="Zoom In" style="width:56px;height:56px;border-radius:28px;background:white;border:1px solid #dadce0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5f6368;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;">${icons.zoomIn}</button>
    <button id="desktopZoomOut" class="desktop-control-btn" title="Zoom Out" style="width:56px;height:56px;border-radius:28px;background:white;border:1px solid #dadce0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5f6368;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.2s;">${icons.zoomOut}</button>
  `;
  
  document.body.appendChild(controls);
  
  document.querySelectorAll('.desktop-floor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const floorId = btn.getAttribute('data-floor-id');
      const floor = floors.find(f => f.id === floorId);
      if (floor) {
        mapView.setFloor(floor);
        currentFloor = floor;
        setupDesktopControls();
      }
    });
  });
  
  document.getElementById('desktopFullscreen')?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });
  
  document.getElementById('desktopZoomIn')?.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoomLevel;
    mapView.Camera.animateTo({ zoomLevel: currentZoom + 1 });
  });
  
  document.getElementById('desktopZoomOut')?.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoomLevel;
    mapView.Camera.animateTo({ zoomLevel: currentZoom - 1 });
  });
}

function showDesktopDirections() {
  const store = selectedStore;
  if (!store) return;
  
  const sidebar = document.getElementById('desktopSidebar');
  if (!sidebar) return;
  
  sidebar.innerHTML = `
    <div style="padding:20px;border-bottom:1px solid #e8eaed;">
      <button onclick="location.reload()" style="background:none;border:none;cursor:pointer;color:#5f6368;font-size:14px;margin-bottom:12px;">← Back</button>
      <h2 style="margin:0;font-size:20px;font-weight:600;">Directions</h2>
    </div>
    <div style="padding:20px;">
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;color:#5f6368;margin-bottom:8px;">FROM</label>
        <input id="desktopFromInput" type="text" placeholder="Choose starting point" readonly style="width:100%;padding:12px;border:1px solid #dadce0;border-radius:12px;cursor:pointer;" />
        <div id="desktopFromDropdown" style="display:none;position:absolute;background:white;border:1px solid #dadce0;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);max-height:200px;overflow-y:auto;z-index:10;margin-top:4px;width:calc(100% - 40px);"></div>
      </div>
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;color:#5f6368;margin-bottom:8px;">TO</label>
        <input type="text" value="${store.name}" readonly style="width:100%;padding:12px;border:1px solid #dadce0;border-radius:12px;background:#f8f9fa;" />
      </div>
      <button id="desktopStartNav" class="btn-primary" disabled style="width:100%;padding:14px;background:#1a73e8;color:white;border:none;border-radius:12px;font-size:14px;font-weight:500;cursor:pointer;">Start Navigation</button>
    </div>
    <div style="padding:20px;border-top:1px solid #e8eaed;">
      <h3 style="font-size:16px;font-weight:600;margin-bottom:12px;color:#5f6368;">Most Popular</h3>
      ${stores.slice(0, 5).map(s => `
        <div class="desktop-popular-item" data-id="${s.id}" style="padding:12px;margin-bottom:8px;border-radius:8px;background:#f8f9fa;cursor:pointer;">
          <div style="font-weight:500;font-size:14px;">${s.name}</div>
          <div style="font-size:12px;color:#5f6368;">${s.floor?.name || 'Lower Level'}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  const fromInput = document.getElementById('desktopFromInput') as HTMLInputElement;
  const fromDropdown = document.getElementById('desktopFromDropdown')!;
  const startBtn = document.getElementById('desktopStartNav') as HTMLButtonElement;
  
  fromInput?.addEventListener('click', () => {
    fromDropdown.innerHTML = stores.map(s => `<div class="dropdown-item" data-id="${s.id}" style="padding:12px 16px;cursor:pointer;font-size:14px;color:#202124;border-bottom:1px solid #e8eaed;">${s.name}</div>`).join('');
    fromDropdown.style.display = 'block';
    
    fromDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', async () => {
        navStartPoint = stores.find(st => st.id === item.getAttribute('data-id'));
        fromInput.value = navStartPoint!.name;
        fromDropdown.style.display = 'none';
        startBtn.disabled = false;
        
        const directions = await mapView.getDirections(navStartPoint, store);
        if (directions) {
          activeDirections = directions;
          navEndPoint = store;
          await mapView.Navigation.draw(directions, {
            pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5, pulseColor: '#4285f4' },
            markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' },
            setMapToDeparture: false,
            animatePathDrawing: true
          });
          await mapView.Camera.focusOn(directions.path, { maxZoomLevel: 18 });
        }
      });
    });
  });
  
  startBtn?.addEventListener('click', async () => {
    navEndPoint = selectedStore;
    await drawNavigation();
  });
}

function renderDesktopStoreDetail(store: any) {
  const sidebar = document.getElementById('desktopSidebar');
  if (!sidebar) return;
  
  const hasCategories = store.categories && store.categories.length > 0;
  const hasHours = store.operationHours;
  const hasImages = store.images && store.images.length > 0;
  const hasLogo = store.logoImage?.url;
  const hasDescription = store.description;
  const hasPhone = store.phone;
  const hasWebsite = store.website?.href;
  
  let content = '';
  
  if (hasImages) {
    content += `<img src="${store.images[0].url}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />`;
  } else if (hasLogo) {
    content += `<img src="${hasLogo}" style="width:100%;height:200px;object-fit:contain;border-radius:8px;margin-bottom:16px;background:#f8f9fa;padding:20px;" />`;
  }
  
  content += `
    <div class="directions-header">
      <div class="directions-icon" style="background:#1a73e8;">${icons.location}</div>
      <div class="directions-info">
        <div style="font-size:20px;font-weight:500;color:#202124;">${store.name}</div>
        <div style="font-size:14px;color:#5f6368;margin-top:4px;">${store.floor?.name || 'Store'}</div>
      </div>
    </div>
  `;
  
  if (hasHours) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    const todayHours = store.operationHours[today];
    if (todayHours) {
      content += `
        <div style="margin:16px 0;">
          <div style="font-weight:500;margin-bottom:8px;font-size:14px;">Hours</div>
          <div style="font-size:14px;color:#202124;">${todayHours.open} - ${todayHours.close}</div>
        </div>
      `;
    }
  }
  
  if (hasCategories) {
    content += `
      <div style="margin:16px 0;">
        <div style="font-weight:500;margin-bottom:8px;font-size:14px;">Categories</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${store.categories.map((cat: any) => `<span style="background:#f1f3f4;color:#202124;padding:6px 12px;border-radius:16px;font-size:13px;">${cat.name}</span>`).join('')}
        </div>
      </div>
    `;
  }
  
  if (hasDescription) {
    content += `<p style="color:#5f6368;font-size:14px;line-height:1.5;margin:16px 0;">${hasDescription}</p>`;
  }
  
  if (hasWebsite) {
    content += `<a href="${hasWebsite}" target="_blank" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:12px;text-decoration:none;">🔗 Visit Website</a>`;
  }
  
  if (hasPhone) {
    content += `<a href="tel:${hasPhone}" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:16px;text-decoration:none;">📞 ${hasPhone}</a>`;
  }
  
  content += `
    <div style="display:flex;gap:12px;margin-top:16px;">
      <button onclick="refreshStore()" style="flex:1;padding:10px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">${icons.refresh}</button>
      <button onclick="shareStore()" style="flex:1;padding:10px;background:#f1f3f4;border:none;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;">${icons.share}</button>
    </div>
    <button class="btn-primary" onclick="showDesktopDirections()" style="margin-top:12px;">Directions</button>
  `;
  
  sidebar.innerHTML = `
    <div style="padding:20px;border-bottom:1px solid #e8eaed;">
      <button onclick="returnToDesktopStoreList()" style="background:none;border:none;cursor:pointer;color:#5f6368;font-size:14px;margin-bottom:12px;">← Back</button>
      <h2 style="margin:0;font-size:20px;font-weight:600;">${store.name}</h2>
    </div>
    <div style="flex:1;overflow-y:auto;padding:20px;">
      ${content}
    </div>
  `;
}

function returnToDesktopStoreList() {
  const sidebar = document.getElementById('desktopSidebar');
  if (!sidebar) return;
  
  sidebar.innerHTML = `
    <div style="padding:20px;border-bottom:1px solid #e8eaed;">
      <div style="position:relative;">
        <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#5f6368;">${icons.search}</span>
        <input id="desktopSearchInput" type="text" placeholder="Search the mall..." style="width:100%;padding:12px 48px;border:none;border-radius:24px;background:#f2f2f2;font-size:14px;outline:none;" />
        <button id="desktopFilterBtn" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#5f6368;">${icons.filter}</button>
        <div id="desktopSearchResults" style="display:none;position:absolute;top:100%;left:0;right:0;background:white;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);margin-top:8px;max-height:300px;overflow-y:auto;z-index:10;"></div>
      </div>
    </div>
    <div style="padding:16px;border-bottom:1px solid #e8eaed;">
      <div id="desktopCategoryPills" style="display:flex;gap:8px;flex-wrap:wrap;"></div>
    </div>
    <div style="padding:16px;border-bottom:1px solid #e8eaed;overflow-x:auto;">
      <div id="desktopStoreCards" style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px;-webkit-overflow-scrolling:touch;"></div>
    </div>
    <div id="desktopStoreList" style="flex:1;overflow-y:auto;padding:16px;"></div>
  `;
  
  renderDesktopCategories();
  renderDesktopStoreCards();
  renderDesktopStoreList();
  attachDesktopEventHandlers();
}

(window as any).renderDesktopStoreDetail = renderDesktopStoreDetail;
(window as any).returnToDesktopStoreList = returnToDesktopStoreList;
(window as any).showDesktopDirections = showDesktopDirections;

init();
