# Apply Migrations to Your Own Supabase Project

## 1. Install the Supabase CLI (if not already installed)

```bash
# macOS (Homebrew)
brew install supabase

# Windows (Scoop)
scoop install supabase

# Linux / npm
npm install -g supabase
```

Verify:

```bash
supabase --version
```

## 2. Log in and link your project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

Replace `<your-project-ref>` with the string from your Supabase project URL (`https://<project-ref>.supabase.co`).

## 3. Make the migration files visible to the CLI

The SQL files are in `/migrations` at the project root. The Supabase CLI reads from `supabase/migrations`.

Copy them into the CLI folder:

```bash
mkdir -p supabase/migrations
cp migrations/20260618113751_480a85a2-364f-4595-83b6-ce07ba02dcd9.sql supabase/migrations/
cp migrations/20260618113821_b216fd47-9fb4-45a5-be79-1fcd0cc5e331.sql supabase/migrations/
```

If you do not have a `supabase` folder yet, initialize a local project first (this creates `supabase/config.toml` and `supabase/migrations`):

```bash
supabase init
```

## 4. Create the storage bucket

The migration files add RLS policies on `storage.objects`, but SQL cannot create the bucket itself. Create it with the CLI:

```bash
supabase storage create property-images --public=false
```

Or create it manually in the Supabase dashboard under **Storage → New bucket**.

## 5. Apply the migrations

```bash
supabase db push
```

This applies all `.sql` files in `supabase/migrations` to your linked project.

## 6. Verify

Check the tables in the dashboard under **Table Editor**:

- `public.properties`
- `public.leads`
- `public.user_roles`

Check the storage bucket under **Storage → property-images** and confirm the RLS policies are listed.

## Optional: Apply one file manually via psql

If you prefer not to use the CLI migration runner, connect with the connection string from your dashboard and run the files directly:

```bash
psql "<your-connection-string>" -f migrations/20260618113751_480a85a2-364f-4595-83b6-ce07ba02dcd9.sql
psql "<your-connection-string>" -f migrations/20260618113821_b216fd47-9fb4-45a5-be79-1fcd0cc5e331.sql
```

> Note: When using `psql`, the storage bucket must still be created separately before running the storage policy file.
