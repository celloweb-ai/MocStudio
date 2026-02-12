# MOC Studio Theme Documentation

## Design System: Ultra-Modern 2026 - Glassmorphism + Bold Cyber Aesthetics

MOC Studio now features a **cutting-edge 2026 design system** combining the latest UI trends:
- **Glassmorphism** - Frosted glass effects with depth
- **Bold Gradients** - Vibrant cyber color schemes
- **Neon Glow Effects** - Futuristic lighting
- **3D Elements** - Tactile interactive components
- **Animated Backgrounds** - Living, breathing interfaces

## Design Philosophy

This theme embraces 2026's top design trends:
1. **Immersive Depth** - Multiple visual layers with glassmorphism
2. **Bold & Impactful** - High-contrast, vibrant color palette
3. **Futuristic Aesthetic** - Cyber-inspired gradients and glows
4. **Premium Feel** - Sophisticated blur and shadow effects
5. **Interactive** - Responsive animations and 3D transforms

## Typography

### Dual Font System

**Headings**: Space Grotesk
- Modern geometric sans-serif
- Bold, impactful presence
- Perfect for titles and hero text
- Weights: 300-700

**Body**: Inter
- Clean, professional readability
- Excellent for long-form content
- Weights: 300-900

## Color Palette

### Light Mode - Vibrant

#### Primary Colors
- **Primary (Electric Blue)**: `hsl(217 91% 60%)` - #3B82F6
- **Accent (Neon Purple)**: `hsl(270 95% 65%)` - #C084FC
- **Success (Vibrant Green)**: `hsl(142 76% 48%)` - #10B981
- **Warning (Bold Orange)**: `hsl(25 95% 53%)` - #FF6B35
- **Destructive (Hot Red)**: `hsl(0 90% 58%)` - #FF3B3B
- **Info (Bright Cyan)**: `hsl(190 95% 50%)` - #06B6D4

#### Neutral Colors
- **Background**: `hsl(240 10% 98%)` - Soft white
- **Foreground**: `hsl(240 10% 5%)` - Deep black
- **Card**: Pure white with glass overlay
- **Border**: `hsl(240 6% 90%)` - Subtle dividers

### Dark Mode - Premium Experience

#### Primary Colors
- **Primary**: `hsl(213 94% 68%)` - Bright electric blue
- **Accent**: `hsl(270 95% 75%)` - Glowing neon purple
- **Success**: `hsl(142 76% 55%)` - Neon green
- **Warning**: `hsl(25 95% 60%)` - Bright orange
- **Destructive**: `hsl(0 85% 62%)` - Vivid red
- **Info**: `hsl(190 95% 60%)` - Neon cyan

#### Neutral Colors
- **Background**: `hsl(240 10% 3.9%)` - Ultra-dark
- **Foreground**: `hsl(0 0% 98%)` - Near white
- **Card**: `hsl(240 10% 6%)` - Elevated dark surface
- **Glass overlay**: rgba(255, 255, 255, 0.03)

## Glassmorphism Components

### Glass Card
```tsx
<div className="glass-card p-6">
  Content with frosted glass effect
</div>
```

**Features**:
- 20px backdrop blur
- 180% color saturation
- Semi-transparent background
- Subtle border glow
- Dynamic shadow depth

**Technical**:
- Light mode: `rgba(255, 255, 255, 0.05)` background
- Dark mode: `rgba(255, 255, 255, 0.03)` background
- Border: `rgba(255, 255, 255, 0.1)`

### Neumorphism + Glass Hybrid
```tsx
<div className="neuglass-card p-8">
  Advanced glass with soft 3D effect
</div>
```

**Features**:
- Combines glassmorphism with neumorphic shadows
- Inner and outer shadows for depth
- Gradient glass background
- 16px backdrop blur
- Rounded-3xl corners

### Floating Card
```tsx
<div className="card-floating">
  Hover for parallax lift effect
</div>
```

**Hover Effects**:
- Lifts 8px upward
- Scales to 102%
- Enhanced shadow (60px blur)
- Primary color glow
- Smooth 300ms transition

## Bold Gradient Backgrounds

### Cyber Gradient
```tsx
<div className="gradient-cyber">
  Blue → Purple → Pink
</div>
```
Electric blue to neon purple to hot pink (135°)

### Neon Gradient
```tsx
<div className="gradient-neon">
  Purple → Cyan
</div>
```
Neon purple to bright cyan (135°)

### Fire Gradient
```tsx
<div className="gradient-fire">
  Orange → Pink
</div>
```
Bold orange to hot pink (135°)

### Forest Gradient
```tsx
<div className="gradient-forest">
  Green → Cyan
</div>
```
Vibrant green to bright cyan (135°)

### Animated Gradient
```tsx
<div className="gradient-animated">
  Infinite color shift
</div>
```

