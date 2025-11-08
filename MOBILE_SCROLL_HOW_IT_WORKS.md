# How Mobile Scroll-to-Hide Header Works - Technical Explanation

## Overview
When a user scrolls down on a mobile device, the header widgets and navigation buttons automatically hide to save screen space. When they scroll up, these elements reappear. This document explains the technical implementation.

---

## 🎯 The Complete Flow

### **Step 1: User Scrolls Down**
```
User scrolls down the page
    ↓
Scroll position increases (e.g., 0px → 100px)
    ↓
JavaScript detects scroll direction and position
    ↓
If scroll > 50px AND scrolling down → Add class 'header-scrolled-down' to <nav>
    ↓
CSS rules apply → Widgets and navigation hide
```

### **Step 2: User Scrolls Up**
```
User scrolls up the page
    ↓
Scroll position decreases (e.g., 100px → 50px)
    ↓
JavaScript detects scroll direction
    ↓
If scrolling up OR scroll ≤ 50px → Remove class 'header-scrolled-down' from <nav>
    ↓
CSS rules remove → Widgets and navigation reappear
```

---

## 🔧 Technical Components

### **1. HTML Structure**

```html
<nav class="fixed w-full z-40">
    <!-- Logo Row (Always Visible) -->
    <div class="max-w-7xl">
        <img src="logo.png" alt="Logo">
    </div>
    
    <!-- Mobile Widgets Container (Hides on scroll) -->
    <div class="mobile-widgets-container lg:hidden">
        <div id="mobile-weather-widget">...</div>
        <div id="mobile-word-widget">...</div>
    </div>
    
    <!-- Navigation Buttons Row (Hides on scroll) -->
    <div class="navigation-buttons-row">
        <a href="/">Home</a>
        <a href="/tools/calculator.html">Calculators</a>
        ...
    </div>
</nav>
```

**Key Points:**
- All elements are inside `<nav>` element
- Logo is always visible (no hiding)
- Widgets and navigation have specific classes for targeting

---

### **2. JavaScript Scroll Detection**

```javascript
// Scroll-to-Hide Header for Mobile
(function() {
    // Only run on mobile devices (< 1024px)
    if (window.innerWidth >= 1024) return;
    
    let lastScroll = 0;  // Track previous scroll position
    const header = document.querySelector('nav');
    const scrollThreshold = 50;  // Hide after scrolling 50px
    
    function handleScroll() {
        const currentScroll = window.pageYOffset;  // Current scroll position
        
        // CASE 1: Scrolling DOWN past threshold
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            header.classList.add('header-scrolled-down');  // Add class → Hide elements
        } 
        // CASE 2: Scrolling UP or at top
        else if (currentScroll < lastScroll || currentScroll <= scrollThreshold) {
            header.classList.remove('header-scrolled-down');  // Remove class → Show elements
        }
        
        lastScroll = currentScroll;  // Save current position for next check
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
})();
```

**How It Works:**
1. **Tracks scroll position**: `window.pageYOffset` gives current scroll position
2. **Detects direction**: Compares `currentScroll` with `lastScroll`
   - `currentScroll > lastScroll` = Scrolling DOWN
   - `currentScroll < lastScroll` = Scrolling UP
3. **Applies threshold**: Only hides after scrolling 50px down
4. **Toggles class**: Adds/removes `header-scrolled-down` class on `<nav>`
5. **Performance**: Uses `requestAnimationFrame` to throttle scroll events (prevents lag)

---

### **3. CSS Transitions & Animations**

#### **Initial State (Visible)**
```css
@media (max-width: 1023px) {
    /* Mobile widgets container - Visible by default */
    .mobile-widgets-container {
        max-height: 400px;  /* Full height to show widgets */
        opacity: 1;
        transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        overflow: hidden;
    }
    
    /* Navigation buttons - Visible by default */
    .navigation-buttons-row {
        max-height: 100px;  /* Full height to show buttons */
        opacity: 1;
        transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
        overflow: hidden;
    }
}
```

