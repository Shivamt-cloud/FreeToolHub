# Mobile Widget Issues - Confirmed

## Issues Found:

### 1. Home Page - Widgets Not Visible on Mobile ✅ CONFIRMED
**Problem:**
- Mobile widgets (`mobile-weather-widget` and `mobile-word-widget`) are inside the `mobile-menu` div
- Mobile menu has `class="hidden lg:hidden"` which means it's hidden by default
- Widgets only show when user clicks hamburger menu to open mobile menu
- **Result:** Widgets are not visible on mobile home page

**Location:** `index.html` lines 1573-1674

### 2. Tools Pages - Widgets Overlapping Tool Content ✅ CONFIRMED  
**Problem:**
- `templates/header.html` has NO visible mobile widgets in the mobile menu section
- Mobile menu (lines 229-246) only contains navigation links
- The hidden widget divs (lines 172-226) are positioned off-screen with `left: -9999px; opacity: 0;`
- Fixed header with `z-40` may overlap tool content
- `fixMainSpacing()` function exists but may not account for mobile menu opening
- **Result:** No widgets visible AND header may overlap tool content

**Location:** `templates/header.html`

## Fixes Needed:

1. **Home Page (`index.html`):**
   - Move mobile widgets OUTSIDE the mobile menu
   - Place them right after the nav, before main content
   - Make them always visible on mobile with `lg:hidden` class
   - Keep mobile menu for navigation only

2. **Tools Pages (`templates/header.html`):**
   - Add mobile widgets to the mobile menu section (similar to index.html)
   - Ensure widgets are visible when mobile menu opens
   - Fix spacing to prevent header overlap
   - Update `fixMainSpacing()` to account for mobile menu height

3. **Spacing Fix:**
   - Ensure main content has proper `padding-top` on mobile
   - Account for header height + potential mobile menu height
   - Test on actual mobile devices

## Next Steps:
- Implement fixes for both files
- Test on mobile browser
- Verify widgets are visible and not overlapping content