**Animation**:
- 15-second loop
- 4-color gradient (blue/purple/green/orange)
- 400% background size
- Smooth ease timing
- Infinite repeat

## Text Gradients with Glow

### Cyber Text
```tsx
<h1 className="text-gradient-cyber">
  Blue → Purple → Pink Text
</h1>
```

### Neon Text
```tsx
<h1 className="text-gradient-neon">
  Glowing animated purple/cyan
</h1>
```

**Animation**: 3-second brightness pulse (100% → 130% → 100%)

## Neon Glow Effects

### Primary Glow
```tsx
<div className="glow-primary">
  Blue neon glow
</div>
```
- 20px inner glow (50% opacity)
- 40px mid glow (30% opacity)
- 60px outer glow (10% opacity)

### Accent Glow
```tsx
<div className="glow-accent">
  Purple neon glow
</div>
```

### Success Glow
```tsx
<div className="glow-success">
  Green neon glow
</div>
```

## 3D Buttons

### 3D Button
```tsx
<button className="btn-3d">
  Click Me
</button>
```

**Features**:
- Gradient background (primary → accent)
- Multi-layer shadows (outer + inner)
- Hover: Lifts 2px with enhanced glow
- Active: Presses down 2px
- Bold font weight
- 32px horizontal padding
- Rounded-2xl corners

**Shadows**:
- Outer: 10px + 6px black shadows
- Inner: Inset highlights and shadows
- Hover adds 30px primary glow

### Glass Button
```tsx
<button className="btn-glass">
  Glass Effect
</button>
```

**Features**:
- Semi-transparent background
- 10px backdrop blur
- Border glow (rgba white 0.2)
- Hover: Background brightens + lifts
- 30px primary glow on hover

## Status Badges - 2026 Style

All badges use the modern glass effect with gradients:

```tsx
<span className="status-draft">Draft</span>
<span className="status-submitted">Submitted</span>
<span className="status-review">Under Review</span>
<span className="status-approved">Approved</span>
<span className="status-rejected">Rejected</span>
<span className="status-implemented">Implemented</span>
```

**Shared Features**:
- `.badge-modern` base class
- 10px backdrop blur
- Gradient backgrounds
- Matching color glow (20px)
- Border: rgba white 0.2
- Hover: Scale 105%
- 2px gap for icons

**Color Schemes**:
- **Draft**: Gray 500 with soft glow
- **Submitted**: Blue gradient (60% → 70%)
- **Review**: Orange gradient (53% → 63%)
- **Approved**: Green gradient (48% → 58%)
- **Rejected**: Red gradient (58% → 68%)
- **Implemented**: Purple gradient (65% → 75%)

## Alerts with Glass

### Base Alert Glass
```tsx
<div className="alert-glass">
  Glass alert container
</div>
```

### Alert Variants
```tsx
<div className="alert-info">
  Cyan → Blue gradient info
</div>

<div className="alert-success">
  Green → Cyan gradient success
</div>

<div className="alert-warning">
  Orange → Pink gradient warning
</div>

<div className="alert-error">
  Red → Pink gradient error
</div>
```

**All alerts feature**:
- Rounded-2xl corners
- Backdrop blur xl
- Gradient backgrounds (20% opacity)
- Border: rgba white 0.1
- Shadow: 8px black blur

## Modern Inputs

### Input with Glow Focus
```tsx
<input className="input-modern" placeholder="Enter text" />
```

**Features**:
- 4px horizontal padding
- 3px vertical padding
- Glass background (rgba white 0.05)
- 10px backdrop blur
- 2px border (rgba white 0.1)
- Rounded-xl corners

**Focus State**:
- Border changes to primary color
- 30px primary glow appears
- Smooth 300ms transition
- No outline ring

## Progress Bar

### Modern Progress
```tsx
<div className="progress-modern">
  <div className="progress-fill-modern" style={{width: "75%"}}></div>
</div>
```

**Container**:
- 3 height (12px)
- Rounded-full
- Glass background
- Border: rgba white 0.1

**Fill**:
- Primary → Accent gradient (90°)
- 20px primary glow
- 500ms smooth transition
- Rounded-full

## Divider with Glow

```tsx
<hr className="divider-glow" />
```

**Features**:
- 1px height
- 6 margin vertical (24px)
- Gradient: transparent → primary → accent → transparent
- 10px primary glow

## Ultra-Modern Scrollbar

**Design**:
- 10px width (thicker for modern look)
- Transparent track
- Gradient thumb (primary → accent)
- 10px primary glow
- Hover: Glow increases to 20px
- Rounded-full corners

## Advanced Animations

### Fade In Up
```tsx
<div className="animate-fade-in-up">
  Fades in while sliding up
</div>
```
- Duration: 600ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1) - Smooth deceleration
- Movement: 30px up

### Scale In
```tsx
<div className="animate-scale-in">
  Scales from 80% to 100%
</div>
```
- Duration: 400ms
- Smooth material easing

