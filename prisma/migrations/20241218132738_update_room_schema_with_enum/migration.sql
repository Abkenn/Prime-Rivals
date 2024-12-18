/*
  Warnings:

  - The `status` column on the `Room` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('Waiting', 'Playing', 'Completed');

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "status",
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'Waiting';
