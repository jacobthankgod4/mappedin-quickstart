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
  setupUI();
}

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
  indicator.textContent = currentFloor?.name || 'Floor 1';
  document.body.appendChild(indicator);
  mapView.on('floor-change', (event: any) => {
    currentFloor = event.floor;
    indicator.textContent = currentFloor?.name || 'Floor 1';
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
  controls.style.cssText = 'position:fixed;right:16px;top:20%;z-index:1000;display:flex;flex-direction:column;gap:8px;';
  
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
    const currentZoom = mapView.Camera.zoom;
    mapView.Camera.zoom = currentZoom * 1.2;
  });
  
  document.getElementById('zoomOutBtn')!.addEventListener('click', () => {
    const currentZoom = mapView.Camera.zoom;
    mapView.Camera.zoom = currentZoom * 0.8;
  });
  
  if (floors.length > 1) {
    const floorSelector = document.createElement('div');
    floorSelector.style.cssText = 'position:fixed;right:16px;top:calc(20% + 140px);z-index:1000;display:flex;flex-direction:column;gap:8px;';
    
    floorSelector.innerHTML = floors.map(floor => `
      <button class="floor-btn" data-floor-id="${floor.id}" 
              style="width:48px;height:48px;border-radius:24px;background:white;border:1px solid #dadce0;font-weight:500;font-size:14px;cursor:pointer;">
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



function selectStore(store: any) {
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
      const vh = window.innerHeight / 100;
      mapView.Camera.setScreenOffsets({ bottom: 60 * vh, type: 'pixel' });
      mapView.Camera.focusOn(store);
    } catch (err) {}
    
    updateStoreList();
  } catch (err) {}
}

function showDirections() {
  const content = document.getElementById('sheetContent')!;
  const searchBar = document.getElementById('searchInput')!.parentElement!.parentElement!;
  searchBar.style.display = 'none';
  
  content.innerHTML = `
    <div class="directions-card" style="display:flex;flex-direction:column;height:100%;padding:12px;">
      <div style="font-size:16px;font-weight:500;color:#202124;margin-bottom:12px;">Get Directions</div>
      
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
}

async function drawNavigation() {
  if (!navStartPoint || !navEndPoint || !activeDirections) return;
  try {
    currentInstructionIndex = 0;
    
    // Clear camera offset and focus on start location
    mapView.Camera.setScreenOffsets({ bottom: 0, type: 'pixel' });
    await mapView.Camera.focusOn(activeDirections.instructions[0].coordinate);
    
    const content = document.getElementById('sheetContent')!;
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
    
    content.innerHTML = `
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
    updateCurrentInstruction();
    document.getElementById('searchInput')!.parentElement!.parentElement!.style.display = 'none';
    const sheet = document.getElementById('bottomSheet')!;
    sheet.style.maxHeight = '35vh';
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
  document.getElementById('searchInput')!.parentElement!.parentElement!.style.display = 'block';
  clearSelection();
}

function toggleSheet() {
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



function setupUI() {
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
  let startY = 0;
  let currentHeight = 0;
  let isDragging = false;
  
  header.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    currentHeight = sheet.offsetHeight;
    isDragging = true;
    sheet.style.transition = 'none';
  });
  
  header.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - startY;
    const newHeight = currentHeight - deltaY;
    const vh = window.innerHeight / 100;
    
    if (newHeight >= 20 * vh && newHeight <= 60 * vh) {
      sheet.style.maxHeight = `${newHeight}px`;
      // Update camera offset as sheet is dragged
      if (selectedStore) {
        mapView.Camera.setScreenOffsets({ bottom: newHeight, type: 'pixel' });
      }
    }
  }, { passive: false });
  
  header.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    sheet.style.transition = 'max-height 0.3s ease';
    
    const vh = window.innerHeight / 100;
    const currentHeightVh = sheet.offsetHeight / vh;
    
    if (currentHeightVh < 40) {
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
    
    let html = `<div class="directions-card">`;
    
    if (hasImages) {
      html += `<img src="${selectedStore.images[0].url}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />`;
    } else if (hasLogo) {
      html += `<img src="${hasLogo}" style="width:100%;height:200px;object-fit:contain;border-radius:8px;margin-bottom:16px;background:#f8f9fa;padding:20px;" />`;
    }
    
    html += `
      <div class="directions-header">
        <div class="directions-icon" style="background:#1a73e8;">${icons.location}</div>
        <div class="directions-info">
          <div style="font-size:20px;font-weight:500;color:#202124;">${selectedStore.name}</div>
          <div style="font-size:14px;color:#5f6368;margin-top:4px;">${selectedStore.floor?.name || 'Store'}</div>
        </div>
      </div>
    `;
    
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

init();
