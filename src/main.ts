import { getMapData, show3dMap } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';
import './styles.css';

const options = {
  key: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  secret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',
  mapId: '65c0ff7430b94e3fabd5bb8c'
};

let mapView: any = null;
let stores: any[] = [];
let searchResults: any[] = [];
let selectedStore: any = null;
let currentFloor: any = null;
let selectedPolygon: any = null;
let navStartPoint: any = null;
let navEndPoint: any = null;
let activeDirections: any = null;
let currentInstructionIndex: number = 0;

async function init() {
  const container = document.getElementById('mappedin-map')!;
  container.style.position = 'relative';

  // Create debug overlay
  const debugDiv = document.createElement('div');
  debugDiv.id = 'debug-overlay';
  debugDiv.style.cssText = 'position:fixed;top:80px;right:10px;background:rgba(0,0,0,0.9);color:#0f0;padding:10px;border-radius:8px;font-family:monospace;font-size:11px;max-width:300px;max-height:400px;overflow-y:auto;z-index:9999;';
  document.body.appendChild(debugDiv);
  (window as any).debugLog = (msg: string) => {
    const line = document.createElement('div');
    line.textContent = msg;
    line.style.marginBottom = '4px';
    debugDiv.appendChild(line);
    debugDiv.scrollTop = debugDiv.scrollHeight;
  };

  (window as any).debugLog('🚀 Initializing...');
  const mapData = await getMapData(options);
  (window as any).debugLog('✓ Map data loaded');
  mapView = await show3dMap(container, mapData);
  (window as any).debugLog('✓ Map view created');
  
  setupStores(mapData);
  setupFloorIndicator(mapData);
  addLabels();
  addPromotionalMarkers();
  addDirectoryKiosks(mapData);
  setupUI();
  (window as any).debugLog('✓ Init complete');
}

