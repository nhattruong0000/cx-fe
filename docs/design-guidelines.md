# Design Guidelines

Source: `design/design-system.pen` (34 reusable components)

## Font

- **Primary font**: Be Vietnam Pro (NOT Inter)
- Type scale: Major Third (1.25 ratio)
- Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## Color Tokens (CSS Variables)

### Primary (Blue)
| Token | Value |
|-------|-------|
| `--primary-50` | `#EFF6FF` |
| `--primary-100` | `#DBEAFE` |
| `--primary-200` | `#BFDBFE` |
| `--primary-300` | `#93C5FD` |
| `--primary-400` | `#60A5FA` |
| `--primary-500` | `#3B82F6` |
| `--primary-600` | `#2563EB` |
| `--primary-700` | `#1D4ED8` |
| `--primary-800` | `#1E40AF` |
| `--primary-900` | `#1E3A8A` |
| `--primary-foreground` | `#FFFFFF` |

### Accent (Orange)
| Token | Value |
|-------|-------|
| `--accent-400` | `#FB923C` |
| `--accent-500` | `#F97316` |
| `--accent-600` | `#EA580C` |
| `--accent-foreground` | `#FFFFFF` |

### Neutral (Slate)
| Token | Value |
|-------|-------|
| `--neutral-50` | `#F8FAFC` |
| `--neutral-200` | `#E2E8F0` |
| `--neutral-300` | `#CBD5E1` |
| `--neutral-400` | `#94A3B8` |
| `--neutral-500` | `#64748B` |
| `--neutral-600` | `#475569` |
| `--neutral-700` | `#334155` |
| `--neutral-800` | `#1E293B` |
| `--neutral-900` | `#0F172A` |

### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#FFFFFF` | Page background |
| `--foreground` | `#0F172A` | Primary text |
| `--muted-foreground` | `#64748B` | Secondary text |
| `--card` | `#FFFFFF` | Card background |
| `--border` | `#E2E8F0` | Borders, dividers |
| `--input` | `#E2E8F0` | Input borders |
| `--secondary` | `#F1F5F9` | Secondary backgrounds |
| `--secondary-foreground` | `#0F172A` | Text on secondary bg |
| `--destructive` | `#EF4444` | Error/delete actions |
| `--destructive-foreground` | `#FFFFFF` | Text on destructive |
| `--color-success` | `#22C55E` | Success states |
| `--color-warning` | `#EAB308` | Warning states |
| `--color-info` | `#3B82F6` | Info states |
| `--color-error` | `#EF4444` | Error states |

### Border Radius
| Token | Value |
|-------|-------|
| `--radius-md` | `8px` |
| `--radius-lg` | `12px` |
| `--radius-xl` | `16px` |
| `--radius-pill` | `9999px` |

## Components (34 total)

### Buttons (6 variants)
- Primary, Secondary, Outline, CTA, Ghost, Destructive

### Badges (3 variants)
- Default, Accent, Success

### Inputs (8 variants)
- TextInput, Textarea, Select, Checkbox, CheckboxUnchecked, Radio, RadioUnchecked, ToggleOn, ToggleOff

### Cards (6 variants)
- Product, Blog, Service, Stat, Testimonial, ContactInfo

### Navigation (4 variants)
- Item, ItemActive, Breadcrumb, MobileMenu

### Layout (2)
- Header (h=72px, border-bottom, justify space-between, px=32)
- Footer (bg=neutral-900, py=64/32, px=32)

### Sections (3)
- PageHeader (bg=neutral-50, border-bottom, py=48, px=32)
- PartnerLogos (centered, py=48, px=32)
- CTABanner (gradient primary-700→primary-500, rounded-xl, py=64, px=80)

### FAQ (1)
- FAQ/Item (border-bottom, py=20)

## Implementation Notes

- Light mode only (no dark mode)
- Use shadcn/ui components as base, override with these tokens
- Map design tokens to Tailwind CSS custom properties in globals.css
- Font import: Google Fonts `Be Vietnam Pro` (400, 500, 600, 700)
