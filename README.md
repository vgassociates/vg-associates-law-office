# V G ASSOCIATES — Law Office Website

A Next.js + Supabase starter for V G ASSOCIATES, Ponnur.

## Free deployment architecture

- Frontend: deploy this Next.js project to a service with a free tier such as Vercel.
- Database/auth/storage: Supabase project with its available free tier.
- Domain: start with the free deployment URL; a custom domain can be added later.
- Email: create an office email separately and add it to the site.

Free-tier limits and pricing can change, so check the providers before deployment.

## Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. In Supabase Authentication, create an admin user with email + password.
4. Create a PRIVATE Storage bucket named `case-files`.
5. Copy `.env.example` to `.env.local` and add the Supabase URL and anon key.
6. Run:
   npm install
   npm run dev
7. Open `/admin` to test the login.
8. Deploy to your chosen Next.js host and add the same environment variables.

## Important security note

The included admin UI is a starter. Before storing real client documents, add proper staff roles, least-privilege RLS policies, private storage policies, audit logging, backups, secure password recovery, and a documented data-retention/access policy. Do not store sensitive client files in a public bucket.

## Customization still needed

- Office email
- Advocate photo, if desired
- Exact practice areas
- Bar enrollment/qualification details, if the office wants them displayed
- Consultation/appointment form and notification workflow
- Final legal/professional disclaimer reviewed for the office's requirements
