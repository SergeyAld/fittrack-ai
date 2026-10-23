/*
# Create FitTrack AI core tables

## Overview
Creates the database schema for the FitTrack AI fitness and nutrition tracking app.
This is a single-tenant prototype (no user accounts / sign-in), so all tables are
shared and accessible to both the `anon` and `authenticated` roles.

## New Tables

### 1. food_diary
Stores individual food log entries for each meal.
- `id` — UUID primary key.
- `date` — the day this entry belongs to (DATE, e.g. '2026-10-23').
- `meal_type` — which meal slot: 'breakfast', 'lunch', 'dinner', or 'snacks'.
- `food_id` — reference key into the in-app food database (text), or 'manual' for custom entries.
- `food_name` — display name of the food.
- `emoji` — emoji icon for display.
- `grams` — portion size in grams.
- `calories` — calculated total calories.
- `protein` — calculated protein in grams.
- `carbs` — calculated carbs in grams.
- `fat` — calculated fat in grams.
- `created_at` — timestamp.

### 2. water_logs
Daily water intake, one row per day.
- `id` — UUID primary key.
- `date` — unique per day.
- `glasses` — number of glasses consumed.

### 3. weight_entries
Weight tracking history for progress charts.
- `id` — UUID primary key.
- `date` — unique per day.
- `weight_kg` — body weight in kilograms.

### 4. user_settings
Stores app settings for this prototype (single row enforced by a check).
- `id` — fixed integer key (always 1 for single-tenant).
- `name` — display name.
- `age`, `height_cm`, `weight_kg` — body metrics.
- `activity_level` — sedentary/light/moderate/active/athlete.
- `fitness_goal` — lose_fat/maintain/build_muscle.
- `diet_preference` — balanced/high_protein/vegetarian/vegan/low_carb/mediterranean.
- `allergies` — array of allergen names.
- `weekly_budget_eur` — food budget in euros.
- `unit` — 'metric' or 'imperial'.
- `notif_reminders` / `notif_weekly_report` / `notif_goal_updates` — boolean notification toggles.
- `is_pro` — whether the user has Pro membership.
- `updated_at` — last modification timestamp.

## Security
- RLS enabled on all tables.
- Grants: SELECT, INSERT, UPDATE, DELETE to `anon, authenticated` (single-tenant, no sign-in).
- Policies: all rows are shared/public (`USING (true)` / `WITH CHECK (true)`) — appropriate for a no-auth prototype.
- Indexes on `food_diary(date)`, `water_logs(date)`, `weight_entries(date)` for fast daily queries.

## Notes
1. The app does not use sign-in, so policies target `anon, authenticated`.
2. `user_settings` is constrained to a single row via CHECK constraint.
3. A seed row for `user_settings` is inserted so the app always has defaults.
4. A seed row for `water_logs` is inserted for today so the dashboard shows data.
*/

