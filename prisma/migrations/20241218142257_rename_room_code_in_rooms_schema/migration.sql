/*
  Warnings:

  - You are about to drop the column `code` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomCode]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomCode` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Room_code_key";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "code",
ADD COLUMN     "roomCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomCode_key" ON "Room"("roomCode");
