CREATE TABLE "users" (
  "id" BIGSERIAL NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password_hash" TEXT NOT NULL,
  "points" INTEGER NOT NULL DEFAULT 0,
  "phone" VARCHAR(30),
  "birth_date" DATE,
  "gender" VARCHAR(20),
  "city" VARCHAR(100),
  "weight_kg" DECIMAL(5,2),
  "height_cm" DECIMAL(5,2),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "users_points_check" CHECK ("points" >= 0)
);

CREATE TABLE "fasting_sessions" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "start_time" TIMESTAMPTZ NOT NULL,
  "end_time" TIMESTAMPTZ,
  "target_hours" INTEGER NOT NULL DEFAULT 72,
  "status" VARCHAR(20) NOT NULL DEFAULT 'active',
  "stop_reason" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fasting_sessions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "fasting_sessions_status_check" CHECK ("status" IN ('setup','active','stopped','completed'))
);

CREATE TABLE "checkins" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "session_id" BIGINT,
  "condition" VARCHAR(40) NOT NULL,
  "emoji" VARCHAR(10),
  "water_glasses" SMALLINT NOT NULL DEFAULT 0,
  "jaroliva_taken" BOOLEAN NOT NULL,
  "followed_protocol" BOOLEAN NOT NULL,
  "points_earned" INTEGER NOT NULL DEFAULT 10,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "checkins_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "checkins_water_glasses_check" CHECK ("water_glasses" BETWEEN 0 AND 20)
);

CREATE TABLE "glucose_logs" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "session_id" BIGINT,
  "phase" VARCHAR(40) NOT NULL,
  "value" SMALLINT NOT NULL,
  "unit" VARCHAR(10) NOT NULL DEFAULT 'mg/dL',
  "logged_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "glucose_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "glucose_logs_value_check" CHECK ("value" BETWEEN 20 AND 600)
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "one_active_session_per_user" ON "fasting_sessions"("user_id") WHERE "status" = 'active';
CREATE INDEX "fasting_sessions_user_id_idx" ON "fasting_sessions"("user_id");
CREATE INDEX "checkins_user_created_idx" ON "checkins"("user_id", "created_at" DESC);
CREATE INDEX "glucose_user_logged_idx" ON "glucose_logs"("user_id", "logged_at" DESC);

ALTER TABLE "fasting_sessions" ADD CONSTRAINT "fasting_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "fasting_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "glucose_logs" ADD CONSTRAINT "glucose_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "glucose_logs" ADD CONSTRAINT "glucose_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "fasting_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