function setupStores(mapData: any) {
  try {
    (window as any).debugLog('\n📦 SETUP STORES:');
    (window as any).debugLog(`Locations: ${mapData.locations?.length || 0}`);
    (window as any).debugLog(`Spaces: ${mapData.getByType?.('space')?.length || 0}`);
    
    if (mapData.locations && mapData.locations.length > 0) {
      stores = mapData.locations;
      (window as any).debugLog('Using: locations');
    } else {
      const spaces = mapData.getByType?.('space') || [];
      stores = spaces.filter((s: any) => s && s.name);
      (window as any).debugLog('Using: spaces');
    }
    
    (window as any).debugLog(`Total stores: ${stores.length}`);
    (window as any).debugLog(`Has enterprise: ${!!stores[0]?.enterpriseLocations}`);
    (window as any).debugLog(`Has polygon: ${!!stores[0]?.polygon}`);
    
    searchResults = stores;
  } catch (err) {
    (window as any).debugLog(`❌ Error: ${err}`);
    stores = [];
    searchResults = [];
  }
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



function selectStore(store: any) {
  try {
    (window as any).debugLog(`\n🎯 SELECT: ${store.name}`);
    
    // Clear previous highlight BEFORE setting new one
    if (selectedPolygon && selectedPolygon !== store) {
      try {
        mapView.updateState(selectedPolygon, { color: 'initial' });
        (window as any).debugLog('✓ Cleared old highlight');
      } catch (err) {
        (window as any).debugLog(`❌ Clear old: ${err}`);
      }
    }
    
    selectedStore = store;
    selectedPolygon = store;
    
    // Highlight selected space
    try {
      mapView.updateState(store, { color: '#3498db' });
      (window as any).debugLog('✓ Highlighted');
    } catch (err) {
      (window as any).debugLog(`❌ Highlight: ${err}`);
    }
    
    // Focus camera
    try {
      mapView.Camera.focusOn(store);
      (window as any).debugLog('✓ Camera focused');
    } catch (err) {
      (window as any).debugLog(`❌ Camera: ${err}`);
    }
    
    updateStoreList();
  } catch (err) {
    (window as any).debugLog(`❌ Select error: ${err}`);
  }
}

function showDirections() {
  const content = document.getElementById('sheetContent')!;
  content.innerHTML = `
    <div class="directions-card">
      <div style="font-size:18px;font-weight:500;color:#202124;margin-bottom:16px;">Get Directions</div>
      
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;color:#5f6368;margin-bottom:8px;">FROM</label>
        <div style="position:relative;">
          <input id="startInput" class="location-input" type="text" placeholder="Choose starting point" readonly />
          <div id="startDropdown" class="location-dropdown" style="display:none;"></div>
        </div>
      </div>
      
      <div style="margin-bottom:16px;">
        <label style="display:block;font-size:12px;color:#5f6368;margin-bottom:8px;">TO</label>
        <div style="position:relative;">
          <input id="endInput" class="location-input" type="text" value="${selectedStore.name}" readonly />
        </div>
      </div>
      
      <button class="btn-primary" id="startNavBtn" disabled>Start Navigation</button>
      <button class="btn-secondary" style="margin-top:8px;" onclick="updateStoreList()">Cancel</button>
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
      });
    });
  });
  
  startNavBtn.addEventListener('click', async () => {
    navEndPoint = selectedStore;
    await drawNavigation();
  });
}

async function drawNavigation() {
  if (!navStartPoint || !navEndPoint) return;
  try {
    const directions = await mapView.getDirections(navStartPoint, navEndPoint);
    if (directions) {
      await mapView.Navigation.draw(directions, {
        pathOptions: { color: '#4285f4', nearRadius: 0.5, farRadius: 1.5, pulseColor: '#4285f4' },
        markerOptions: { departureColor: '#34a853', destinationColor: '#ea4335' },
        setMapToDeparture: true,
        animatePathDrawing: true
      });
      mapView.Camera.focusOn({ nodes: directions.path });
      
      activeDirections = directions;
      currentInstructionIndex = 0;
      
      const content = document.getElementById('sheetContent')!;
      const distance = directions.distance ? directions.distance.toFixed(0) : 'N/A';
      const time = directions.distance ? Math.ceil(directions.distance / 1.4 / 60) : 'N/A';
      
      const getInstructionIcon = (type: string, bearing?: string) => {
        if (type === 'Departure') return '🚶';
        if (type === 'Arrival') return '🎯';
        if (type === 'TakeConnection') return '🔼';
        if (type === 'ExitConnection') return '🔽';
        if (bearing === 'Right') return '➡️';
        if (bearing === 'Left') return '⬅️';
        if (bearing === 'SlightRight') return '↗️';
        if (bearing === 'SlightLeft') return '↖️';
        return '⬆️';
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
      
      const instructionsHtml = directions.instructions.map((inst: any, idx: number) => `
        <div id="inst-${idx}" style="display:flex;align-items:start;gap:12px;padding:12px;border-bottom:1px solid #e8eaed;opacity:0.5;">
          <div style="font-size:20px;flex-shrink:0;">${getInstructionIcon(inst.action.type, inst.action.bearing)}</div>
          <div style="flex:1;">
            <div style="font-size:14px;color:#202124;font-weight:500;">${getInstructionText(inst)}</div>
            ${inst.action.fromFloor && inst.action.toFloor ? `<div style="font-size:12px;color:#5f6368;margin-top:4px;">Floor ${inst.action.fromFloor.name} → ${inst.action.toFloor.name}</div>` : ''}
          </div>
        </div>
      `).join('');
      
      content.innerHTML = `
        <div class="directions-card">
          <div class="directions-header">
            <div class="directions-icon">🧭</div>
            <div class="directions-info">
              <div class="directions-time">${time} min</div>
              <div class="directions-distance">${distance} m</div>
            </div>
          </div>
          <div id="currentInstruction" style="padding:16px;background:#e8f0fe;border-radius:8px;margin:16px 0;">
            <div style="font-size:24px;margin-bottom:8px;" id="currentIcon">🚶</div>
            <div style="font-weight:500;font-size:16px;color:#202124;" id="currentText">Start at ${navStartPoint.name}</div>
            <div style="font-size:12px;color:#5f6368;margin-top:4px;" id="currentDistance"></div>
          </div>
          <button class="btn-primary" onclick="nextInstruction()" id="nextBtn" style="width:100%;margin-bottom:12px;">Next Step</button>
          <div style="margin:16px 0;">
            <div style="font-size:14px;font-weight:500;color:#202124;margin-bottom:8px;">All Steps</div>
            <div style="max-height:200px;overflow-y:auto;border:1px solid #e8eaed;border-radius:8px;">
              ${instructionsHtml}
            </div>
          </div>
          <button class="btn-secondary" onclick="clearNavigation()">End route</button>
        </div>
      `;
      updateCurrentInstruction();
    }
  } catch (err) {}
}

function clearSelection() {
  (window as any).debugLog('\n🧹 CLEAR SELECTION');
  if (selectedPolygon) {
    try { 
      mapView.updateState(selectedPolygon, { color: 'initial' });
      (window as any).debugLog('✓ Unhighlighted');
    } catch (err) {
      (window as any).debugLog(`❌ Unhighlight: ${err}`);
    }
    selectedPolygon = null;
  }
  selectedStore = null;
  updateStoreList();
}

function clearNavigation() {
  (window as any).debugLog('\n🛑 END ROUTE');
  mapView.Navigation.clear();
  mapView.Navigation.clearHighlightedPathSection();
  activeDirections = null;
  currentInstructionIndex = 0;
  navStartPoint = null;
  navEndPoint = null;
  clearSelection();
}

function nextInstruction() {
  if (!activeDirections) return;
  
  currentInstructionIndex++;
  
  if (currentInstructionIndex >= activeDirections.instructions.length) {
    const content = document.getElementById('sheetContent')!;
    content.innerHTML = `
      <div class="directions-card" style="text-align:center;padding:32px;">
        <div style="font-size:48px;margin-bottom:16px;">🎯</div>
        <div style="font-size:20px;font-weight:500;color:#202124;margin-bottom:8px;">You've Arrived!</div>
        <div style="color:#5f6368;margin-bottom:24px;">${navEndPoint.name}</div>
        <button class="btn-primary" onclick="clearNavigation()">Done</button>
      </div>
    `;
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
  } catch (err) {
    (window as any).debugLog(`❌ Highlight: ${err}`);
  }
  
  try {
    mapView.Camera.focusOn(currentInst.coordinate);
    (window as any).debugLog(`✓ Camera moved to step ${currentInstructionIndex}`);
  } catch (err) {
    (window as any).debugLog(`❌ Camera: ${err}`);
  }
}

function updateCurrentInstruction() {
  if (!activeDirections) return;
  
  const inst = activeDirections.instructions[currentInstructionIndex];
  const getInstructionIcon = (type: string, bearing?: string) => {
    if (type === 'Departure') return '🚶';
    if (type === 'Arrival') return '🎯';
    if (type === 'TakeConnection') return '🔼';
    if (type === 'ExitConnection') return '🔽';
    if (bearing === 'Right') return '➡️';
    if (bearing === 'Left') return '⬅️';
    if (bearing === 'SlightRight') return '↗️';
    if (bearing === 'SlightLeft') return '↖️';
    return '⬆️';
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
  const dist = inst.distance.toFixed(0);
  
  document.getElementById('currentIcon')!.textContent = icon;
  document.getElementById('currentText')!.textContent = text;
  document.getElementById('currentDistance')!.textContent = `${dist}m`;
  
  activeDirections.instructions.forEach((_: any, idx: number) => {
    const elem = document.getElementById(`inst-${idx}`);
    if (elem) {
      elem.style.opacity = idx <= currentInstructionIndex ? '1' : '0.5';
      elem.style.background = idx === currentInstructionIndex ? '#e8f0fe' : 'transparent';
    }
  });
  
  const nextBtn = document.getElementById('nextBtn') as HTMLButtonElement;
  if (currentInstructionIndex === activeDirections.instructions.length - 1) {
    nextBtn.textContent = 'Arrive';
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



function setupUI() {
  const uiContainer = document.createElement('div');
  uiContainer.innerHTML = `
    <div id="bottomSheet" class="bottom-sheet">
      <div class="sheet-header">
        <div class="sheet-title">Stores</div>
        <button class="close-btn" onclick="hideSheet()">×</button>
      </div>
      <div style="padding:16px;border-bottom:1px solid #e8eaed;">
        <div style="position:relative;">
          <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:18px;color:#5f6368;">🔍</span>
          <input id="searchInput" style="width:100%;padding:10px 10px 10px 40px;border:1px solid #dadce0;border-radius:4px;font-size:14px;outline:none;" type="text" placeholder="Search stores..." />
          <div id="searchResults" class="search-results" style="display:none;"></div>
        </div>
      </div>
      <div id="sheetContent" class="sheet-content"></div>
    </div>
  `;
  document.body.appendChild(uiContainer);

  const searchInput = document.getElementById('searchInput')!;
  const searchResultsDiv = document.getElementById('searchResults')!;
  
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
    (window as any).debugLog(`\n📄 DETAILS: ${selectedStore.name}`);
    
    const location = selectedStore.enterpriseLocations?.[0];
    const hasData = location && (location.images?.length || location.description || location.website || location.phone);
    
    let html = `<div class="directions-card">`;
    
    if (location?.images?.[0]?.url) {
      html += `<img src="${location.images[0].url}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:16px;" />`;
      (window as any).debugLog('✓ Image');
    }
    
    html += `
      <div class="directions-header">
        <div class="directions-icon">📍</div>
        <div class="directions-info">
          <div style="font-size:20px;font-weight:500;color:#202124;">${selectedStore.name}</div>
          <div style="font-size:14px;color:#5f6368;margin-top:4px;">${location?.amenity || 'Store'}</div>
        </div>
      </div>
    `;
    
    if (location?.description) {
      html += `<p style="color:#5f6368;font-size:14px;line-height:1.5;margin:16px 0;">${location.description}</p>`;
      (window as any).debugLog('✓ Description');
    }
    
    if (location?.website) {
      html += `<a href="${location.website}" target="_blank" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:16px;text-decoration:none;">🔗 Visit Website</a>`;
      (window as any).debugLog('✓ Website');
    }
    
    if (location?.phone) {
      html += `<a href="tel:${location.phone}" style="display:block;color:#1a73e8;font-size:14px;margin-bottom:16px;text-decoration:none;">📞 ${location.phone}</a>`;
      (window as any).debugLog('✓ Phone');
    }
    
    if (!hasData) {
      html += `<p style="color:#9aa0a6;font-size:14px;margin:16px 0;font-style:italic;">No additional details available</p>`;
      (window as any).debugLog('ℹ️ No enterprise data');
    }
    
    html += `
      <button class="btn-primary" onclick="showDirections()">Directions</button>
      <button class="btn-secondary" style="margin-top:8px;" onclick="clearSelection()">Close</button>
    </div>`;
    
    content.innerHTML = html;
    sheet.style.maxHeight = '80vh';
  } else {
    sheet.style.maxHeight = '60vh';
    content.innerHTML = searchResults.map(store => `
      <div class="store-card" data-id="${store.id}">
        <div class="store-icon">🏪</div>
        <div class="store-info">
          <div class="store-name">${store.name}</div>
          <div class="store-type">Store</div>
        </div>
      </div>
    `).join('');
  }
}

function attachStoreListeners() {
  const content = document.getElementById('sheetContent');
  if (!content) return;
  
  (window as any).debugLog('\n👂 Listeners attached');
  
  content.onclick = (e) => {
    const card = (e.target as HTMLElement).closest('.store-card');
    if (card) {
      (window as any).debugLog('\n🖱️ CLICK detected');
      const storeId = card.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) selectStore(store);
    }
  };
}

init();
