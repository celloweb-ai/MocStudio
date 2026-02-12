# Aurora Theme Documentation

## Overview

The Aurora theme is inspired by the mesmerizing northern lights (Aurora Borealis), featuring vibrant gradients of teal, purple, blue, and green. This theme provides a modern, professional, and visually striking color palette that works beautifully in both light and dark modes.

## Color Palette

### Light Mode Colors

#### Primary Colors
- **Primary (Aurora Teal/Green)**: `hsl(165 85% 45%)` - Main northern lights color
- **Accent (Aurora Purple/Magenta)**: `hsl(280 75% 60%)` - Vibrant accent color
- **Success (Aurora Green)**: `hsl(145 80% 42%)` - Success states
- **Warning (Aurora Yellow/Gold)**: `hsl(45 95% 55%)` - Warning states
- **Destructive (Red)**: `hsl(0 75% 55%)` - Error states

#### Neutral Colors
- **Background**: `hsl(220 25% 97%)` - Light, clean background
- **Foreground**: `hsl(230 20% 12%)` - Primary text
- **Muted**: `hsl(220 20% 94%)` - Subtle backgrounds
- **Border**: `hsl(220 20% 88%)` - Borders and dividers

### Dark Mode Colors

#### Primary Colors
- **Primary (Aurora Teal/Green)**: `hsl(165 85% 50%)` - Brighter for dark backgrounds
- **Accent (Aurora Purple/Magenta)**: `hsl(280 80% 65%)` - Enhanced vibrancy
- **Success (Aurora Green)**: `hsl(145 80% 45%)` - Success states
- **Warning (Aurora Yellow/Gold)**: `hsl(45 95% 60%)` - Warning states
- **Destructive (Red)**: `hsl(0 75% 58%)` - Error states

#### Neutral Colors
- **Background**: `hsl(230 25% 8%)` - Deep night sky
- **Foreground**: `hsl(210 40% 96%)` - Light text
- **Muted**: `hsl(230 20% 14%)` - Subtle backgrounds
- **Border**: `hsl(230 20% 18%)` - Borders and dividers

## Chart Colors

The Aurora theme includes a vibrant palette for data visualization:

1. **Teal**: `hsl(165 85% 45/50%)` - Primary chart color
2. **Purple**: `hsl(280 75/80% 60/65%)` - Secondary chart color
3. **Blue**: `hsl(210 90% 55/60%)` - Tertiary chart color
4. **Green**: `hsl(145 80% 42/45%)` - Quaternary chart color
5. **Pink**: `hsl(320 70/75% 58/62%)` - Quinary chart color

## Special Effects

### Gradients

#### Primary Gradient (Teal to Blue)
```css
.gradient-primary {
  background: linear-gradient(135deg, 
    hsl(165 85% 45%) 0%, 
    hsl(210 90% 55%) 50%,
    hsl(165 85% 50%) 100%);
}
```

#### Accent Gradient (Purple to Pink)
```css
.gradient-accent {
  background: linear-gradient(135deg, 
    hsl(280 75% 60%) 0%, 
    hsl(320 70% 58%) 50%,
    hsl(280 80% 65%) 100%);
}
```

#### Text Gradient (Northern Lights)
```css
.text-gradient {
  background: linear-gradient(135deg, 
    hsl(165 85% 45%) 0%, 
    hsl(280 75% 60%) 50%, 
    hsl(210 90% 55%) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glow Effects

#### Primary Glow
```css
.glow-primary {
  box-shadow: 0 0 40px hsl(var(--primary) / 0.4),
              0 0 80px hsl(var(--accent) / 0.2);
}
```

#### Accent Glow
```css
.glow-accent {
  box-shadow: 0 0 40px hsl(var(--accent) / 0.4),
              0 0 80px hsl(var(--primary) / 0.2);
}
```

### Aurora Shimmer Animation

Create a subtle shimmer effect reminiscent of aurora movements:

```css
.aurora-shimmer {
  position: relative;
  overflow: hidden;
}

.aurora-shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    hsl(var(--primary) / 0.2) 50%, 
    transparent 100%);
  animation: shimmer 3s infinite;
}
```

### Aurora Pulse Animation

```css
.animate-aurora-pulse {
  animation: auroraPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes auroraPulse {
  0%, 100% { 
    opacity: 1; 
    filter: brightness(1);
  }
  50% { 
    opacity: 0.8; 
    filter: brightness(1.2);
  }
}
```

## Status Badges

The theme includes specially styled status badges:

- **Draft**: Muted gray
- **Submitted**: Aurora purple with border
- **Review**: Aurora yellow with border
- **Approved**: Aurora green with border
- **Rejected**: Red with border
- **Implemented**: Aurora teal with border

## Glass Card Effect

Modern glassmorphism effect with Aurora glow:

```css
.glass-card {
  background: hsl(var(--card) / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid hsl(var(--border) / 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 
              0 0 20px hsl(var(--primary) / 0.1);
}
```

## Scrollbar Styling

Custom scrollbar with Aurora gradient:

```css
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, 
    hsl(var(--primary)) 0%, 
    hsl(var(--accent)) 100%);
  border-radius: 9999px;
}
```

## Usage Examples

### Basic Button with Aurora Colors
```tsx
<button className="bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
  Submit MOC Request
</button>
```

### Card with Gradient Header
```tsx
<div className="glass-card">
  <div className="gradient-primary p-6">
    <h2 className="text-white font-bold">Aurora Dashboard</h2>
  </div>
  <div className="p-6">
    Content here
  </div>
</div>
```

### Animated Element
```tsx
<div className="aurora-shimmer animate-aurora-pulse">
  <h1 className="text-gradient text-4xl font-bold">
    MOC Studio
  </h1>
</div>
```

### Status Badge
```tsx
<span className="status-approved px-3 py-1 rounded-full text-sm font-medium">
  Approved
</span>
```

## Design Philosophy

The Aurora theme embodies:

1. **Vibrancy**: Bold, energetic colors that capture attention
2. **Harmony**: Carefully balanced color relationships
3. **Depth**: Layered effects with gradients and glows
4. **Elegance**: Professional appearance suitable for enterprise applications
5. **Accessibility**: High contrast ratios for readability
6. **Versatility**: Works beautifully in both light and dark modes

## Browser Support

The Aurora theme uses modern CSS features:
- HSL color space for easy manipulation
- CSS custom properties (CSS variables)
- Backdrop filters for glassmorphism
- CSS gradients and animations

Supported in all modern browsers (Chrome, Firefox, Safari, Edge).

## Customization

To customize Aurora colors, edit the CSS variables in `src/index.css`:

```css
:root {
  --primary: 165 85% 45%; /* Change to your preferred hue */
  --accent: 280 75% 60%;  /* Adjust accent color */
  /* ... other variables */
}
```

## License

This theme is part of the MOC Studio project.
