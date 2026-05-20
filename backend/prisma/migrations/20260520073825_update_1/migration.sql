-- AlterTable
ALTER TABLE "GroundBooking" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "LaundryBooking" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP DEFAULT;
