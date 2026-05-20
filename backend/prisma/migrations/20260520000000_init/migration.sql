CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');
CREATE TYPE "BookingStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'COMPLETED');
CREATE TYPE "LaundryResourceType" AS ENUM ('WASHER', 'DRYER');

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" VARCHAR(120) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "studentId" VARCHAR(40) NOT NULL,
  "password_hash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LaundryBooking" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "resource_type" "LaundryResourceType" NOT NULL,
  "resource_number" INTEGER NOT NULL,
  "starts_at" TIMESTAMP(3) NOT NULL,
  "ends_at" TIMESTAMP(3) NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'ACTIVE',
  "cancelled_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LaundryBooking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LaundryBooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LaundryBooking_resource_number_check" CHECK ("resource_number" > 0),
  CONSTRAINT "LaundryBooking_time_check" CHECK ("ends_at" > "starts_at")
);

CREATE TABLE "GroundBooking" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "ground_name" VARCHAR(120) NOT NULL DEFAULT 'CST Football Ground',
  "starts_at" TIMESTAMP(3) NOT NULL,
  "ends_at" TIMESTAMP(3) NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'ACTIVE',
  "cancelled_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GroundBooking_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GroundBooking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "GroundBooking_time_check" CHECK ("ends_at" > "starts_at")
);

CREATE TABLE "Notification" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "title" VARCHAR(140) NOT NULL,
  "message" TEXT NOT NULL,
  "read_at" TIMESTAMP(3),
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_studentId_idx" ON "User"("studentId");

CREATE INDEX "LaundryBooking_user_id_starts_at_idx" ON "LaundryBooking"("user_id", "starts_at");
CREATE INDEX "LaundryBooking_starts_at_ends_at_idx" ON "LaundryBooking"("starts_at", "ends_at");
CREATE INDEX "LaundryBooking_resource_type_resource_number_starts_at_idx" ON "LaundryBooking"("resource_type", "resource_number", "starts_at");
CREATE UNIQUE INDEX "LaundryBooking_active_slot_unique" ON "LaundryBooking"("resource_type", "resource_number", "starts_at") WHERE "status" = 'ACTIVE';

CREATE INDEX "GroundBooking_user_id_starts_at_idx" ON "GroundBooking"("user_id", "starts_at");
CREATE INDEX "GroundBooking_starts_at_ends_at_idx" ON "GroundBooking"("starts_at", "ends_at");
CREATE INDEX "GroundBooking_ground_name_starts_at_idx" ON "GroundBooking"("ground_name", "starts_at");
CREATE UNIQUE INDEX "GroundBooking_active_slot_unique" ON "GroundBooking"("ground_name", "starts_at") WHERE "status" = 'ACTIVE';

CREATE INDEX "Notification_user_id_read_at_created_at_idx" ON "Notification"("user_id", "read_at", "created_at");
