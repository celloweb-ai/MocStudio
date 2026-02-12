# MOC Studio Theme Documentation

## Design System: NextKit Admin with Flowbite Components

MOC Studio now uses the **NextKit Admin** design system, featuring clean **Tailwind CSS** design with **Flowbite** component library integration. This combination provides modern, responsive, and accessible UI components ready for production.

## Overview

NextKit Admin is a modern, open-source admin template built with:
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS framework  
- **Flowbite** - Component library for Tailwind
- **ApexCharts** - Data visualization
- **Tabler Icons** - Clean icon system

## Typography

**Font Family**: Inter
- System font stack fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI'`
- Professional, modern sans-serif
- Excellent readability across all sizes
- Variable weights: 300-900

## Color Palette

### Light Mode

#### Primary Colors
- **Primary (Modern Blue)**: `hsl(217 91% 60%)` - #3B82F6 (Tailwind blue-500)
- **Accent (Vibrant Purple)**: `hsl(262 83% 58%)` - #A855F7 (Tailwind purple-500)
- **Success (Fresh Green)**: `hsl(142 71% 45%)` - #10B981 (Tailwind emerald-500)
- **Warning (Amber Orange)**: `hsl(32 95% 44%)` - #F59E0B (Tailwind amber-500)
- **Destructive (Red)**: `hsl(0 84% 60%)` - #EF4444 (Tailwind red-500)
- **Info (Cyan Blue)**: `hsl(199 89% 48%)` - #06B6D4 (Tailwind cyan-500)

