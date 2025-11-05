# Header Design - 8 Vertical Tiles with Flip Animation

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              HEADER (Fixed Top)                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  [FreeToolHub Logo]  │  [Tile 1]  │  [Tile 2]  │  [Tile 3]  │  [Tile 4]  │        │
│                      │            │            │            │            │        │
│                      │  (Full     │  (Full     │  (Full     │  (Full     │        │
│                      │   Height   │   Height   │   Height   │   Height   │        │
│                      │   Vertical)│   Vertical)│   Vertical)│   Vertical)│        │
│                      │            │            │            │            │        │
│                      │            │            │            │            │        │
│                      │            │            │            │            │        │
│                      └────────────┴────────────┴────────────┴────────────┘        │
│                                                                                     │
│                      │  [Tile 5]  │  [Tile 6]  │  [Tile 7]  │  [Tile 8]  │        │
│                      │            │            │            │            │        │
│                      │  (Full     │  (Full     │  (Full     │  (Full     │        │
│                      │   Height   │   Height   │   Height   │   Height   │        │
│                      │   Vertical)│   Vertical)│   Vertical)│   Vertical)│        │
│                      │            │            │            │            │        │
│                      │            │            │            │            │        │
│                      │            │            │            │            │        │
│                      └────────────┴────────────┴────────────┴────────────┘        │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Tile Details - Front Side (8 Widgets)

### Tile 1: Time & Date Widget
- **Content:** Current Time (large) + Current Date
- **Size:** Full height vertical tile
- **Color:** Blue gradient
- **Flip to:** Environmental Data

### Tile 2: Weather Widget
- **Content:** Weather Icon + Temperature + Description
- **Size:** Full height vertical tile
- **Color:** Blue-Purple gradient
- **Flip to:** AQI Widget

### Tile 3: Moon Phase Widget
- **Content:** Moon Icon + Moon Phase Name
- **Size:** Full height vertical tile
- **Color:** Dark blue gradient
- **Flip to:** UV Index Widget

### Tile 4: Sunrise/Sunset Widget
- **Content:** Sunrise Icon + Time | Sunset Icon + Time
- **Size:** Full height vertical tile
- **Color:** Orange gradient
- **Flip to:** Humidity Widget

### Tile 5: Location Widget
- **Content:** Location Icon + Location Name
- **Size:** Full height vertical tile
- **Color:** Green gradient
- **Flip to:** Space Fact Widget

### Tile 6: Word of the Day Widget
- **Content:** Word (large) + Pronunciation
- **Size:** Full height vertical tile
- **Color:** Purple-Indigo gradient
- **Flip to:** Special Day Icon Widget

### Tile 7: Word Definition Widget
- **Content:** Word Definition (text)
- **Size:** Full height vertical tile
- **Color:** Purple gradient
- **Flip to:** Special Day Title Widget

### Tile 8: Word Example Widget
- **Content:** Word Example Sentence
- **Size:** Full height vertical tile
- **Color:** Indigo gradient
- **Flip to:** Special Day Description Widget

---

## Tile Details - Back Side (8 Widgets - After Flip)

### Tile 1 (Back): Environmental Data
- **Content:** AQI Value (large number)
- **Flip from:** Time & Date

### Tile 2 (Back): AQI Widget
- **Content:** Air Quality Index details
- **Flip from:** Weather Widget

### Tile 3 (Back): UV Index Widget
- **Content:** UV Index value + level
- **Flip from:** Moon Phase

### Tile 4 (Back): Humidity Widget
- **Content:** Humidity percentage + indicator
- **Flip from:** Sunrise/Sunset

### Tile 5 (Back): Space Fact Widget
- **Content:** Interesting space fact (text)
- **Flip from:** Location

### Tile 6 (Back): Special Day Icon Widget
- **Content:** Special day emoji/icon (large)
- **Flip from:** Word of the Day

### Tile 7 (Back): Special Day Title Widget
- **Content:** Special day title/name
- **Flip from:** Word Definition

### Tile 8 (Back): Special Day Description Widget
- **Content:** Special day description text
- **Flip from:** Word Example

---

## Flip Animation Behavior

1. **Auto-flip:** Tiles flip automatically every X seconds (e.g., 5-10 seconds)
2. **Manual flip:** Click on any tile to flip it individually
3. **Synchronized flip:** Option to flip all tiles together or independently
4. **Smooth transition:** 3D flip animation (rotateY)

---

## Navigation Buttons Row (Below Header)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Navigation Buttons Row                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Home]  [Calculators]  [Loan Calculator]  [PDF Tools]  [Image Tools]    │
│  [Utilities]  [About]  [Contact]                                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Tile Dimensions
- **Width:** Equal distribution (each tile = ~12.5% of header width)
- **Height:** Full header height (e.g., 120-150px)
- **Gap:** Small gap between tiles (e.g., 4-8px)

### Responsive Behavior
- **Desktop (lg+):** 8 tiles in a row, full height
- **Tablet (md):** 4 tiles per row, 2 rows
- **Mobile (sm):** 2 tiles per row, 4 rows, or stack vertically

### Color Scheme
- Each tile has unique gradient colors
- Front and back sides may have different colors
- Smooth color transitions on flip

---

## Visual Representation

### Front View (8 Widgets)
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ Time │ │Weather│ │ Moon │ │Sunrise│ │Location│ │  Word │ │Define│ │Example│
│      │ │      │ │ Phase│ │/Sunset│ │        │ │  of   │ │      │ │       │
│      │ │      │ │      │ │       │ │        │ │  Day  │ │      │ │       │
│      │ │      │ │      │ │       │ │        │ │       │ │      │ │       │
│      │ │      │ │      │ │       │ │        │ │       │ │      │ │       │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### Back View (8 Widgets - After Flip)
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│Env   │ │ AQI  │ │  UV  │ │Humidity│ │Space │ │Special│ │Special│ │Special│
│Data  │ │      │ │Index │ │        │ │ Fact │ │ Day  │ │ Day  │ │ Day  │
│      │ │      │ │      │ │        │ │      │ │ Icon │ │Title │ │Desc  │
│      │ │      │ │      │ │        │ │      │ │      │ │      │ │      │
│      │ │      │ │      │ │        │ │      │ │      │ │      │ │      │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

