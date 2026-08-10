CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS height_cm NUMERIC(5,2);

CREATE TABLE IF NOT EXISTS fasting_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  target_hours INTEGER NOT NULL DEFAULT 72,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('setup','active','stopped','completed')),
  stop_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_session_per_user
  ON fasting_sessions(user_id) WHERE status = 'active';

CREATE TABLE IF NOT EXISTS checkins (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES fasting_sessions(id) ON DELETE CASCADE,
  condition VARCHAR(40) NOT NULL,
  emoji VARCHAR(10),
  water_glasses SMALLINT NOT NULL DEFAULT 0 CHECK (water_glasses BETWEEN 0 AND 20),
  jaroliva_taken BOOLEAN NOT NULL,
  followed_protocol BOOLEAN NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS glucose_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES fasting_sessions(id) ON DELETE CASCADE,
  phase VARCHAR(40) NOT NULL,
  value SMALLINT NOT NULL CHECK (value BETWEEN 20 AND 600),
  unit VARCHAR(10) NOT NULL DEFAULT 'mg/dL',
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS checkins_user_created_idx ON checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS glucose_user_logged_idx ON glucose_logs(user_id, logged_at DESC);
