-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('Waiting', 'Playing', 'Completed');

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "roomCode" TEXT NOT NULL,
    "hostPlayerName" TEXT NOT NULL,
    "secondPlayerName" TEXT,
    "hostScore" INTEGER NOT NULL DEFAULT 0,
    "secondPlayerScore" INTEGER NOT NULL DEFAULT 0,
    "status" "RoomStatus" NOT NULL DEFAULT 'Waiting',

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_roomCode_key" ON "Room"("roomCode");
