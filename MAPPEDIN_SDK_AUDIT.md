# Mappedin SDK Implementation Audit

## Current Implementation vs Official SDK

### CRITICAL FINDING: Using Wrong Data Type

**Current Code:**
```typescript
const allSpaces = mapData.getByType('space');
stores = allSpaces.filter((space: any) => space.name);
```

**Problem:** 
- Using `space` objects which are geometric/physical areas on the map
- Spaces have: `id`, `name`, `geometry`, `floor`
- Spaces do NOT have: `images`, `description`, `phone`, `website`, `social`, `logo`

**Correct Implementation:**
```typescript
const locations = mapData.locations;
stores = locations.filter((location: any) => location.name);
```

**Why:**
- `mapData.locations` returns `EnterpriseLocation[]` objects
- Locations have ALL store data: `images`, `description`, `phone`, `website`, `social`, `logoImage`
- Locations are the actual "stores" in the mall
- Spaces are just the physical areas where locations exist

### SDK Type Definitions

**LocationProfile class properties:**
```
- id: LocationId
- name: string
- description?: string
- phone?: string
- logoImage?: ImageMetaData
- images: ImageMetaData[]  ← Store pictures
- links: Hyperlink[]
- website?: Hyperlink
- social: LocationSocial[]
- categories: LocationCategory[]
```

**Space class properties:**
```
- id: SpaceId
- name: string
- geometry: Polygon
- floor: Floor
- (NO images, description, phone, website, etc.)
```

### What's Missing in Current Implementation

1. **Store Images** - Not showing because using `space` instead of `location`
2. **Store Description** - Not available in space objects
3. **Store Phone/Website** - Not available in space objects
4. **Store Categories** - Not available in space objects

### Correct Implementation Pattern

```typescript
function setupStores(mapData: any) {
  // Use locations, not spaces
  stores = mapData.locations || [];
  searchResults = stores;
  console.log(`Found ${stores.length} stores:`, stores.map((s: any) => s.name));
}

function updateStoreList() {
  const storeList = document.getElementById('storeList');
  if (!storeList) return;

  storeList.innerHTML = searchResults
    .map((store) => {
      const image = store.images?.[0]?.url || '';
      const description = store.description || '';
      const phone = store.phone || '';
      
      return `
        <div 
          class="store-item"
          data-store-id="${store.id}"
          style="padding: 10px; margin: 5px 0; background: ${selectedStore?.id === store.id ? '#3498db' : '#f8f9fa'}; border-radius: 4px; cursor: pointer;">
          ${image ? `<img src="${image}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">` : ''}
          <div style="font-weight: bold; color: ${selectedStore?.id === store.id ? 'white' : '#333'};">${store.name}</div>
          ${description ? `<div style="font-size: 12px; color: ${selectedStore?.id === store.id ? 'rgba(255,255,255,0.8)' : '#666'}; margin-top: 5px;">${description}</div>` : ''}
          ${phone ? `<div style="font-size: 12px; color: ${selectedStore?.id === store.id ? 'rgba(255,255,255,0.8)' : '#666'};">📞 ${phone}</div>` : ''}
        </div>
      `;
    })
    .join('');

  document.querySelectorAll('.store-item').forEach((item) => {
    item.addEventListener('click', () => {
      const storeId = item.getAttribute('data-store-id');
      const store = stores.find((s) => s.id === storeId);
      if (store) selectStore(store);
    });
  });
}
```

### Summary

| Aspect | Current (Wrong) | Correct |
|--------|-----------------|---------|
| Data Source | `mapData.getByType('space')` | `mapData.locations` |
| Has Images | ❌ No | ✅ Yes |
| Has Description | ❌ No | ✅ Yes |
| Has Phone | ❌ No | ✅ Yes |
| Has Website | ❌ No | ✅ Yes |
| Has Categories | ❌ No | ✅ Yes |
| Purpose | Physical areas | Store/Tenant data |

### Next Steps

1. Change `setupStores()` to use `mapData.locations`
2. Update `updateStoreList()` to display images and details
3. Test on phone to verify images and store info appear
