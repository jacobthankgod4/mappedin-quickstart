# FORENSIC PERFORMANCE AUDIT - $500K EXPERT ANALYSIS
## Systematic Debugging Methodology

---

## PHASE 1: INSTRUMENTATION

### Add Performance Logging
Insert at key execution points to identify bottleneck:

```typescript
// In showSearchDropdown() - START
console.time('showSearchDropdown');
console.log('[PERF] showSearchDropdown START', { resultCount: searchResults.length });

// In showSearchDropdown() - END
console.log('[PERF] showSearchDropdown END');
console.timeEnd('showSearchDropdown');

// In selectStore() - START
console.time('selectStore');
console.log('[PERF] selectStore START', { storeName: store.name });

// In selectStore() - END
console.log('[PERF] selectStore END');
console.timeEnd('selectStore');

// In showStoreDetailInCard() - START
console.time('showStoreDetailInCard');
console.log('[PERF] showStoreDetailInCard START');

// In showStoreDetailInCard() - END
console.log('[PERF] showStoreDetailInCard END');
console.timeEnd('showStoreDetailInCard');
```

---

## PHASE 2: HYPOTHESIS TESTING

### Hypothesis 1: Event Delegation Still Broken
**Test:** Check if dropdown listener is actually being used

```typescript
// Add to wireTopSearch() BEFORE dropdown.addEventListener
console.log('[DEBUG] Attaching dropdown listener');

// Inside the listener
dropdown.addEventListener('click', (e) => {
  console.log('[DEBUG] Dropdown clicked', e.target);
  const item = (e.target as HTMLElement).closest('.search-dropdown-item');
  console.log('[DEBUG] Found item:', item);
  // ... rest of code
});
```

**Expected:** Single "[DEBUG] Dropdown clicked" per click  
**If Multiple:** Event delegation not working

---

### Hypothesis 2: wireTopSearch() Called Multiple Times
**Test:** Check if function runs more than once

```typescript
// At TOP of wireTopSearch()
console.log('[DEBUG] wireTopSearch() called', new Error().stack);
```

**Expected:** Called once during init  
**If Multiple:** Function being re-initialized

---

### Hypothesis 3: showSearchDropdown() Generating Massive HTML
**Test:** Measure DOM size

```typescript
// In showSearchDropdown()
console.log('[PERF] Rendering', searchResults.length, 'items');
console.log('[PERF] HTML size:', dropdown.innerHTML.length, 'chars');
```

**Expected:** <100 items, <50KB HTML  
**If Larger:** Too much data rendering

---

### Hypothesis 4: selectStore() Triggering Infinite Loop
**Test:** Count selectStore calls

```typescript
// At TOP of selectStore()
if (!window.selectStoreCallCount) window.selectStoreCallCount = 0;
window.selectStoreCallCount++;
console.log('[DEBUG] selectStore call #', window.selectStoreCallCount);

if (window.selectStoreCallCount > 5) {
  console.error('[ERROR] selectStore called too many times!');
  debugger; // Pause execution
  return;
}
```

**Expected:** 1 call per click  
**If Multiple:** Infinite loop or cascade

---

### Hypothesis 5: mapView.Camera.focusOn() Blocking
**Test:** Measure camera operation time

```typescript
// In selectStore(), before focusOn
console.time('camera.focusOn');
await mapView.Camera.focusOn(store);
console.timeEnd('camera.focusOn');
```

**Expected:** <100ms  
**If Longer:** Camera animation blocking

---

### Hypothesis 6: showStoreDetailInCard() DOM Manipulation Slow
**Test:** Measure innerHTML assignment

```typescript
// In showStoreDetailInCard()
console.time('card.innerHTML');
card.innerHTML = `...`;
console.timeEnd('card.innerHTML');
```

**Expected:** <10ms  
**If Longer:** DOM manipulation bottleneck

---

## PHASE 3: NETWORK ANALYSIS

### Check for Hidden API Calls

```typescript
// Wrap fetch globally
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('[NETWORK] Fetch called:', args[0]);
  return originalFetch.apply(this, args);
};
```

**Expected:** No fetch calls on POI click  
**If Calls Found:** Unexpected network requests

---

## PHASE 4: MEMORY PROFILING

### Check for Memory Leaks

```typescript
// Add to wireTopSearch()
setInterval(() => {
  const listeners = getEventListeners(dropdown); // Chrome DevTools only
  console.log('[MEMORY] Dropdown listeners:', listeners?.click?.length || 'N/A');
}, 5000);
```

**Expected:** 1 listener  
**If Growing:** Memory leak confirmed

---

## PHASE 5: EXECUTION FLOW TRACE

### Full Call Stack Trace