#### **Hidden State (Scrolled Down)**
```css
@media (max-width: 1023px) {
    /* When nav has 'header-scrolled-down' class */
    nav.header-scrolled-down .mobile-widgets-container,
    nav.header-scrolled-down .navigation-buttons-row {
        max-height: 0 !important;      /* Collapse to 0 height */
        opacity: 0 !important;          /* Fade out */
        overflow: hidden !important;    /* Hide overflow */
        pointer-events: none !important; /* Disable clicks */
        padding-top: 0 !important;      /* Remove padding */
        padding-bottom: 0 !important;
        margin: 0 !important;
    }
}
```

**How It Works:**
1. **max-height transition**: Animates from 400px → 0px (widgets) or 100px → 0px (navigation)
2. **opacity transition**: Fades from 1 → 0 (invisible)
3. **overflow: hidden**: Prevents content from showing outside container
4. **pointer-events: none**: Disables clicks when hidden
5. **!important flags**: Ensures these rules override other styles

---

## 📊 Visual Representation

### **State 1: At Top of Page (Scroll = 0px)**
```
┌─────────────────────────┐
│       LOGO              │ ← Always visible
├─────────────────────────┤
│  Mobile Weather Widget  │ ← Visible
│  Mobile Word Widget     │ ← Visible
├─────────────────────────┤
│ Home | Calculator | ... │ ← Visible
└─────────────────────────┘
```

**CSS Classes:**
- `<nav>` = no `header-scrolled-down` class
- Widgets: `max-height: 400px`, `opacity: 1`
- Navigation: `max-height: 100px`, `opacity: 1`

---

### **State 2: Scrolling Down (Scroll = 60px)**
```
┌─────────────────────────┐
│       LOGO              │ ← Still visible
│                         │
│  (Widgets collapsing)   │ ← Animating: max-height 400px → 0px
│  (Navigation collapsing)│ ← Animating: max-height 100px → 0px
└─────────────────────────┘
```

**CSS Classes:**
- `<nav>` = `header-scrolled-down` class added
- Widgets: `max-height: 0`, `opacity: 0`
- Navigation: `max-height: 0`, `opacity: 0`
- **Transition**: 0.3s smooth animation

---

### **State 3: Fully Hidden (Scroll = 200px)**
```
┌─────────────────────────┐
│       LOGO              │ ← Only logo visible
│                         │
│  (Widgets hidden)       │ ← max-height: 0, opacity: 0
│  (Navigation hidden)    │ ← max-height: 0, opacity: 0
└─────────────────────────┘
```

**CSS Classes:**
- `<nav>` = `header-scrolled-down` class present
- Widgets: Completely hidden (0px height, invisible)
- Navigation: Completely hidden (0px height, invisible)

---

### **State 4: Scrolling Up (Scroll = 150px → 50px)**
```
┌─────────────────────────┐
│       LOGO              │ ← Still visible
│                         │
│  (Widgets expanding)   │ ← Animating: max-height 0px → 400px
│  (Navigation expanding) │ ← Animating: max-height 0px → 100px
└─────────────────────────┘
```

**CSS Classes:**
- `<nav>` = `header-scrolled-down` class removed
- Widgets: `max-height: 400px`, `opacity: 1` (expanding)
- Navigation: `max-height: 100px`, `opacity: 1` (expanding)
- **Transition**: 0.3s smooth animation

---

## 🔄 Complete Example Flow

### **Scenario: User Scrolls Down, Then Up**

1. **Initial State (Scroll = 0px)**
   - `lastScroll = 0`
   - `currentScroll = 0`
   - `<nav>` = no class
   - Widgets & Navigation = **Visible**

