# MOC Studio Theme Documentation

## Design System: Spike Next.js Material Design

MOC Studio uses the Spike Next.js design system, featuring **Material Design** principles with clean aesthetics, elevation-based shadows, and comprehensive MUI-inspired components.

## Typography

**Font Family**: Plus Jakarta Sans (Google Fonts)
- Modern, geometric sans-serif font
- Excellent readability and professional appearance
- Variable weights: 300-800
- Used by premium Material Design applications

## Color Palette

### Light Mode Colors

#### Primary Colors
- **Primary (Material Blue)**: `hsl(207 90% 54%)` - #2196F3 equivalent
- **Accent (Material Indigo)**: `hsl(231 48% 48%)` - #3F51B5 equivalent
- **Success (Material Green)**: `hsl(122 39% 49%)` - #4CAF50 equivalent
- **Warning (Material Orange)**: `hsl(36 100% 50%)` - #FF9800 equivalent
- **Destructive (Material Red)**: `hsl(0 65% 51%)` - #F44336 equivalent
- **Info (Material Cyan)**: `hsl(187 71% 50%)` - #00BCD4 equivalent

#### Neutral Colors
- **Background**: `hsl(0 0% 98%)` - Light gray background (#FAFAFA)
- **Foreground**: `hsl(220 20% 18%)` - Dark text for readability
- **Card**: `hsl(0 0% 100%)` - Pure white for elevated surfaces
- **Muted**: `hsl(210 40% 96%)` - Subtle backgrounds
- **Border**: `hsl(214 32% 91%)` - Soft dividers

### Dark Mode Colors

#### Primary Colors
- **Primary (Material Blue)**: `hsl(207 90% 61%)` - Lighter for dark backgrounds
- **Accent (Material Indigo)**: `hsl(235 86% 65%)` - Enhanced visibility
- **Success (Material Green)**: `hsl(122 39% 49%)` - Consistent across themes
- **Warning (Material Orange)**: `hsl(36 100% 50%)` - High contrast
- **Destructive (Material Red)**: `hsl(0 72% 51%)` - Readable on dark
- **Info (Material Cyan)**: `hsl(187 71% 50%)` - Vibrant cyan

#### Neutral Colors
- **Background**: `hsl(220 26% 14%)` - Deep blue-gray (#1E1E2D)
- **Foreground**: `hsl(210 40% 98%)` - Near-white text
- **Card**: `hsl(224 71% 4%)` - Elevated dark surfaces
- **Muted**: `hsl(223 47% 11%)` - Subtle dark backgrounds
- **Border**: `hsl(215 27% 17%)` - Dark dividers

## Material Design Elevation

Spike implements Material Design's elevation system using precise box-shadows:

### Elevation Levels

```tsx
// No elevation
<div className="elevation-0">Content</div>

// Elevation 1 (Buttons, Cards)
<div className="elevation-1">Content</div>

// Elevation 2 (App bars)
<div className="elevation-2">Content</div>

// Elevation 3 (Refresh indicator, Quick entry)
<div className="elevation-3">Content</div>

// Elevation 4 (Modal bottom sheets)
<div className="elevation-4">Content</div>
```

### Material Shadows

Each elevation follows Material Design specifications:
- **Key light**: Top-left shadow for depth
- **Ambient light**: Diffuse shadow for context
- **Contact shadow**: Bottom shadow for grounding

## Component Styles

### Buttons (Material Design)

#### Contained Button
```tsx
<button className="btn-contained">
  Primary Action
</button>
```
- Elevated with shadow
- Uppercase text
- Letter spacing: wider tracking
- Ripple effect on interaction

#### Outlined Button
```tsx
<button className="btn-outlined">
  Secondary Action
</button>
```
- 2px border
- No background (transparent)
- Subtle fill on hover

#### Text Button
```tsx
<button className="btn-text">
  Tertiary Action
</button>
```
- No border or background
- Minimal emphasis
- Background tint on hover

#### Floating Action Button (FAB)
```tsx
<button className="btn-fab">
  <PlusIcon />
</button>
```
- 56px diameter
- Circular shape
- High elevation (shadow-lg)
- Primary action indicator

### Cards (Material Design)

#### Material Card
```tsx
<div className="material-card">
  Card content with elevation
</div>
```
- Elevation 1 by default
- Elevation 3 on hover
- Rounded corners
- No borders (elevation defines edges)

#### Material Paper
```tsx
<div className="material-paper">
  Paper surface with padding
</div>
```
- Elevated surface
- Built-in padding (24px)
- Semantic for content containers

#### Glass Card
```tsx
<div className="glass-card">
  Frosted glass effect
</div>
```
- Backdrop blur
- Material elevation
- Semi-transparent (maintains depth)

### Badges (Material Design)

#### Color Badges
```tsx
<span className="badge-primary">Primary</span>
<span className="badge-secondary">Secondary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
<span className="badge-info">Info</span>
```

#### MOC Status Badges
```tsx
<span className="status-draft">Draft</span>
<span className="status-submitted">Submitted</span>
<span className="status-review">Under Review</span>
<span className="status-approved">Approved</span>
<span className="status-rejected">Rejected</span>
<span className="status-implemented">Implemented</span>
```

### Inputs (Material Design)

#### Material Input
```tsx
<input className="material-input" placeholder="Label" />
```
- Bottom border (2px)
- Border animates to primary on focus
- No rounded corners (Material spec)
- Transparent background

### Alerts

```tsx
<div className="alert-success">
  Success message with green accent
</div>

<div className="alert-error">
  Error message with red accent
</div>

<div className="alert-warning">
  Warning message with orange accent
</div>

<div className="alert-info">
  Info message with blue accent
</div>
```

### Material Chip

```tsx
<div className="material-chip">
  Chip label
</div>
```
- Compact component for tags/filters
- Rounded pill shape
- Hover states
- Optional close icon

### Divider

```tsx
<div className="material-divider" />
```
- 1px horizontal rule
- Subtle contrast
- Vertical spacing (16px margin)

## Gradients

### Primary Gradient
```tsx
<div className="gradient-primary">
  Blue gradient background
</div>
```
Gradient from Material Blue to lighter shade

### Accent Gradient
```tsx
<div className="gradient-accent">
  Indigo to purple gradient
</div>
```

### Success Gradient
```tsx
<div className="gradient-success">
  Green gradient background
</div>
```

### Text Gradient
```tsx
<h1 className="text-gradient">
  Gradient text effect
</h1>
```

## Animations

All animations follow Material Design motion principles with cubic-bezier easing:

### Material Timing Functions
- **Standard**: `cubic-bezier(0.4, 0.0, 0.2, 1)` - 225-300ms
- **Deceleration**: `cubic-bezier(0.0, 0.0, 0.2, 1)` - 225ms
- **Acceleration**: `cubic-bezier(0.4, 0.0, 1, 1)` - 195ms

### Animation Classes

```tsx
// Fade in (225ms)
<div className="animate-fade-in">Content</div>

// Slide up (300ms)
<div className="animate-slide-up">Content</div>

// Slide in from left (225ms)
<div className="animate-slide-in-left">Content</div>

// Scale in (225ms)
<div className="animate-scale-in">Content</div>

// Material grow (300ms)
<div className="animate-material-grow">Content</div>
```

### Ripple Effect

```tsx
<button className="ripple">
  Button with ripple
</button>
```
Simulates Material Design's touch ripple feedback

## Material Design Typography

Complete Material Design type scale:

```tsx
<h1 className="typography-h1">Heading 1</h1>      // 96px, light
<h2 className="typography-h2">Heading 2</h2>      // 60px, light
<h3 className="typography-h3">Heading 3</h3>      // 48px, normal
<h4 className="typography-h4">Heading 4</h4>      // 34px, normal
<h5 className="typography-h5">Heading 5</h5>      // 24px, normal
<h6 className="typography-h6">Heading 6</h6>      // 20px, medium

<p className="typography-subtitle1">Subtitle 1</p>  // 16px, normal
<p className="typography-subtitle2">Subtitle 2</p>  // 14px, medium

<p className="typography-body1">Body 1</p>          // 16px, normal
<p className="typography-body2">Body 2</p>          // 14px, normal

<button className="typography-button">Button</button> // 14px, medium, uppercase

<span className="typography-caption">Caption</span>   // 12px, normal
<span className="typography-overline">Overline</span> // 12px, uppercase
```

## Chart Colors

Material Design palette for data visualization:

1. **Blue**: `hsl(207 90% 54%)` - Primary data series
2. **Purple**: `hsl(291 64% 42%)` - Secondary series
3. **Green**: `hsl(122 39% 49%)` - Success metrics
4. **Orange**: `hsl(36 100% 50%)` - Warning indicators
5. **Pink**: `hsl(340 82% 52%)` - Accent data

## Scrollbar

Minimal Material Design scrollbar:
- 6px width (thin)
- Transparent track
- Subtle thumb (20% opacity)
- Hover darkens to 30%
- Rounded corners

## Design Philosophy

Spike Next.js theme embodies Material Design principles:

1. **Material as Metaphor**: Surfaces with elevation and depth
2. **Bold, Graphic, Intentional**: Strong visual hierarchy
3. **Motion Provides Meaning**: Purposeful animations
4. **Flexible Foundation**: Customizable and scalable
5. **Cross-Platform**: Consistent across devices

## Accessibility

### Color Contrast
- Light mode text: 9.8:1 (AAA)
- Dark mode text: 13.2:1 (AAA)
- All status colors meet WCAG AA minimum
- Focus indicators use 2px ring with primary color

### Touch Targets
- Minimum 48px × 48px for interactive elements
- 8px spacing between adjacent targets
- Clear focus and hover states

## Material Design Resources

- [Material Design 3](https://m3.material.io/)
- [Material UI (MUI)](https://mui.com/)
- [Material Design Colors](https://m2.material.io/design/color/)
- [Material Design Icons](https://fonts.google.com/icons)
- [Spike Next.js Template](https://www.wrappixel.com/templates/spike-next-js-free-admin-template/)

## Browser Support

Full Material Design support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All features gracefully degrade

## Customization

Customize Material colors in `src/index.css`:

```css
:root {
  --primary: 207 90% 54%; /* Material Blue */
  --accent: 231 48% 48%;  /* Material Indigo */
  --success: 122 39% 49%; /* Material Green */
  /* ... other variables */
}
```

## Migration Notes

### From Tailwind Starter Kit
- Primary color changed from indigo to Material Blue
- Elevation system replaces flat shadows
- Typography follows Material type scale
- Button styles now uppercase with tracking
- Cards use elevation instead of borders

### Key Differences
- **Font**: Plus Jakarta Sans (was Inter)
- **Shadows**: Material elevation (not flat)
- **Buttons**: Uppercase text (Material spec)
- **Colors**: Material Design palette
- **Spacing**: 8px baseline grid

## License

This theme adapts Spike Next.js design principles for MOC Studio.
Spike Next.js is created by WrapPixel (MIT License).