```typescript
// Create global trace
window.perfTrace = [];

function trace(fn, name) {
  return function(...args) {
    const start = performance.now();
    window.perfTrace.push({ name, start, type: 'start' });
    const result = fn.apply(this, args);
    const end = performance.now();
    window.perfTrace.push({ name, end, duration: end - start, type: 'end' });
    return result;
  };
}

// Wrap functions
showSearchDropdown = trace(showSearchDropdown, 'showSearchDropdown');
selectStore = trace(selectStore, 'selectStore');
showStoreDetailInCard = trace(showStoreDetailInCard, 'showStoreDetailInCard');

// After click, inspect:
console.table(window.perfTrace);
```

---

## PHASE 6: BROWSER DEVTOOLS CHECKLIST

### Performance Tab
1. Start recording
2. Click POI
3. Stop recording
4. Look for:
   - Long tasks (>50ms)
   - Layout thrashing
   - Forced reflows
   - Script evaluation time

### Memory Tab
1. Take heap snapshot before click
2. Click POI
3. Take heap snapshot after
4. Compare for:
   - Detached DOM nodes
   - Event listener count
   - Memory growth

### Network Tab
1. Monitor during click
2. Check for:
   - Unexpected requests
   - Large payloads
   - Slow responses

---

## LIKELY ROOT CAUSES (Ranked by Probability)

### 1. wireTopSearch() Called Multiple Times (90% probability)
**Symptom:** Multiple dropdown listeners attached  
**Fix:** Add guard flag

```typescript
let isWireTopSearchInitialized = false;
function wireTopSearch() {
  if (isWireTopSearchInitialized) {
    console.warn('[WARN] wireTopSearch already initialized');
    return;
  }
  isWireTopSearchInitialized = true;
  // ... rest of code
}
```

### 2. showSearchDropdown() Rendering Too Many Items (70% probability)
**Symptom:** Dropdown has 1000+ stores  
**Fix:** Limit results

```typescript
function showSearchDropdown() {
  const MAX_RESULTS = 50;
  const limitedResults = searchResults.slice(0, MAX_RESULTS);
  
  dropdown.innerHTML = limitedResults.map(...).join('');
  
  if (searchResults.length > MAX_RESULTS) {
    dropdown.innerHTML += `<div style="padding:12px;text-align:center;color:#5f6368;">
      Showing ${MAX_RESULTS} of ${searchResults.length} results
    </div>`;
  }
}
```

### 3. selectStore() Called Recursively (60% probability)
**Symptom:** selectStore triggers event that calls selectStore again  
**Fix:** Add execution guard

```typescript
let isSelectStoreRunning = false;
function selectStore(store: any) {
  if (isSelectStoreRunning) {
    console.warn('[WARN] selectStore already running');
    return;
  }
  isSelectStoreRunning = true;
  
  try {
    // ... existing code
  } finally {
    isSelectStoreRunning = false;
  }
}
```

### 4. Camera Animation Not Awaited (50% probability)
**Symptom:** Multiple camera animations queued  
**Fix:** Make selectStore async

```typescript
async function selectStore(store: any) {
  // ... existing code
  
  if (uiMode === 'new') {
    mapView.Camera.setScreenOffsets({ bottom: 80, type: 'pixel' });
    await mapView.Camera.focusOn(store); // AWAIT this
    showStoreDetailInCard(store);
  }
}
```

### 5. DOM Manipulation Causing Reflow Storm (40% probability)
**Symptom:** Reading/writing DOM properties in loop  
**Fix:** Batch DOM operations

```typescript
function showStoreDetailInCard(store: any) {
  const card = document.getElementById('storeDetailCard')!;
  
  // Hide first to prevent reflows during update
  card.style.display = 'none';
  
  // Update content
  card.innerHTML = `...`;
  
  // Show after update complete
  requestAnimationFrame(() => {
    card.style.display = 'block';
  });
}
```

---

## IMMEDIATE ACTION PLAN

### Step 1: Add Instrumentation (2 minutes)
Add console.log statements to all suspect functions

### Step 2: Reproduce Issue (1 minute)
Open DevTools Console, click POI, observe logs

### Step 3: Identify Bottleneck (1 minute)
Look for:
- Function called multiple times
- Long execution time
- Unexpected behavior

### Step 4: Apply Targeted Fix (5 minutes)
Based on logs, apply specific fix

### Step 5: Verify (1 minute)
Test POI click, confirm <500ms response

---

## NUCLEAR OPTION: Simplify to Minimum

If all else fails, create minimal test:

```typescript
// Temporarily replace showSearchDropdown with minimal version
function showSearchDropdown() {
  const dropdown = document.getElementById('topSearchDropdown')!;
  dropdown.innerHTML = '<div>TEST</div>';
  dropdown.style.display = 'block';
}

// Temporarily replace selectStore with minimal version
function selectStore(store: any) {
  console.log('Store selected:', store.name);
  alert('Store: ' + store.name);
}
```

If this works instantly → Problem is in removed code  
If this still hangs → Problem is elsewhere (event propagation, browser bug, etc.)

---

## EXPECTED OUTCOME

After instrumentation, logs will reveal:
1. Which function takes 120 seconds
2. How many times it's called
3. What triggers the cascade

Then apply surgical fix to that specific issue.
