Build a polished Styly dashboard that matches the landing page screenshots and uses the provided brand palette.

## Goal
Create a dashboard for the Styly fashion discovery app with a clean admin/product-analytics feel: light background, coral-to-orange accents, rounded cards, bold typography, and mobile-app-inspired UI details.

## Pages and navigation
- Replace the current placeholder home page with a dashboard entry experience.
- Add a dedicated `/dashboard` route.
- Use a dashboard shell with:
  - Collapsible left sidebar
  - Top header with search, notifications, and admin profile
  - Main content area with responsive cards and tables
- Sidebar sections:
  - Overview
  - Users
  - Outfit Recommendations
  - Community Posts
  - Analytics
  - App Settings

## Dashboard content
### Overview page
- Welcome header: “Welcome back, Styly team”
- KPI cards using the landing page metrics/style:
  - Daily Users
  - Outfits Shared
  - Active Stylers
  - Recommendation Accuracy
- Small trend indicators with coral/orange highlights.
- Main analytics area with simple visual charts/cards for:
  - User growth
  - Outfit engagement
  - Downloads by platform
- Recent activity feed for new users, saved outfits, shared looks, and app downloads.

### Users section
- User table with realistic sample data:
  - Name
  - Location in Tunisia
  - Style preference
  - Status
  - Last active
- Search/filter UI for users.
- Status badges using brand colors.

### Outfit recommendations section
- Cards showing recommendation categories:
  - Personalized outfits
  - Occasion-based looks
  - AI-powered styling
  - Saved favorites
- Queue/list of recent outfit suggestions with engagement numbers.

### Community posts section
- Grid/list of fashion posts inspired by the app screenshots.
- Include moderation-style actions visually: review, feature, hide.
- Use placeholder fashion imagery only if suitable existing assets are available; otherwise use styled gradient/image placeholders rather than embedding the uploaded screenshots.

### Analytics section
- Conversion-style dashboard for the landing page/app:
  - Visits
  - App downloads
  - iOS vs Android split
  - CTA clicks
  - Testimonial engagement
- Keep it demo/static unless backend is requested later.

### App settings section
- Brand/profile settings mock UI:
  - App name: Styly
  - Contact email/phone
  - Social links
  - Download app links
- Styled form controls without real saving for this first version.

## Visual design direction
- Palette:
  - Primary: `#FF4F76`
  - Secondary: `#FF8438`
  - Dark: `#1A1A1A`
  - Light: `#FFFFFF`
  - Gray: `#F5F5F5`
  - Text dark: `#333333`
  - Text light: `#777777`
- Use soft blush backgrounds inspired by the landing page.
- Use coral/orange gradients for buttons, icons, active nav, and KPI accents.
- Use white cards with rounded corners, thin borders, subtle shadows, and generous spacing.
- Use a dark footer/accent style only where it makes sense, inspired by the landing page footer.
- Create a small “styly” brand mark/text in the dashboard header/sidebar if no separate logo file is provided.

## Responsive behavior
- Desktop: full sidebar + multi-column dashboard cards.
- Tablet: compact cards and collapsible sidebar.
- Mobile: sidebar becomes a drawer/mini navigation, cards stack vertically, tables become scrollable cards.

## Technical details
- Keep TanStack Start routing structure intact.
- Create route files under `src/routes/`, including `/dashboard`.
- Do not edit the generated route tree manually.
- Use existing shadcn UI components where helpful: cards, badges, buttons, inputs, tables, sidebar/dialog components.
- Update theme tokens in `src/styles.css` to match the Styly palette using OKLCH-compatible values where needed.
- Ensure sidebar width classes use explicit `var(--sidebar-width)` syntax to avoid Tailwind 4 sidebar overlap issues.
- Add page metadata for the dashboard route.
- Use static demo data first; no authentication, database, or real backend in this version.

## Acceptance criteria
- The app no longer shows the blank placeholder.
- `/dashboard` opens a complete Styly-branded dashboard.
- The dashboard visually matches the uploaded landing page style: white/blush surfaces, coral-orange accents, rounded cards, and clean spacing.
- Navigation is responsive and usable on desktop and mobile.
- The dashboard is coherent as an admin/product dashboard for the Styly app, even with sample data.