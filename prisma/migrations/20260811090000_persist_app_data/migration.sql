CREATE TABLE "screenings" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "answers" JSONB NOT NULL,
  "score" INTEGER NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "points_earned" INTEGER NOT NULL DEFAULT 50,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "screenings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "point_transactions" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "amount" INTEGER NOT NULL,
  "reason" VARCHAR(100) NOT NULL,
  "source_type" VARCHAR(40),
  "source_id" VARCHAR(50),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "badges" (
  "id" BIGSERIAL NOT NULL,
  "code" VARCHAR(50) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "emoji" VARCHAR(10) NOT NULL,
  "rarity" VARCHAR(20) NOT NULL,
  CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_badges" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "badge_id" BIGINT NOT NULL,
  "earned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "consumption_logs" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "schedule_key" VARCHAR(50) NOT NULL,
  "consumed_on" DATE NOT NULL,
  "consumed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "consumption_logs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notifications" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "title" VARCHAR(120) NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR(30) NOT NULL DEFAULT 'info',
  "read_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "screenings_user_id_created_at_idx" ON "screenings"("user_id", "created_at" DESC);
CREATE INDEX "point_transactions_user_id_created_at_idx" ON "point_transactions"("user_id", "created_at" DESC);
CREATE UNIQUE INDEX "badges_code_key" ON "badges"("code");
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");
CREATE UNIQUE INDEX "consumption_logs_user_id_schedule_key_consumed_on_key" ON "consumption_logs"("user_id", "schedule_key", "consumed_on");
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at" DESC);

ALTER TABLE "screenings" ADD CONSTRAINT "screenings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "consumption_logs" ADD CONSTRAINT "consumption_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "badges" ("code", "name", "description", "emoji", "rarity") VALUES
('health-scout', 'Health Scout', 'Selesaikan screening kesehatan pertama', '🩺', 'COMMON'),
('first-faster', 'First Faster', 'Selesaikan FF72 pertama kali', '🏃', 'COMMON'),
('triple-flame', 'Triple Flame', 'Selesaikan FF72 sebanyak 3 kali', '🔥', 'RARE'),
('power-faster', 'Power Faster', 'Selesaikan FF72 sebanyak 5 kali', '⚡', 'RARE'),
('star-earner', 'Star Earner', 'Kumpulkan 300 poin', '⭐', 'COMMON'),
('diamond-member', 'Diamond Member', 'Kumpulkan 600 poin', '💎', 'RARE'),
('jaxlab-champion', 'JaxLab Champion', 'Kumpulkan 3000 poin', '🏆', 'EPIC'),
('fasting-legend', 'Fasting Legend', 'Selesaikan FF72 sebanyak 10 kali', '👑', 'EPIC');
