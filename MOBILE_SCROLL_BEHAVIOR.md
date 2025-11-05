# Mobile Scroll-to-Hide Header - Detailed Behavior

## Overview
On mobile devices (screens < 1024px), the header widgets and navigation buttons automatically hide when scrolling down the page, and reappear when scrolling up. This provides more screen space for content while keeping the logo visible.

---

## 📱 Mobile Behavior Details

### **When Scrolling DOWN the Page (Moving Down):**
- ✅ **Widgets hide** (collapse to 0 height)
- ✅ **Navigation buttons hide** (collapse to 0 height)
- ✅ **Logo remains visible** at the top
- ✅ **Smooth animation** (0.3s ease-in-out)

### **When Scrolling UP the Page (Moving Up):**
- ✅ **Widgets reappear** (expand back to full height)
- ✅ **Navigation buttons reappear** (expand back to full height)
- ✅ **Logo stays visible** (already visible)
- ✅ **Smooth animation** (0.3s ease-in-out)

### **At the Top of the Page (Scroll position ≤ 50px):**
- ✅ **Widgets are always visible**
- ✅ **Navigation buttons are always visible**
- ✅ **Logo is always visible**

---

## 🎯 Technical Implementation

### **Scroll Threshold:**
- **50 pixels**: Header elements hide after scrolling down 50px
- **Below 50px**: Header elements are always visible

### **Scroll Detection:**
- Uses `window.pageYOffset` to track scroll position
- Compares current scroll with previous scroll to detect direction
- Throttled with `requestAnimationFrame` for smooth performance

### **CSS Transitions:**
```css
- max-height: 0 → collapses elements
- opacity: 0 → fades out elements
- padding: 0 → removes spacing
- margin: 0 → removes margins
- transition: 0.3s ease-in-out → smooth animation
```

---

## 📋 Step-by-Step Behavior

### **Scenario 1: User scrolls down from top**
1. User is at top of page (scroll = 0px)
   - ✅ Widgets visible
   - ✅ Navigation visible
   - ✅ Logo visible

2. User scrolls down 30px
   - ✅ Widgets still visible (below 50px threshold)
   - ✅ Navigation still visible
   - ✅ Logo visible

3. User scrolls down 60px (past threshold)
   - ❌ Widgets hide (smooth collapse)
   - ❌ Navigation hides (smooth collapse)
   - ✅ Logo remains visible

4. User continues scrolling down
   - ❌ Widgets stay hidden
   - ❌ Navigation stays hidden
   - ✅ Logo stays visible

### **Scenario 2: User scrolls up**
1. User is at scroll position 200px (widgets hidden)
   - ❌ Widgets hidden
   - ❌ Navigation hidden
   - ✅ Logo visible

2. User starts scrolling up
   - ✅ Widgets reappear (smooth expand)
   - ✅ Navigation reappears (smooth expand)
   - ✅ Logo stays visible

3. User scrolls back to top (scroll ≤ 50px)
   - ✅ Widgets visible
   - ✅ Navigation visible
   - ✅ Logo visible

---

## 🎨 Visual States

### **State 1: Fully Visible (Default)**
```
┌─────────────────────────┐
│       LOGO              │
├─────────────────────────┤
│  Widget 1 | Widget 2   │
│  Widget 3 | Widget 4   │
│  (Mobile Widget Grid)   │
├─────────────────────────┤
│ Home | Calculator | ... │
│ (Navigation Buttons)    │
└─────────────────────────┘
```

### **State 2: Hidden (Scrolled Down)**
```
┌─────────────────────────┐
│       LOGO              │ ← Only logo visible
│                         │
│  (Widgets hidden)       │
│  (Navigation hidden)    │
└─────────────────────────┘
```

---

## 🔧 Files Modified

### **Home Page** (`/index.html`):
- Mobile scroll detection JavaScript
- CSS for mobile hide/show behavior
- Targets: `.lg\\:hidden.bg-white.border-b` (widgets) and `.navigation-buttons-row`

### **Tools Pages** (`/templates/header.html`):
- Mobile scroll detection JavaScript
- CSS for mobile hide/show behavior
- Targets: `.navigation-buttons-row` (widgets are in mobile menu on tools pages)

---

## 📱 Device Compatibility

- ✅ **Mobile phones** (< 768px): Full scroll-to-hide functionality
- ✅ **Tablets** (768px - 1023px): Full scroll-to-hide functionality
- ❌ **Desktop/Laptop** (≥ 1024px): Different behavior (desktop scroll-to-hide widgets only)

---

## ⚙️ JavaScript Logic

```javascript
// Scroll threshold
const scrollThreshold = 50; // Hide after 50px

// Hide when scrolling DOWN (past threshold)
if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
    header.classList.add('header-scrolled-down'); // Hide elements
}

// Show when scrolling UP or at top
else if (currentScroll < lastScroll || currentScroll <= scrollThreshold) {
    header.classList.remove('header-scrolled-down'); // Show elements
}
```

---

## 🎯 Key Points

1. **Logo Always Visible**: Logo never hides, stays at top
2. **Smooth Animations**: 0.3s transitions for professional feel
3. **Performance Optimized**: Uses `requestAnimationFrame` to throttle scroll events
4. **Responsive**: Only works on mobile/tablet (< 1024px)
5. **Consistent**: Same behavior on home page and tools pages
6. **User-Friendly**: More screen space when scrolling, easy access when needed

---

## ✅ Benefits

- **More Screen Space**: Content gets more visibility when scrolling down
- **Better UX**: Users can focus on content without header distractions
- **Quick Access**: Header reappears immediately when scrolling up
- **Professional**: Smooth animations make the experience polished
- **Mobile Optimized**: Designed specifically for smaller screens

---

## 🧪 Testing Checklist

- [ ] Scroll down on mobile - widgets and navigation hide
- [ ] Scroll up on mobile - widgets and navigation reappear
- [ ] Logo remains visible at all times
- [ ] Smooth animations (no jerky movements)
- [ ] Works at top of page (elements always visible)
- [ ] Works on both home page and tools pages
- [ ] No performance issues (smooth scrolling)
- [ ] Works on different mobile screen sizes

