-- CreateEnum
CREATE TYPE "UserTier" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "UserTier" NOT NULL DEFAULT 'FREE';

UPDATE "User" SET "plan" = 'PRO' WHERE "isPremium" = true;