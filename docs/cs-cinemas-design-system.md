# CS Cinemas Design System

## 1. Design tokens

### Color system
- Background: #09090B
- Surface: #151518
- Elevated surface: #202024
- Warm gold accent: #D6A84F
- Soft champagne highlight: #F3D28A
- Primary text: #F7F5EF
- Secondary text: #B5B1AA
- Success: #3FA77A
- Warning: #D99A3D
- Error: #C95C5C

### Type scale
- Display: 64-80px, editorial serif or high-contrast display face
- Page heading: 40-52px
- Section heading: 28-36px
- Card heading: 24-28px
- Body: 16-18px, 1.6-1.8 line height
- Caption: 12-14px, uppercase tracking
- Price: 28-36px, semibold
- Button label: 14-16px, bold uppercase optional

### Elevation and borders
- Surface cards use low-contrast borders and soft shadow.
- Gold is reserved for CTA emphasis and selected states.
- Dark surfaces remain readable with warm-muted type and strong separation.

### Radius and spacing
- Cards: 20-28px radius
- Buttons: 12-16px radius
- Spacious vertical rhythm using 8px spacing multiples

## 2. Desktop homepage

Purpose: Help first-time visitors immediately understand the product, the celebration types, and the booking path.

Primary action: Search for a theater or click Book now.
Secondary actions: Explore cities, browse events, read how it works.

Component hierarchy:
- Header with brand, city selector, nav, login CTA
- Hero with cinematic image, clear headline, search module
- Event discovery cards
- Featured theater cards
- Experience section
- How-it-works steps
- Trust and FAQ teaser
- Final CTA and footer

Data required from backend:
- Cities list
- Hero banner content
- Event categories
- Featured theaters
- Testimonials or reviews
- FAQ preview

Empty state: No hero banner or city data, fallback gradient and default navigation.
Error state: Show a simple inline error and retry path for banner or city lookup.
Loading state: Skeleton hero and card blocks.
Responsive behavior: Hero collapses to stacked layout below large screens.
Accessibility behavior: Semantic headings, visible focus, keyboard form controls.

## 3. Mobile homepage

Purpose: Make the value proposition and date search obvious on small screens.

Primary user action: Check availability quickly.
Secondary actions: View events, browse cities, sign in.

Behavior: Sticky search summary, stacked cards, mobile nav drawer, single-column flow.

## 4. Theater listing desktop

Purpose: Make searching, filtering, and comparing venues straightforward.

Primary user action: Filter by city, location, occasion, and date, then view details.
Secondary actions: Clear filters, sort, inspect venue details.

Component hierarchy:
- Search/filter bar
- Result summary
- Featured result card followed by standard cards
- Pagination or load more

Data required from backend:
- Theater list
- City list
- Location list
- Event types
- Availability status and price per hour

Empty state: “No venues found” with clear filter reset action.
Error state: Inline error panel with retry.
Loading state: Card skeleton grid.
Responsive behavior: Left rail on desktop, drawer and sticky controls on mobile.
Accessibility behavior: Form labeling, ARIA for filter drawer and sorting controls.

## 5. Theater listing mobile

Purpose: Keep the filter experience compact and readable.

Primary user action: Filter down to a suitable venue.
Secondary actions: Sort, reset filters, view details.

Behavior: Sticky filter bar, bottom drawer for filters, no horizontal overflow.

## 6. Theater details desktop

Purpose: Reduce uncertainty around venue quality, pricing, and availability.

Primary user action: Choose a date and slot, then book.
Secondary actions: View amenities, read description, inspect similar theaters.

Above the fold: gallery, name, location, capacity, price, rating, CTA.
Below the fold: amenities, description, supported occasions, slot selector, reviews, address.

Sticky booking summary: desktop fixed summary card with selected date and slot.
Data required: gallery images, description, amenities, price, support types, availability slots, reviews.

## 7. Theater details mobile

Purpose: Keep booking actions accessible while preserving browse context.

