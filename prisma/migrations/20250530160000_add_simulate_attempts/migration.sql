-- SimulateAttempt: one row per SimulateIt drill completion (anonymous).
CREATE TABLE "simulate_attempts" (
    "id" TEXT NOT NULL,
    "drill_slug" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "max_possible" INTEGER NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "simulate_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "simulate_attempts_completed_at_idx" ON "simulate_attempts"("completed_at");
CREATE INDEX "simulate_attempts_drill_slug_idx" ON "simulate_attempts"("drill_slug");
