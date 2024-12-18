/*
  Warnings:

  - You are about to drop the column `secondScore` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "secondScore",
ADD COLUMN     "secondPlayerScore" INTEGER NOT NULL DEFAULT 0;
