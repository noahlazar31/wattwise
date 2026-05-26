# Schema Decisions

## Why UUIDs everywhere?
Predictable integer IDs are easily enumerable. UUIDs prevent scraping of household
data by sequential ID guessing, which matters given that bills contain financial data.

## Why separate `buildings` and `households`?
Designed for multi-tenant/multi-unit buildings. A property manager can own a building
(`property_manager_id`) while individual households track their own utility data.
Single-family home users simply omit `building_id`.

## Why `insights` is a materialized table (not computed on-the-fly)?
Insight computation touches all historical bills. Storing results in `insights` lets
the frontend load instantly without re-running calculations. The insights engine
deletes and re-inserts on each GET /insights call to keep data fresh.

## `account_last_four` — why only last 4 digits?
Minimising PII. We never need the full account number; the last 4 is enough to verify
a bill matches an account without storing sensitive data.

## Storage bucket (`bills`)
Raw images are stored in a private Supabase Storage bucket. Only the service role
key (backend) can read/write. Public URLs are generated per-file and stored in
`raw_image_url`. Consider adding a signed-URL approach for production if stricter
access control is needed.

## RLS policies
All tables have RLS enabled. Current policies allow full access (used by the backend
with the anon/service key). For production, tighten these to `auth.uid() = user_id`
patterns once Supabase Auth is wired up.
