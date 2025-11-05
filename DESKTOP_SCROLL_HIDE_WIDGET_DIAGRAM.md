# Desktop/Laptop/Tablet - Scroll-to-Hide Widget Feature

## Current Structure (Desktop/Tablet ≥1024px)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] [8-Tile Widget Grid]                             │ ← Row 1: Logo + Widgets
├─────────────────────────────────────────────────────────┤
│ [Home] [Calculators] [Loan Calculator] ... [Contact]    │ ← Row 2: Navigation Buttons
└─────────────────────────────────────────────────────────┘
```

---

## Proposed Behavior

### When Scrolling DOWN (Hide Widgets)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo]                                                  │ ← Row 1: Only Logo (Widgets Hidden)
├─────────────────────────────────────────────────────────┤
│ [Home] [Calculators] [Loan Calculator] ... [Contact]    │ ← Row 2: Navigation moves up (takes widget space)
└─────────────────────────────────────────────────────────┘
```

**Visual Flow:**
```
Before Scroll Down:
┌─────────────────────────────────────┐
│ [Logo] [Widget 1] [Widget 2] ...    │ ← Widgets visible
├─────────────────────────────────────┤
│ [Home] [Calculators] ...            │ ← Navigation below
└─────────────────────────────────────┘

During Scroll Down:
┌─────────────────────────────────────┐
│ [Logo]                              │ ← Widgets sliding up (hiding)
├─────────────────────────────────────┤
│ [Home] [Calculators] ...            │ ← Navigation sliding up (replacing widget space)
└─────────────────────────────────────┘

After Scroll Down:
┌─────────────────────────────────────┐
│ [Logo]                              │ ← Widgets hidden
├─────────────────────────────────────┤
│ [Home] [Calculators] ...            │ ← Navigation in widget position
└─────────────────────────────────────┘
```

---

### When Scrolling UP (Show Widgets)

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] [8-Tile Widget Grid]                             │ ← Row 1: Logo + Widgets (reappear)
├─────────────────────────────────────────────────────────┤
│ [Home] [Calculators] [Loan Calculator] ... [Contact]    │ ← Row 2: Navigation moves back down
└─────────────────────────────────────────────────────────┘
```

**Visual Flow:**
```
Before Scroll Up:
┌─────────────────────────────────────┐
│ [Logo]                              │ ← Widgets hidden
├─────────────────────────────────────┤
│ [Home] [Calculators] ...            │ ← Navigation in widget position
└─────────────────────────────────────┘

During Scroll Up:
┌─────────────────────────────────────┐
│ [Logo] [Widget 1] [Widget 2] ...    │ ← Widgets sliding down (reappearing)
├─────────────────────────────────────┤
│ [Home] [Calculators] ...            │ ← Navigation sliding down (back to original)
└─────────────────────────────────────┘

After Scroll Up:
┌─────────────────────────────────────┐
│ [Logo] [Widget 1] [Widget 2] ...    │ ← Widgets visible
├─────────────────────────────────────┤
│ [Home] [Calculators] ...            │ ← Navigation in original position
└─────────────────────────────────────┘
```

---

## Technical Implementation

### Structure Breakdown

**Desktop/Tablet Header Structure:**
```html
<nav>
    <!-- Row 1: Logo + Widget Grid -->
    <div class="logo-widgets-row">
        <div class="logo">FreeToolHub</div>
        <div class="header-tiles-grid">8 tiles...</div>
    </div>
    
    <!-- Row 2: Navigation Buttons -->
    <div class="navigation-buttons-row">
        <a>Home</a>
        <a>Calculators</a>
        ...
    </div>
</nav>
```

### CSS Changes Needed

1. **Widget Grid Container:**
   - Add `transition` for smooth hide/show
   - Add `max-height` and `overflow: hidden` for collapse
   - Use `transform: translateY()` or `max-height: 0` for hiding

2. **Navigation Buttons Row:**
   - Add `transition` for smooth movement
   - Use `transform: translateY()` to move up when widgets hide

3. **Scroll Detection:**
   - JavaScript to detect scroll direction
   - Add/remove class on scroll down/up
   - Apply only to desktop/tablet (≥1024px)

### JavaScript Logic

```javascript
// For Desktop/Tablet only (≥1024px)
- Detect scroll direction (down/up)
- On scroll DOWN: Add class 'widgets-hidden' to nav
  - Widget grid: max-height: 0, opacity: 0
  - Navigation: transform: translateY(-100px) (move up)
- On scroll UP: Remove class 'widgets-hidden'
  - Widget grid: max-height: auto, opacity: 1
  - Navigation: transform: translateY(0) (move back)
```

---

## Benefits

1. **More Screen Space:** When scrolling down, widgets hide, giving more vertical space
2. **Navigation Always Accessible:** Navigation buttons move up, always visible
3. **Smooth Transitions:** Smooth animations for better UX
4. **Desktop/Tablet Only:** Doesn't affect mobile (which already has scroll-to-hide)

---

## Questions to Confirm

1. ✅ **Logo:** Should always remain visible? (Yes - confirmed)
2. ✅ **Widgets:** Hide completely when scrolling down? (Yes - confirmed)
3. ✅ **Navigation:** Move up to widget position when widgets hide? (Yes - confirmed)
4. ✅ **Scroll Threshold:** Hide after scrolling how many pixels? (Suggest 50-100px)
5. ✅ **Devices:** Only desktop/laptop/tablet (≥1024px)? (Yes - confirmed)

---

## Implementation Plan

### Step 1: Add CSS for Desktop Scroll Hide
- Add transitions for widget grid
- Add transitions for navigation buttons
- Add classes for hidden state

### Step 2: Add JavaScript Scroll Detection
- Detect scroll direction
- Add/remove classes based on scroll
- Apply only to desktop/tablet (≥1024px)

### Step 3: Test
- Test on desktop (≥1024px)
- Test on tablet (≥1024px)
- Verify mobile is not affected (<1024px)

---

## Visual Comparison

### Current Behavior (Desktop)
```
Scroll Down → Header stays same (always visible)
Scroll Up → Header stays same (always visible)
```

### Proposed Behavior (Desktop)
```
Scroll Down → Widgets hide, Navigation moves up
Scroll Up → Widgets show, Navigation moves down
```

---

## Confirmation

**Please confirm:**
1. ✅ Logo always visible
2. ✅ Widgets hide on scroll down
3. ✅ Navigation moves up to widget position
4. ✅ Widgets reappear on scroll up
5. ✅ Navigation moves back down on scroll up
6. ✅ Only for desktop/tablet (≥1024px)

**If confirmed, I'll implement this feature!**

