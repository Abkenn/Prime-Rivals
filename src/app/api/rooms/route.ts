import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { hostPlayerName } = await req.json();

  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const room = await prisma.room.create({
    data: { roomCode: roomCode, hostPlayerName }
  });

  return NextResponse.json(room);
}
