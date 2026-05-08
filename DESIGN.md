# Design Brief: ScanText Pro

## Direction
ScanText Pro — Premium OCR scanner PWA with dark-first UX, built for professionals and students.

## Tone
Refined, efficient, trustworthy. Confident primary colors with minimal decoration. Tech-forward without being cold.

## Differentiation
Vibrant teal accent on deep indigo primary creates high-energy premium app perception while maintaining professional trust.

## Color Palette

| Token      | OKLCH          | Role                      |
|------------|----------------|---------------------------|
| background | 0.12 0.01 250  | Dark neutral background   |
| foreground | 0.93 0.01 250  | High-contrast text        |
| card       | 0.16 0.012 250 | Elevated surface layer    |
| primary    | 0.72 0.18 200  | Deep indigo actions       |
| accent     | 0.62 0.18 170  | Vibrant teal highlights   |
| muted      | 0.22 0.012 250 | Subtle dividers           |
| success    | 0.6 0.16 150   | Green validation states   |
| destructive| 0.55 0.2 25    | Red warnings/errors       |

## Typography

- Display: Space Grotesk — headings, hero text, action labels. Bold weight, tight tracking.
- Body: DM Sans — paragraphs, UI labels, form text. Clean, professional legibility.
- Mono: Geist Mono — code snippets, extracted text preview, technical detail.
- Scale: Hero text `text-5xl md:text-6xl font-bold tracking-tight`, H2 `text-3xl font-bold`, Labels `text-sm font-semibold`, Body `text-base`

## Elevation & Depth

Card elevation via `shadow-card` (8px blur, 4px offset) and `shadow-elevated` (24px blur, 8px offset) for layered surfaces. Bottom navigation fixed above content. No full-page depth — content layers only.

## Structural Zones

| Zone          | Background      | Border           | Notes                         |
|---------------|-----------------|------------------|-------------------------------|
| Header        | card (0.16)     | border/muted     | Logo + settings button, sticky|
| Navigation    | card (0.16)     | border top       | Fixed bottom, 5 items         |
| Main content  | background      | —                | Spacious padding 16-20px      |
| Cards/Modals  | card            | subtle/muted     | 12px radius, shadow-card      |
| Footer/Legal  | muted (0.22)    | border top       | Legal links, minimal text     |

## Spacing & Rhythm

Rhythmic 8px grid: 16px horizontal padding, 20px vertical section gaps, 8px micro-spacing. Generous whitespace around interactive elements. Cards staggered with 12px gaps for visual rhythm.

## Component Patterns

- Buttons: Rounded (`rounded-md` 8px), primary `bg-primary text-primary-foreground`, accent `bg-accent`, secondary `bg-muted`. Hover: +10% lightness on primary, +20% on accent.
- Cards: `rounded-md`, `shadow-card`, `bg-card` with `border border-muted/30`. Hover: `shadow-elevated`.
- Badges: Pill-shaped (`rounded-full`), teal accent foreground on muted background. Icon + text pairs.
- Empty states: Center-aligned illustration, secondary text, primary action button.
- Loading: `animate-pulse-subtle` on skeletons. Gradient shimmer optional for hero images.

## Motion

- Entrance: Fade-in 200ms `ease-out` on page load, staggered card entrance 50ms between items.
- Hover: 150ms transition on button/card background and shadow. No bounce animations.
- Decorative: Pulse-subtle on loading indicators. Icon rotation on scanning states (90deg, 180ms).

## Constraints

- Mobile-first: max-width 430px for phone, 1200px for desktop breakpoints (no large screens needed).
- Accessibility: AA contrast minimum. All buttons keyboard-accessible, focus rings on `:focus-visible`.
- No gradient abuse. Solid color tokens only except subtle muted/30 backgrounds.
- Dark mode default. Light mode available as toggle in settings.

## Signature Detail

Teal accent used as action highlight—only on primary CTA, success states, and active nav items. Creates a "premium tool" signal through color restraint and intentional placement.
