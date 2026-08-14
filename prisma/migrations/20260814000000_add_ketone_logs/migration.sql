CREATE TABLE "ketone_logs" (
  "id" BIGSERIAL NOT NULL,
  "user_id" BIGINT NOT NULL,
  "session_id" BIGINT,
  "phase" VARCHAR(40) NOT NULL,
  "value" DECIMAL(4,2) NOT NULL,
  "unit" VARCHAR(10) NOT NULL DEFAULT 'mmol/L',
  "logged_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ketone_logs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ketone_logs_value_check" CHECK ("value" BETWEEN 0 AND 20)
);

CREATE INDEX "ketone_user_logged_idx" ON "ketone_logs"("user_id", "logged_at" DESC);

ALTER TABLE "ketone_logs" ADD CONSTRAINT "ketone_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ketone_logs" ADD CONSTRAINT "ketone_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "fasting_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
