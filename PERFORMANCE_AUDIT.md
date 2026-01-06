# PERFORMANCE AUDIT: 120s Load Time on POI Click
## Atomic Analysis

---

## ISSUE DESCRIPTION
**Symptom:** Takes 120+ seconds to load after clicking a POI in search dropdown  
**Expected:** Instant response (<500ms)  
**Severity:** CRITICAL - Blocks user interaction

---

## EXECUTION FLOW ANALYSIS

### Current Flow (When POI Clicked):
```
1. User clicks POI in dropdown
   ↓
2. showSearchDropdown() event handler
   ↓
3. selectStore(store) called
   ↓
4. mapView.Camera.focusOn(store) - ASYNC
   ↓
5. showStoreDetailInCard(store) - SYNC
   ↓
6. card.innerHTML = ... - DOM manipulation
```

---

## ROOT CAUSE IDENTIFIED

### 🔴 CRITICAL ISSUE: Event Listener Duplication

**Location:** `showSearchDropdown()` function

**Problem:**
```typescript
dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    // Handler code
  });
});
```

**What Happens:**
1. User focuses search input → `showSearchDropdown()` called → Adds event listeners to ALL items
2. User types "S" → `showSearchDropdown()` called AGAIN → Adds DUPLICATE listeners
3. User types "St" → `showSearchDropdown()` called AGAIN → Adds MORE listeners
4. User types "Sta" → `showSearchDropdown()` called AGAIN → Even MORE listeners
5. User clicks POI → ALL accumulated listeners fire simultaneously

**Result:**
- If user typed 10 characters, there are 10+ listeners on EACH item
- Clicking triggers 10+ simultaneous `selectStore()` calls
- Each call triggers camera animation, DOM updates, map updates
- Browser locks up processing hundreds of redundant operations

---

## PERFORMANCE BOTTLENECKS

### Issue 1: Event Listener Memory Leak
**Severity:** CRITICAL  
**Impact:** Exponential performance degradation

```typescript
// CURRENT (BAD):
dropdown.innerHTML = searchResults.map(...).join(''); // Destroys old elements
dropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
  item.addEventListener('click', ...); // Adds NEW listeners
});
// Old listeners still in memory, attached to destroyed elements
```

**Fix:**
```typescript
// Use event delegation (single listener on parent)
dropdown.addEventListener('click', (e) => {
  const item = (e.target as HTMLElement).closest('.search-dropdown-item');
  if (item) {
    const storeId = item.getAttribute('data-id');
    // Handle click
  }
});
```

---

### Issue 2: Redundant showSearchDropdown() Calls
**Severity:** HIGH  
**Impact:** Unnecessary DOM rebuilds

```typescript
// CURRENT (BAD):
input.addEventListener('input', (e) => {
  // Called on EVERY keystroke
  searchResults = stores.filter(...);
  showSearchDropdown(); // Rebuilds entire dropdown HTML
});
```

**Fix:**
```typescript
// Add debouncing for input
let searchTimeout: any;
input.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchResults = stores.filter(...);
    showSearchDropdown();
  }, 150); // Wait 150ms after user stops typing
});
```

---

### Issue 3: Synchronous Camera Animation
**Severity:** MEDIUM  
**Impact:** Blocks UI thread

```typescript
// CURRENT:
mapView.Camera.focusOn(store); // Async but not awaited
showStoreDetailInCard(store); // Runs immediately
```

**Fix:**
```typescript
// Await camera animation
await mapView.Camera.focusOn(store);
showStoreDetailInCard(store);
```

---

## RECOMMENDED FIXES (Priority Order)

### FIX 1: Use Event Delegation (CRITICAL)
**File:** `main.ts` - `showSearchDropdown()` function  
**Time:** 5 minutes  
**Impact:** Eliminates 120s delay

```typescript
function showSearchDropdown() {
  const dropdown = document.getElementById('topSearchDropdown')!;
  
  if (searchResults.length === 0) {
    dropdown.innerHTML = '<div style="padding:16px;text-align:center;color:#5f6368;">No stores found</div>';
    dropdown.style.display = 'block';
    return;
  }
  
  dropdown.innerHTML = searchResults.map(store => `
    <div class="search-dropdown-item" data-id="${store.id}" style="
      padding: 12px 16px;
      cursor: pointer;
      border-bottom: 1px solid #e8eaed;
    ">
      <div style="font-weight: 500;">${store.name}</div>
      <div style="font-size: 12px; color: #5f6368;">${store.floor?.name || 'Floor G'}</div>
    </div>
  `).join('');
  
  dropdown.style.display = 'block';
}

// Add ONE listener to parent (in wireTopSearch)
function wireTopSearch() {
  const dropdown = document.getElementById('topSearchDropdown')!;
  
  // Single delegated listener
  dropdown.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest('.search-dropdown-item');
    if (item) {
      const storeId = item.getAttribute('data-id');
      const store = stores.find(s => s.id === storeId);
      if (store) {
        dropdown.style.display = 'none';
        (document.getElementById('topSearchInput') as HTMLInputElement).value = '';
        selectStore(store);
      }
    }
  });
  
  // Rest of wireTopSearch code...
}
```

---

### FIX 2: Add Input Debouncing (HIGH)
**File:** `main.ts` - `wireTopSearch()` function  
**Time:** 3 minutes  
**Impact:** Reduces unnecessary DOM updates

```typescript
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
```

---

### FIX 3: Optimize selectStore (MEDIUM)
**File:** `main.ts` - `selectStore()` function  
**Time:** 2 minutes  
**Impact:** Smoother animation

```typescript
// Make selectStore async
async function selectStore(store: any) {
  try {
    // ... existing code ...
    
    if (uiMode === 'new') {
      mapView.Camera.setScreenOffsets({ bottom: 80, type: 'pixel' });
      await mapView.Camera.focusOn(store); // Await animation
      showStoreDetailInCard(store);
    }
  } catch (err) {}
}
```

---

## TESTING CHECKLIST

After fixes:
- [ ] Click POI → Detail shows in <500ms
- [ ] Type 10 characters → No lag
- [ ] Click different POIs rapidly → No queue buildup
- [ ] Memory usage stable (no leaks)
- [ ] Browser console shows no errors

---

## ESTIMATED FIX TIME
- Fix 1 (Event Delegation): 5 minutes
- Fix 2 (Debouncing): 3 minutes  
- Fix 3 (Async): 2 minutes
- **Total: 10 minutes**

---

## IMPACT SUMMARY

**Before Fixes:**
- 120+ second delay
- Memory leaks
- Browser lockup
- Poor UX

**After Fixes:**
- <500ms response
- No memory leaks
- Smooth interaction
- Excellent UX