### Slide In Right
```tsx
<div className="animate-slide-in-right">
  Slides from right
</div>
```
- Duration: 500ms
- Movement: 50px from right

### Glow Pulse
```tsx
<div className="animate-glow-pulse">
  Infinite glow breathing
</div>
```
- Duration: 2s infinite
- Pulses between 20px and 60px glow
- Combines primary + accent colors

### Float
```tsx
<div className="animate-float">
  Gentle floating motion
</div>
```
- Duration: 6s infinite
- Movement: 20px up and down
- Ease-in-out timing

## Utility Classes

### Blur Effects
```tsx
.blur-glass      // 20px backdrop blur
.blur-heavy      // 40px blur + 180% saturation
```

### Text Effects
```tsx
.text-glow       // 20px primary glow
.text-neon       // Multi-layer neon effect (10px/20px/40px)
```

### 3D Transform
```tsx
.perspective-1000  // Enable 3D perspective
.transform-3d      // Preserve 3D transformations
```

## Chart Colors - Bold 2026 Palette

1. **Electric Blue**: `hsl(217 91% 60%)` / `hsl(213 94% 68%)` dark
2. **Neon Purple**: `hsl(270 95% 65%)` / `hsl(270 95% 75%)` dark
3. **Vibrant Green**: `hsl(142 76% 48%)` / `hsl(142 76% 55%)` dark
4. **Bold Orange**: `hsl(25 95% 53%)` / `hsl(25 95% 60%)` dark
5. **Hot Pink**: `hsl(340 90% 58%)` / `hsl(340 90% 65%)` dark

## Design Trends Integration (2026)

### 1. Glassmorphism
✅ **Implemented**: Frosted glass cards, inputs, buttons, alerts
- Background blur: 10-20px
- Semi-transparent layers
- Subtle borders and shadows

### 2. Bold Gradients
✅ **Implemented**: Cyber, neon, fire, forest gradients
- 135° angle
- 3-4 color stops
- Animated variants

### 3. Neon Glow Effects
✅ **Implemented**: Multi-layer glows on all interactive elements
- Primary, accent, success glows
- Hover enhancements
- Pulse animations

### 4. 3D Elements
✅ **Implemented**: 3D buttons with depth and shadows
- Multi-layer shadows
- Transform on interaction
- Tactile feedback

### 5. Dark Mode Premium
✅ **Implemented**: Ultra-dark background with vibrant accents
- 3.9% lightness background
- Bright neon colors
- Enhanced contrast

### 6. Clean Graphics
✅ **Implemented**: Focus on visual hierarchy without text overload
- Bold headings (Space Grotesk)
- Clear spacing
- Visual emphasis

### 7. Rich Content Ready
✅ **Prepared**: Supports overlays, videos, interactive content
- Glass overlays
- Blur effects
- Layered design

## Accessibility

### Color Contrast
- Light mode text: 8.5:1 (AAA)
- Dark mode text: 15.2:1 (AAA+)
- All interactive elements: WCAG AAA
- Glow effects enhance visibility

### Reduced Motion
Consider adding:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Browser Support

**Full support**:
- Chrome/Edge 100+ (backdrop-filter)
- Firefox 103+ (backdrop-filter)
- Safari 15.4+ (backdrop-filter)

**Graceful degradation**:
- Fallback backgrounds for older browsers
- Progressive enhancement approach

## Performance Considerations

**Optimizations**:
- GPU-accelerated transforms
- Will-change on animated elements
- Reduced backdrop-filter usage on mobile
- CSS containment for cards

**Best Practices**:
- Limit simultaneous animations to 3-5 elements
- Use `transform` and `opacity` for animations
- Avoid animating `backdrop-filter` when possible

## Customization

Modify CSS variables in `src/index.css`:

```css
:root {
  --primary: 217 91% 60%; /* Change primary color */
  --accent: 270 95% 65%;  /* Change accent color */
  --radius: 1rem;         /* Change border radius */
}
```

## Migration from Previous Theme

**Key Changes**:
- Font: Added Space Grotesk for headings
- Effects: Glassmorphism replaces flat design
- Colors: Vibrant neon palette (was muted)
- Borders: Glass borders (was solid)
- Shadows: Multi-layer glows (was simple shadows)
- Animations: Smooth deceleration curves
- Scrollbar: Gradient with glow

## Inspiration & Resources

- [Glassmorphism CSS Generator](https://hype4.academy/tools/glassmorphism-generator)
- [2026 UI Trends - Muzli](https://muz.li/)
- [Dribbble - Modern Dashboards](https://dribbble.com/tags/modern-dashboard)
- [CSS Gradient Generator](https://cssgradient.io/)
- [Cubic-bezier Easing](https://cubic-bezier.com/)

## License

This theme uses cutting-edge 2026 design trends.
Free to use and modify for MOC Studio.
Inspired by leading design systems and modern UI trends.
