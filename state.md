# MGR Couture — Engineering & Audit State Tracker

Last Updated: 2026-10-14
Current Phase: Verification & Quality Assurance

---

## 1. Project Overview & Architecture
- **Framework:** Next.js 16.2.11 (Turbopack, App Router)
- **Language / Runtime:** TypeScript 5, React 19.2.4, Node.js
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Backend / DB / Auth:** Supabase (`@supabase/ssr` v0.12.4, `@supabase/supabase-js` v2.110.8)
- **Media Asset Storage:** Cloudinary (`next-cloudinary` v6.17.5 + REST API)
- **Routing & Gatekeeping:** Next.js 16 Proxy convention (`proxy.ts` superseding deprecated `middleware.ts`)

---

## 2. Issues & Enhancements Backlog

| ID | Category | Item Description | Priority | Status |
|:---|:---|:---|:---:|:---:|
| **ISSUE-01** | Bug / Performance | **Cloudinary Double Upload in Admin Catalog**: Files in `imageFiles` upload twice during `handleSaveItem`. | High | Completed |
| **ISSUE-02** | Bug / State | **Image Deletion Array Desynchronization**: Editing pieces with mixed existing URLs and new files deletes wrong indices when removing previews. | High | Completed |
| **ISSUE-03** | Auth / Reliability | **Admin Sign-Out Cookie Inconsistency**: `AdminPortalLayout` uses `@supabase/supabase-js` (localStorage) instead of `@supabase/ssr` (cookies), breaking clean logout. | High | Completed |
| **ISSUE-04** | Robustness / Crash | **Null-Safety on Inquiries Page**: `inquiry.phone.replace` throws unhandled TypeError if phone is null/undefined, crashing Server Component. | Medium | Completed |
| **ISSUE-05** | Accuracy / UX | **Dynamic Catalog Count in Admin Dashboard**: "Archive Pieces" stat card hardcoded to `5` instead of real `catalog_items` count. | Medium | Completed |
| **ISSUE-06** | Database / Safety | **Event Date Empty String Handling in ContactForm**: Passing empty `""` to PostgreSQL date column can trigger format error; sanitized to `null`. | Low | Completed |
| **ISSUE-07** | UX / Feature | **Showcase Deep-Linking Auto-Drawer**: When landing on `/collections?sku=...`, automatically find and open the corresponding piece in the details drawer. | Medium | Completed |
| **ISSUE-08** | Security Hygiene | **Sensitive Auth Session Console Logging**: Cleaned up `console.log(data)` in `app/admin/login/page.tsx` that outputs JWT tokens and unused router. | Low | Completed |
| **ISSUE-09** | UX / Navigation | **Placeholder Pages for Orders & Settings**: Prevented 404s for sidebar navigation items `/admin/orders` and `/admin/settings`. | Low | Completed |
| **ISSUE-10** | Security / Defense | **HTTP Security Headers**: Added Clickjacking (DENY), MIME-sniffing (nosniff), Referrer-Policy, and Permissions-Policy in `next.config.ts`. | Medium | Completed |
| **ISSUE-11** | UI / Aesthetics | **Catalogue Cards Rounded Borders & Darkened SKU Tag**: Added rounded borders (`rounded-2xl`) to catalogue cards and darkened high-contrast glass badge (`bg-black/80`) with gold accent to make SKU tags legible on any photo background. | Low | Completed |

---

## 3. Changelog Details

1. **`app/admin/(portal)/catalog/page.tsx`**:
   - Replaced disjointed `imagePreviews` and `imageFiles` arrays with a unified `ImageItem` structure (`id`, `url`, optional `file`).
   - Fixed `handleSaveItem` to upload each new file to Cloudinary exactly once, saving bandwidth and upload time.
   - Fixed preview deletions so deleting image previews directly matches the target image item without index desynchronization.
   - Cleaned up ESLint hook dependency warning.

2. **`app/admin/(portal)/layout.tsx`**:
   - Switched from `@supabase/supabase-js` to `@supabase/ssr` (`createBrowserClient`).
   - Cleaned up sign-out handler to clear SSR cookies and execute a hard redirect to `/admin/login`, ensuring clean logout.

3. **`app/admin/login/page.tsx`**:
   - Removed sensitive auth session object logging from the console.
   - Removed unused `router` variable to resolve ESLint warning.

4. **`app/admin/(portal)/inquiries/page.tsx`**:
   - Added null-guards for `inquiry.phone` and `inquiry.email` so missing contact info renders safely instead of throwing a server-side exception.

5. **`app/admin/(portal)/dashboard/page.tsx`**:
   - Replaced static `5` in Archive Pieces counter card with dynamic count from `catalog_items` table.

6. **`components/ContactForm.tsx`**:
   - Added sanitization to pass `null` instead of empty string `""` for optional `event_date` to prevent PostgreSQL date format errors.

7. **`app/collections/page.tsx`**:
   - Wrapped page in `<Suspense>` boundary and used `useSearchParams()`.
   - Added auto-open behavior: if a visitor clicks a showcase link (`/collections?sku=...`), the corresponding garment is automatically selected and the details drawer opens.
   - Moved `supabase` client creation outside component render cycle.
   - Added `event_date` to the inquiry database insert.

8. **`app/admin/(portal)/orders/page.tsx` & `settings/page.tsx`**:
   - Created branded pages to eliminate 404 errors when navigating via sidebar.

9. **`next.config.ts`**:
   - Added standard security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

10. **`components/Showcase.tsx` & `app/collections/page.tsx` & `app/admin/(portal)/catalog/page.tsx`**:
   - Added `rounded-2xl` borders, subtle luxury gold borders (`border-mgr-primary/15`), and soft drop shadows to catalogue and showcase cards.
   - Darkened SKU tags to a high-contrast dark frosted glass (`bg-black/80 backdrop-blur-md text-mgr-primary border border-mgr-primary/40 rounded-full shadow-lg`), ensuring crystal-clear visibility over white dresses, bright lighting, or any background.

---

## 4. Verification Check
- [x] Code edits applied
- [x] Lint check (`npm run lint` — 0 errors, 0 warnings)
- [x] Production build check (`npm run build` — 10/10 routes compiled successfully)
