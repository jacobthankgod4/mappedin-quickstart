// EXPERT AUDIT SCRIPT - Add to browser console

console.log('=== MAPPEDIN AUDIT START ===\n');

// 1. DATA STRUCTURE AUDIT
console.log('1. DATA STRUCTURE:');
console.log('Stores array length:', stores?.length);
console.log('First store object:', stores?.[0]);
console.log('Has enterpriseLocations?', stores?.[0]?.enterpriseLocations);
console.log('Store type:', stores?.[0]?.constructor?.name);
console.log('Store properties:', Object.keys(stores?.[0] || {}));

// 2. MAPVIEW API AUDIT
console.log('\n2. MAPVIEW API:');
console.log('MapView exists:', !!mapView);
console.log('Polygons API:', typeof mapView?.Polygons?.add);
console.log('Camera API:', typeof mapView?.Camera?.focusOn);
console.log('Navigation API:', typeof mapView?.Navigation?.draw);

// 3. EVENT LISTENER AUDIT
console.log('\n3. EVENT LISTENERS:');
const content = document.getElementById('sheetContent');
console.log('Content element:', !!content);
console.log('Content onclick:', typeof content?.onclick);
console.log('Store cards count:', document.querySelectorAll('.store-card').length);

// 4. CLICK TEST
console.log('\n4. CLICK TEST:');
const firstCard = document.querySelector('.store-card');
if (firstCard) {
  console.log('First card exists:', !!firstCard);
  console.log('First card data-id:', firstCard.getAttribute('data-id'));
  console.log('Simulating click...');
  firstCard.click();
  setTimeout(() => {
    console.log('Selected store after click:', selectedStore?.name);
    console.log('Selected polygon exists:', !!selectedPolygon);
  }, 100);
}

// 5. POLYGON TEST
console.log('\n5. POLYGON TEST:');
if (stores?.[0]) {
  try {
    const testStore = stores[0];
    console.log('Test store has polygon:', !!testStore.polygon);
    console.log('Test store polygon type:', typeof testStore.polygon);
    if (testStore.polygon) {
      console.log('Polygon coordinates sample:', testStore.polygon.coordinates?.[0]?.[0]);
    }
  } catch (e) {
    console.error('Polygon test error:', e);
  }
}

// 6. CAMERA FOCUS TEST
console.log('\n6. CAMERA FOCUS TEST:');
if (stores?.[0] && mapView?.Camera) {
  try {
    console.log('Attempting camera focus...');
    mapView.Camera.focusOn(stores[0], { zoom: 1000, tilt: 30, duration: 1000 });
    console.log('Camera focus succeeded');
  } catch (e) {
    console.error('Camera focus error:', e);
  }
}

// 7. ENTERPRISE LOCATIONS AUDIT
console.log('\n7. ENTERPRISE LOCATIONS:');
const storesWithEnterprise = stores?.filter(s => s.enterpriseLocations?.length > 0);
console.log('Stores with enterpriseLocations:', storesWithEnterprise?.length);
if (storesWithEnterprise?.[0]) {
  const loc = storesWithEnterprise[0].enterpriseLocations[0];
  console.log('Sample enterprise location:', {
    name: loc.name,
    hasImages: !!loc.images?.length,
    hasDescription: !!loc.description,
    hasWebsite: !!loc.website,
    hasPhone: !!loc.phone
  });
}

// 8. SEARCH FUNCTIONALITY
console.log('\n8. SEARCH FUNCTIONALITY:');
console.log('searchResults length:', searchResults?.length);
console.log('searchResults === stores:', searchResults === stores);

console.log('\n=== AUDIT COMPLETE ===');