-- =========================================================
-- food_diary
-- =========================================================
CREATE TABLE IF NOT EXISTS food_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
  food_id text NOT NULL DEFAULT 'manual',
  food_name text NOT NULL,
  emoji text NOT NULL DEFAULT '🍽️',
  grams integer NOT NULL DEFAULT 0 CHECK (grams >= 0),
  calories integer NOT NULL DEFAULT 0 CHECK (calories >= 0),
  protein integer NOT NULL DEFAULT 0 CHECK (protein >= 0),
  carbs integer NOT NULL DEFAULT 0 CHECK (carbs >= 0),
  fat integer NOT NULL DEFAULT 0 CHECK (fat >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE food_diary ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON food_diary TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_food_diary_date ON food_diary(date);

DROP POLICY IF EXISTS "anon_select_food_diary" ON food_diary;
CREATE POLICY "anon_select_food_diary" ON food_diary FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_food_diary" ON food_diary;
CREATE POLICY "anon_insert_food_diary" ON food_diary FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_food_diary" ON food_diary;
CREATE POLICY "anon_update_food_diary" ON food_diary FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_food_diary" ON food_diary;
CREATE POLICY "anon_delete_food_diary" ON food_diary FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- water_logs
-- =========================================================
CREATE TABLE IF NOT EXISTS water_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  glasses integer NOT NULL DEFAULT 0 CHECK (glasses >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON water_logs TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(date);

DROP POLICY IF EXISTS "anon_select_water_logs" ON water_logs;
CREATE POLICY "anon_select_water_logs" ON water_logs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_water_logs" ON water_logs;
CREATE POLICY "anon_insert_water_logs" ON water_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_water_logs" ON water_logs;
CREATE POLICY "anon_update_water_logs" ON water_logs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_water_logs" ON water_logs;
CREATE POLICY "anon_delete_water_logs" ON water_logs FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- weight_entries
-- =========================================================
CREATE TABLE IF NOT EXISTS weight_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  weight_kg numeric(5,1) NOT NULL CHECK (weight_kg > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON weight_entries TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_weight_entries_date ON weight_entries(date);

DROP POLICY IF EXISTS "anon_select_weight_entries" ON weight_entries;
CREATE POLICY "anon_select_weight_entries" ON weight_entries FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_weight_entries" ON weight_entries;
CREATE POLICY "anon_insert_weight_entries" ON weight_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_weight_entries" ON weight_entries;
CREATE POLICY "anon_update_weight_entries" ON weight_entries FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_weight_entries" ON weight_entries;
CREATE POLICY "anon_delete_weight_entries" ON weight_entries FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- user_settings (single row for prototype)
-- =========================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name text NOT NULL DEFAULT 'Alex',
  age integer NOT NULL DEFAULT 28 CHECK (age > 0 AND age < 150),
  height_cm integer NOT NULL DEFAULT 178 CHECK (height_cm > 0),
  weight_kg numeric(5,1) NOT NULL DEFAULT 79.6 CHECK (weight_kg > 0),
  activity_level text NOT NULL DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'athlete')),
  fitness_goal text NOT NULL DEFAULT 'lose_fat' CHECK (fitness_goal IN ('lose_fat', 'maintain', 'build_muscle')),
  diet_preference text NOT NULL DEFAULT 'balanced' CHECK (diet_preference IN ('balanced', 'high_protein', 'vegetarian', 'vegan', 'low_carb', 'mediterranean')),
  allergies text[] NOT NULL DEFAULT '{}',
  weekly_budget_eur integer NOT NULL DEFAULT 60,
  unit text NOT NULL DEFAULT 'metric' CHECK (unit IN ('metric', 'imperial')),
  notif_reminders boolean NOT NULL DEFAULT true,
  notif_weekly_report boolean NOT NULL DEFAULT true,
  notif_goal_updates boolean NOT NULL DEFAULT false,
  is_pro boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON user_settings TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_user_settings" ON user_settings;
CREATE POLICY "anon_select_user_settings" ON user_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_settings" ON user_settings;
CREATE POLICY "anon_insert_user_settings" ON user_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_user_settings" ON user_settings;
CREATE POLICY "anon_update_user_settings" ON user_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_settings" ON user_settings;
CREATE POLICY "anon_delete_user_settings" ON user_settings FOR DELETE
  TO anon, authenticated USING (true);

-- =========================================================
-- Seed data
-- =========================================================

-- Seed default settings row
INSERT INTO user_settings (id, name, age, height_cm, weight_kg, activity_level, fitness_goal, diet_preference, allergies, weekly_budget_eur, unit, notif_reminders, notif_weekly_report, notif_goal_updates, is_pro)
VALUES (1, 'Alex', 28, 178, 79.6, 'moderate', 'lose_fat', 'balanced', '{}', 60, 'metric', true, true, false, false)
ON CONFLICT (id) DO NOTHING;

-- Seed today's water log
INSERT INTO water_logs (date, glasses)
VALUES (CURRENT_DATE, 3)
ON CONFLICT (date) DO NOTHING;

-- Seed weight history (last 7 weeks)
INSERT INTO weight_entries (date, weight_kg)
SELECT * FROM (VALUES
  ('2026-09-11'::date, 82.4),
  ('2026-09-18'::date, 82.0),
  ('2026-09-25'::date, 81.3),
  ('2026-10-02'::date, 80.8),
  ('2026-10-09'::date, 80.5),
  ('2026-10-16'::date, 80.1),
  ('2026-10-23'::date, 79.6)
) AS v(d, w)
ON CONFLICT (date) DO NOTHING;

-- Seed sample diary entries for today
INSERT INTO food_diary (date, meal_type, food_id, food_name, emoji, grams, calories, protein, carbs, fat)
SELECT * FROM (VALUES
  (CURRENT_DATE, 'breakfast', 'oats', 'Oats with Banana', '🥣', 80, 303, 11, 54, 5),
  (CURRENT_DATE, 'breakfast', 'greek-yogurt', 'Greek Yogurt', '🥛', 150, 90, 15, 5, 3),
  (CURRENT_DATE, 'lunch', 'chicken-breast', 'Chicken Breast', '🍗', 160, 264, 50, 0, 6),
  (CURRENT_DATE, 'lunch', 'brown-rice', 'Brown Rice', '🍚', 140, 172, 4, 36, 1),
  (CURRENT_DATE, 'snacks', 'almonds', 'Almonds', '🌰', 20, 116, 4, 4, 10)
) AS v(d, mt, fi, fn, em, g, cal, p, c, f)
WHERE NOT EXISTS (
  SELECT 1 FROM food_diary WHERE date = CURRENT_DATE AND food_id = v.fi AND meal_type = v.mt AND food_name = v.fn
);
