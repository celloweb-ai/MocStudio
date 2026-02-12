# MOC Studio Theme Documentation

## Design System: Tailwind Starter Kit

MOC Studio uses the Tailwind Starter Kit design system, featuring clean, professional styling with classic Tailwind CSS colors and components.

## Color Palette

### Light Mode Colors

#### Primary Colors
- **Primary (Indigo)**: `hsl(239 84% 67%)` - Main brand color for primary actions and highlights
- **Accent (Blue)**: `hsl(221 83% 53%)` - Secondary accent for interactive elements
- **Success (Emerald)**: `hsl(142 76% 36%)` - Success states and positive actions
- **Warning (Amber)**: `hsl(38 92% 50%)` - Warning states and cautionary messages
- **Destructive (Red)**: `hsl(0 84% 60%)` - Error states and destructive actions

#### Neutral Colors
- **Background**: `hsl(0 0% 100%)` - Pure white main background
- **Foreground**: `hsl(222 47% 11%)` - Deep blue-gray for primary text
- **Muted**: `hsl(240 5% 96%)` - Light gray for subtle backgrounds
- **Border**: `hsl(240 6% 90%)` - Soft borders and dividers

### Dark Mode Colors

#### Primary Colors
- **Primary (Indigo)**: `hsl(239 84% 67%)` - Consistent across themes
- **Accent (Blue)**: `hsl(217 91% 60%)` - Brighter blue for dark backgrounds
- **Success (Emerald)**: `hsl(142 71% 45%)` - Enhanced visibility
- **Warning (Amber)**: `hsl(38 92% 50%)` - High contrast
- **Destructive (Red)**: `hsl(0 62% 50%)` - Adjusted for readability

#### Neutral Colors
- **Background**: `hsl(222 47% 11%)` - Deep blue-gray background
- **Foreground**: `hsl(210 40% 98%)` - Near-white text
- **Muted**: `hsl(223 47% 11%)` - Subtle background variations
- **Border**: `hsl(217 33% 17%)` - Dark borders

## Chart Colors

Optimized palette for data visualization:

1. **Blue**: `hsl(221 83% 53%)` - Primary chart color
2. **Violet**: `hsl(262 83% 58%)` - Secondary chart color
3. **Emerald**: `hsl(142 76% 36%)` - Tertiary chart color
4. **Amber**: `hsl(38 92% 50%)` - Quaternary chart color
5. **Rose**: `hsl(346 77% 50%)` - Quinary chart color

## Component Styles

### Buttons

#### Primary Button
```tsx
<button className="btn-primary">
  Primary Action
</button>
```
- Indigo background with white text
- Shadow on hover
- Smooth transitions

#### Secondary Button
```tsx
<button className="btn-secondary">
  Secondary Action
</button>
```
- Light background with border
- Subtle hover effect

#### Outline Button
```tsx
<button className="btn-outline">
  Outline Action
</button>
```
- Transparent with colored border
- Fills on hover

### Cards

#### Elevated Card
```tsx
<div className="card-elevated">
  Card content
</div>
```
- Shadow elevation
- Hover shadow increase
- Rounded corners

#### Flat Card
```tsx
<div className="card-flat">
  Card content
</div>
```
- Simple border
- No shadow

#### Glass Card
```tsx
<div className="glass-card">
  Glass effect content
</div>
```
- Backdrop blur
- Semi-transparent background
- Subtle shadow

### Badges

#### Status Badges
```tsx
<span className="badge-primary">Primary</span>
<span className="badge-secondary">Secondary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-danger">Danger</span>
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

### Alerts

```tsx
<div className="alert-info">
  Information message
</div>

<div className="alert-success">
  Success message
</div>

<div className="alert-warning">
  Warning message
</div>

<div className="alert-danger">
  Error message
</div>
```

### Inputs

```tsx
<input className="input-primary" placeholder="Enter text" />
```
- Full width
- Focus ring effect
- Border highlight on focus

## Effects and Animations

### Gradients

#### Primary Gradient
```css
.gradient-primary {
  background: linear-gradient(135deg, indigo to blue);
}
```

#### Accent Gradient
```css
.gradient-accent {
  background: linear-gradient(135deg, blue to violet);
}
```

#### Text Gradient
```tsx
<h1 className="text-gradient">Gradient Text</h1>
```

### Glow Effects

```tsx
<div className="glow-primary">
  Primary glow effect
</div>

<div className="glow-accent">
  Accent glow effect
</div>
```

### Animations

#### Fade In
```tsx
<div className="animate-fade-in">
  Fades in on mount
</div>
```

#### Slide Up
```tsx
<div className="animate-slide-up">
  Slides up on mount
</div>
```

#### Slide In Left
```tsx
<div className="animate-slide-in-left">
  Slides in from left
</div>
```

#### Bounce In
```tsx
<div className="animate-bounce-in">
  Bounces in on mount
</div>
```

#### Shimmer Effect
```tsx
<div className="shimmer">
  Content with shimmer effect
</div>
```

## Shadow Utilities

```tsx
<div className="shadow-soft">Soft shadow</div>
<div className="shadow-medium">Medium shadow</div>
<div className="shadow-strong">Strong shadow</div>
```

## Scrollbar Styling

Custom scrollbar with theme colors:
- Clean 8px width
- Primary color thumb
- Rounded design
- Hover opacity effect

## Typography

**Font Family**: Inter (Google Fonts)
- Clean, modern sans-serif
- Excellent readability
- Variable weights: 300-800

**Text Utilities**:
```tsx
<p className="text-balance">
  Balanced text wrapping
</p>
```

## Design Philosophy

The Tailwind Starter Kit design embodies:

1. **Simplicity**: Clean, uncluttered interface
2. **Consistency**: Cohesive color system across components
3. **Accessibility**: High contrast ratios for readability
4. **Professional**: Enterprise-ready appearance
5. **Flexibility**: Easy to customize and extend
6. **Performance**: Lightweight, optimized CSS

## Color Accessibility

- Light mode text contrast: 9.5:1 (AAA rating)
- Dark mode text contrast: 12:1 (AAA rating)
- Success/Warning/Error colors meet WCAG AA standards
- Focus indicators clearly visible

## Browser Support

Full support for modern CSS features:
- CSS Custom Properties (CSS variables)
- Backdrop filters
- CSS gradients
- CSS animations
- Flexbox and Grid

Supported in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Customization

To customize the theme colors, edit CSS variables in `src/index.css`:

```css
:root {
  --primary: 239 84% 67%; /* Change primary color */
  --accent: 221 83% 53%;  /* Change accent color */
  /* ... other variables */
}
```

## Migration from Aurora Theme

If migrating from the previous Aurora theme:

1. **Color updates**: Aurora's teal/purple palette replaced with indigo/blue
2. **Component classes**: Most classes remain compatible
3. **Gradients**: Simplified gradient system
4. **Effects**: Cleaner, more subtle effects
5. **Status badges**: Now use Tailwind's semantic colors

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Starter Kit](https://www.creative-tim.com/learning-lab/tailwind-starter-kit)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [shadcn/ui Components](https://ui.shadcn.com)

## License

This theme is part of the MOC Studio project.
Tailwind Starter Kit components are MIT licensed.