2. **User Scrolls to 30px**
   - `lastScroll = 0`
   - `currentScroll = 30`
   - Direction: DOWN (30 > 0)
   - Condition: `30 > 0 && 30 > 50` → **FALSE** (30 < 50 threshold)
   - Action: **No change** (still visible)

3. **User Scrolls to 60px**
   - `lastScroll = 30`
   - `currentScroll = 60`
   - Direction: DOWN (60 > 30)
   - Condition: `60 > 30 && 60 > 50` → **TRUE**
   - Action: `header.classList.add('header-scrolled-down')`
   - Result: Widgets & Navigation start **hiding** (0.3s animation)

4. **User Scrolls to 200px**
   - `lastScroll = 60`
   - `currentScroll = 200`
   - Direction: DOWN (200 > 60)
   - Condition: `200 > 60 && 200 > 50` → **TRUE**
   - Action: Class already added, stays hidden
   - Result: Widgets & Navigation **fully hidden**

5. **User Scrolls to 150px (Scrolling Up)**
   - `lastScroll = 200`
   - `currentScroll = 150`
   - Direction: UP (150 < 200)
   - Condition: `150 < 200 || 150 <= 50` → **TRUE** (first part)
   - Action: `header.classList.remove('header-scrolled-down')`
   - Result: Widgets & Navigation start **reappearing** (0.3s animation)

6. **User Scrolls to 40px**
   - `lastScroll = 150`
   - `currentScroll = 40`
   - Direction: UP (40 < 150)
   - Condition: `40 < 150 || 40 <= 50` → **TRUE** (both parts)
   - Action: Class already removed, stays visible
   - Result: Widgets & Navigation **fully visible**

---

## 🎨 Animation Details

### **Transition Properties**
```css
transition: max-height 0.3s ease-in-out, 
            opacity 0.3s ease-in-out, 
            padding 0.3s ease-in-out, 
            margin 0.3s ease-in-out;
```

**What This Means:**
- **Duration**: 0.3 seconds (300ms)
- **Easing**: `ease-in-out` (starts slow, speeds up, slows down)
- **Properties**: All changes animate smoothly

### **Why max-height Instead of height?**
- `height` requires exact pixel values
- `max-height` allows flexible sizing
- Can animate from a large value (400px) to 0px smoothly
- Works even if content height changes

---

## 🚀 Performance Optimizations

### **1. RequestAnimationFrame Throttling**
```javascript
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});
```

**Why:**
- Scroll events fire very frequently (100+ times per second)
- `requestAnimationFrame` limits to ~60fps (smooth but not excessive)
- Prevents browser lag and battery drain

### **2. CSS will-change**
```css
nav {
    will-change: transform;
}
```

**Why:**
- Tells browser to optimize for animations
- Prepares GPU for transform/opacity changes
- Reduces jank during animations

### **3. Overflow Hidden**
```css
.mobile-widgets-container {
    overflow: hidden;
}
```

**Why:**
- Prevents content from spilling outside container
- Ensures smooth collapse animation
- Hides content during transition

---

## 🔍 Key Differences: Home Page vs Tools Page

### **Home Page**
- Mobile widgets are **directly inside** `<nav>` element
- Uses class `mobile-widgets-container` for targeting
- JavaScript runs on page load

### **Tools Page** (via header template)
- Mobile widgets are in **mobile menu** (different structure)
- Uses same class `mobile-widgets-container`
- JavaScript runs after header template loads

**Both use the same mechanism:**
- Same scroll detection logic
- Same CSS transitions
- Same class toggling (`header-scrolled-down`)

---

## ✅ Summary

1. **JavaScript** detects scroll direction and position
2. **JavaScript** adds/removes `header-scrolled-down` class on `<nav>`
3. **CSS** responds to class change and animates elements
4. **max-height** and **opacity** transitions create smooth hide/show effect
5. **Performance** optimized with throttling and GPU acceleration

**Result**: Smooth, professional mobile experience with more screen space when scrolling down!