#### Neutral Colors
- **Background**: `hsl(0 0% 100%)` - Pure white (#FFFFFF)
- **Foreground**: `hsl(220 13% 15%)` - Dark gray text
- **Card**: `hsl(0 0% 100%)` - White surfaces
- **Muted**: `hsl(240 5% 96%)` - Light gray backgrounds
- **Border**: `hsl(220 13% 91%)` - Subtle borders

### Dark Mode

#### Primary Colors
- **Primary**: `hsl(213 94% 68%)` - Bright blue for dark backgrounds
- **Accent**: `hsl(263 70% 50%)` - Vivid purple
- **Success**: `hsl(142 71% 45%)` - Consistent green
- **Warning**: `hsl(32 95% 44%)` - High contrast orange
- **Destructive**: `hsl(0 62% 50%)` - Readable red
- **Info**: `hsl(199 89% 48%)` - Bright cyan

#### Neutral Colors
- **Background**: `hsl(224 71% 4%)` - Very dark blue-gray
- **Foreground**: `hsl(210 40% 98%)` - Near white text
- **Card**: `hsl(224 71% 6%)` - Slightly elevated dark surface
- **Muted**: `hsl(223 47% 11%)` - Dark muted backgrounds
- **Border**: `hsl(215 28% 17%)` - Dark borders

## Flowbite Component Styles

### Buttons

Flowbite provides 4 button variants:

#### Primary Button
```tsx
<button className="btn-primary">
  Primary Action
</button>
```
- Solid background with primary color
- White text
- Focus ring (4px)
- Smooth hover transition

#### Secondary Button
```tsx
<button className="btn-secondary">
  Secondary Action
</button>
```
- White background (light) / Gray-800 (dark)
- Border outline
- Gray text
- Subtle hover effect

#### Outline Button
```tsx
<button className="btn-outline">
  Outline Action
</button>
```
- Transparent background
- 2px primary border
- Fills with primary on hover
- Inverts text color

#### Ghost Button
```tsx
<button className="btn-ghost">
  Ghost Action
</button>
```
- Fully transparent
- Text only
- Subtle background on hover

### Alerts

Flowbite alert components with icons and borders:

```tsx
<div className="alert-info">
  <InfoIcon />Information message
</div>

<div className="alert-success">
  <CheckIcon />Success message
</div>

<div className="alert-warning">
  <WarningIcon />Warning message
</div>

<div className="alert-error">
  <ErrorIcon />Error message
</div>
```

**Features**:
- Flex layout for icons
- Colored backgrounds (subtle)
- Matching borders
- Full dark mode support

### Badges

#### Color Badges
```tsx
<span className="badge-primary">Primary</span>
<span className="badge-secondary">Secondary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
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

**Badge Features**:
- Pill shape (rounded-full)
- 2.5px horizontal padding
- Extra small text (xs)
- Medium font weight
- Colored background + border

### Input Fields

```tsx
<input className="input-primary" placeholder="Enter text" />
```

**Features**:
- Full width block
- Padding: 2.5 (10px)
- Gray background (light) / Dark background (dark)
- Border with focus ring
- Primary color on focus

### Tables

Flowbite table styling:

```tsx
<table className="table-flowbite">
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
    </tr>
  </tbody>
</table>
```

**Features**:
- Uppercase header text
- Gray-50 header background
- Striped rows (hover)
- Full dark mode support

### Dropdowns

```tsx
<div className="dropdown-flowbite">
  <ul>
    <li>Option 1</li>
    <li>Option 2</li>
  </ul>
</div>
```

**Features**:
- White background with shadow
- Rounded corners
- Divider lines between groups
- Z-index: 10

### Progress Bars

```tsx
<div className="progress-bar">
  <div className="progress-fill" style="width: 75%"></div>
</div>
```

**Features**:
- 2.5 height (10px)
- Rounded full
- Smooth width transitions (300ms)
- Primary color fill

### Cards

#### Glass Card
```tsx
<div className="glass-card">
  Card content
</div>
```
- Subtle shadow
- Hover shadow increase
- Border included

#### Card Variants
```tsx
<div className="card-flat">Flat card</div>
<div className="card-elevated">Elevated card</div>
<div className="card-hover">Hover effect card</div>
```

### Timeline

```tsx
<ol className="relative">
  <li className="timeline-item">
    <div>Event 1</div>
  </li>
  <li className="timeline-item">
    <div>Event 2</div>
  </li>
</ol>
```

**Features**:
- Left border line
- Relative positioning
- Gray border (light) / Dark border (dark)

### Divider

```tsx
<hr className="divider" />
```
- 1px height
- 4 margin vertical (16px)
- Gray background

## Gradients

### Primary Gradient
```tsx
<div className="gradient-primary">
  Blue gradient background
</div>
```

### Accent Gradient  
```tsx
<div className="gradient-accent">
  Purple to pink gradient
</div>
```

### Success Gradient
```tsx
<div className="gradient-success">
  Green gradient
</div>
```

### Text Gradient
```tsx
<h1 className="text-gradient">
  Gradient text effect
</h1>
```

## Animations

Smooth, modern animations:

```tsx
// Fade in (300ms)
<div className="animate-fade-in">Content</div>

// Slide up (300ms)
<div className="animate-slide-up">Content</div>

// Slide down (300ms)
<div className="animate-slide-down">Content</div>

// Slide in from left (300ms)
<div className="animate-slide-in-left">Content</div>

// Slide in from right (300ms)
<div className="animate-slide-in-right">Content</div>

// Scale in (200ms)
<div className="animate-scale-in">Content</div>
```

**Timing**: All animations use `ease-out` for natural deceleration

## Utility Classes

### Focus Ring

```tsx
<button className="focus-ring">
  Has focus ring
</button>

<button className="focus-ring-primary">
  Primary color focus ring
</button>
```

### Shadow Utilities

```tsx
<div className="shadow-soft">Soft shadow</div>
<div className="shadow-medium">Medium shadow</div>
<div className="shadow-strong">Strong shadow</div>
```

### Hover Glow

```tsx
<div className="hover-glow">
  Glows on hover
</div>
```

### Smooth Transitions

```tsx
<div className="transition-smooth">
  Smooth transition for all properties
</div>
```

## Chart Colors

Modern, vibrant palette for data visualization:

1. **Blue**: `hsl(217 91% 60%)` - Primary data
2. **Purple**: `hsl(262 83% 58%)` - Secondary data
3. **Green**: `hsl(142 71% 45%)` - Success metrics
4. **Orange**: `hsl(32 95% 44%)` - Warning indicators
5. **Pink**: `hsl(340 82% 52%)` - Accent data

## Scrollbar

Modern, clean scrollbar design:
- 8px width
- Muted track (30% opacity)
- Muted-foreground thumb (30% opacity)
- Hover increases to 50% opacity
- Rounded corners
- Smooth color transitions

## Modal Backdrop

```tsx
<div className="modal-backdrop">
  <!-- Modal content -->
</div>
```

**Features**:
- Fixed positioning
- Z-index: 40
- Gray-900 with 50% opacity (light)
- Gray-900 with 80% opacity (dark)

## Design Principles

NextKit Admin + Flowbite embodies:

1. **Clean & Minimal**: Uncluttered interfaces
2. **Consistent**: Unified component design language
3. **Accessible**: WCAG AA compliant colors
4. **Responsive**: Mobile-first approach
5. **Fast**: Optimized performance
6. **Flexible**: Easy customization

## Accessibility

### Color Contrast
- Light mode text: 9.2:1 (AAA)
- Dark mode text: 12.8:1 (AAA)
- All status colors: WCAG AA minimum
- Focus rings: 4px with 50% opacity

### Interactive Elements
- Minimum touch target: 44px × 44px
- Clear focus states on all interactive elements
- Keyboard navigation support
- Screen reader friendly markup

## Flowbite Resources

- [Flowbite Official](https://flowbite.com/)
- [Flowbite Components](https://flowbite.com/docs/getting-started/introduction/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextKit GitHub](https://github.com/wrappixel/nextkit-admin-with-supabase-and-mongodb)
- [Tabler Icons](https://tabler.io/icons)

## Browser Support

Full support for modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

Customize theme colors in `src/index.css`:

```css
:root {
  --primary: 217 91% 60%; /* Modern Blue */
  --accent: 262 83% 58%;  /* Vibrant Purple */
  --success: 142 71% 45%; /* Fresh Green */
  /* ... other variables */
}
```

## Migration Notes

### From Spike Next.js Material Design
- Font changed back to Inter (from Plus Jakarta Sans)
- Material elevation replaced with Flowbite shadows
- Typography no longer uses Material type scale
- Button styles now use Flowbite conventions
- Focus rings are 4px (was 2px)
- Components follow Flowbite naming

### Key Differences
- **Component Library**: Flowbite (was Material UI)
- **Design Language**: Tailwind utility-first (was Material Design)
- **Button Style**: Lowercase text (was uppercase)
- **Shadows**: Flowbite elevation (was Material elevation)
- **Focus**: Ring-4 (was ring-2)

## Tech Stack Integration

### Supabase
NextKit includes Supabase authentication and database integration patterns.

### Prisma ORM  
Type-safe database queries with auto-generated client.

### ApexCharts
Interactive charts for dashboards and analytics.

### MongoDB
Alternative database option with Prisma support.

## License

This theme adapts NextKit Admin design principles for MOC Studio.
NextKit Admin is created by WrapPixel (MIT License).
Flowbite is open-source (MIT License).
