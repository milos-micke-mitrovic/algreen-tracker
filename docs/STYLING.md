# Styling Guide

This project uses Tailwind CSS for styling. Follow these rules for consistent design.

## Basic Rules

1. **Use Tailwind classes** - Don't write custom CSS
2. **Use design tokens** - Don't hardcode colors or values
3. **Use semantic colors** - Not raw colors like `red-500`

---

## Colors

### Always use semantic colors

```tsx
// ✅ CORRECT
<div className="bg-background text-foreground" />
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive text-destructive-foreground" />
<div className="bg-success text-success-foreground" />
<div className="text-muted-foreground" />

// ❌ WRONG
<div className="bg-white text-black" />
<div className="bg-blue-500 text-white" />
<div className="bg-red-500" />
<div className="text-gray-500" />
```

### Color reference

| Color | Background | Text | Use for |
|-------|------------|------|---------|
| Background | `bg-background` | `text-foreground` | Page background |
| Card | `bg-card` | `text-card-foreground` | Card components |
| Primary | `bg-primary` | `text-primary-foreground` | Main actions |
| Secondary | `bg-secondary` | `text-secondary-foreground` | Secondary actions |
| Muted | `bg-muted` | `text-muted-foreground` | Subtle elements |
| Destructive | `bg-destructive` | `text-destructive-foreground` | Delete, errors |
| Success | `bg-success` | `text-success-foreground` | Success states |
| Warning | `bg-warning` | `text-warning-foreground` | Warning states |
| Info | `bg-info` | `text-info-foreground` | Info states |

---

## Z-Index

Never use arbitrary z-index values. Use these classes:

```tsx
// ✅ CORRECT
<div className="z-dropdown" />    {/* 100 - Dropdowns */}
<div className="z-sticky" />      {/* 200 - Sticky headers */}
<div className="z-fixed" />       {/* 300 - Fixed elements */}
<div className="z-modal-backdrop" /> {/* 400 - Modal overlay */}
<div className="z-modal" />       {/* 500 - Modal content */}
<div className="z-popover" />     {/* 600 - Popovers */}
<div className="z-tooltip" />     {/* 700 - Tooltips */}
<div className="z-toast" />       {/* 800 - Toasts */}

// ❌ WRONG
<div className="z-50" />
<div className="z-[9999]" />
```

---

## Spacing

Use Tailwind's spacing scale:

```tsx
// Padding
<div className="p-4" />      {/* 1rem */}
<div className="px-6 py-4" /> {/* Horizontal 1.5rem, Vertical 1rem */}

// Margin
<div className="m-4" />
<div className="mt-6 mb-4" />

// Gap (for flex/grid)
<div className="flex gap-4" />
<div className="grid gap-6" />

// Space between children
<div className="space-y-4" />  {/* Vertical space */}
<div className="space-x-4" />  {/* Horizontal space */}
```

### Spacing scale

| Class | Value |
|-------|-------|
| `1` | 0.25rem (4px) |
| `2` | 0.5rem (8px) |
| `4` | 1rem (16px) |
| `6` | 1.5rem (24px) |
| `8` | 2rem (32px) |
| `12` | 3rem (48px) |

---

## Layout

### Flexbox

```tsx
// Center everything
<div className="flex items-center justify-center" />

// Space between
<div className="flex items-center justify-between" />

// Column layout
<div className="flex flex-col gap-4" />

// Wrap items
<div className="flex flex-wrap gap-4" />
```

### Grid

```tsx
// 3 columns
<div className="grid grid-cols-3 gap-4" />

// Responsive columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
```

### Container

```tsx
// Centered container with max-width
<div className="container mx-auto px-4" />
```

---

## Responsive Design

Use these breakpoints:

| Prefix | Min-width | Devices |
|--------|-----------|---------|
| (none) | 0px | Mobile |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |

```tsx
// Mobile-first approach
<div className="
  p-4          // Mobile: padding 1rem
  md:p-6       // Tablet+: padding 1.5rem
  lg:p-8       // Desktop+: padding 2rem
" />

// Hide/show at breakpoints
<div className="hidden md:block" />  // Hidden on mobile, visible on tablet+
<div className="block md:hidden" />  // Visible on mobile, hidden on tablet+
```

---

## Common Patterns

### Card

```tsx
<div className="rounded-lg border bg-card p-6 shadow-sm">
  <h3 className="font-semibold">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Button (use shadcn/ui instead)

```tsx
import { Button } from '@/components/ui/button';

<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Input (use shadcn/ui instead)

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email" />
</div>
```

### Page layout

```tsx
export function MyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Page Title</h1>
      <p className="text-muted-foreground">Page description</p>

      {/* Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Cards, components, etc. */}
      </div>
    </div>
  );
}
```

---

## Conditional Classes

Use the `cn()` utility for conditional classes:

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  "base-class p-4 rounded",
  isActive && "bg-primary text-primary-foreground",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />
```

---

## Don'ts

❌ Don't use inline styles: `style={{ color: 'red' }}`
❌ Don't use raw colors: `bg-red-500`, `text-gray-600`
❌ Don't use arbitrary values: `w-[347px]`, `z-[9999]`
❌ Don't write custom CSS files
❌ Don't use `!important`