Behavior: Bottom CTA bar, full-width slot buttons, simplified gallery, mobile sticky summary.

## 8. Booking flow desktop

Purpose: Progress through a calm, one-task-per-step checkout.

Primary user action: Confirm date, event, add-ons, details, and payment.
Secondary actions: Go back, edit selections, contact support.

Visible progress indicator: Date and time → event → add-ons → details → review → payment.
Data required: theater, event type, selected slot, add-ons, customer details, tax and fee calculation, booking status.

States to support: loading, slot unavailable, booking pending, payment processing, failed, cancelled, verified, confirmed, expired, network error.

## 9. Booking flow mobile

Purpose: Preserve clarity under limited screen space.

Behavior: Stacked step content, sticky summary, bottom action row, condensed pricing breakdown.

## 10. Login/register

Purpose: Allow customers to continue into the booking flow without friction.

Primary user action: Sign in or create an account.
Secondary action: Restore password or use OTP flow.

Data required: email, password, OTP code, name, phone.

## 11. Account/bookings

Purpose: Help guests manage bookings, invoices, and post-booking details.

Primary user action: View booking status or invoice.
Secondary actions: Cancel, reschedule, submit review.

Data required: booking list, status, date, theater, total, invoice/receipt metadata.

## 12. Empty/loading/error states

Examples:
- No theaters found
- No bookings yet
- Loading skeletons for profile and listing pages
- Retry banners for failed API requests
- Offline/timeout states

Each should provide a clear next action and avoid dead ends.

## 13. Component states

Each reusable component should support the following states:
- Default
- Hover
- Focus
- Disabled
- Loading
- Error
- Mobile adaptation

Core components:
- Header
- Footer
- Mobile nav
- Page shell
- Breadcrumbs
- Section header
- Container
- Theater card
- Event card
- City card
- Add-on card
- Testimonial card
- Review card
- FAQ accordion
- Gallery
- Lightbox
- Input, select, date picker, time-slot picker, checkbox, quantity control
- Price breakdown
- Toast, modal, drawer, confirmation dialog
- Skeleton, empty state, error state, retry, offline banner, session-expired dialog

## 14. Image direction

Visual direction should emphasize:
- dark theater interiors
- warm practical lighting
- close-ups of screens, seating, and details
- celebratory moments without overly staged stock photography
- editorial composition with high contrast and cinematic depth

Use real venue photography where possible, optimized for mobile and desktop.

## 15. Typography pairing

Primary pairing:
- Display serif: Cormorant Garamond or another editorial serif with soft contrast
- Sans: Inter or system sans with high legibility for practical booking info

Use serif for large hero language and more emotional moments; sans for navigation, forms, pricing, and body copy.

## 16. Accessibility notes

- Semantic headings and landmarks
- Visible focus indicator on all interactive controls
- Labels on all form fields
- Keyboard-accessible dialogs and drawers
- Reduced motion support
- Sufficient contrast against dark surfaces
- Screen-reader status updates for payment and booking steps
- Clear, direct error messaging

## 17. Responsive behavior notes

- Desktop uses large editorial layouts and two-column leads.
- Tablet uses more compact grids and tighter spacing.
- Mobile focuses on one primary booking task per screen.
- Sticky CTA and sticky filters preserve flow without visual clutter.
- No horizontal overflow in cards or forms.

## 18. Developer handoff notes

Implementation guidelines:
- Align with the existing route structure in the application.
- Keep reusable UI in shared components rather than page-specific modules.
- Use route-level data fetches and query keys for analytics and caching.
- Preserve server-calculated prices and do not claim final availability until confirmation.
- Prefer accessible, semantic HTML and small, purposeful motion.

## 19. Summary

The CS Cinemas experience should feel premium and reassuring rather than generic. The system uses dark cinematic surfaces, warm gold accents, clear booking hierarchy, and calm interaction states to create trust while keeping the reservation flow intuitive and fast.
