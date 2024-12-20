import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';
import { Realtime } from 'ably';

export async function POST(req: NextRequest) {
  const { hostPlayerName, roomCode } = await req.json();

  const prisma = new PrismaClient();

  const room = await prisma.room.create({
    data: { roomCode, hostPlayerName }
  });

  return NextResponse.json(room);
}

export async function PUT(req: NextRequest) {
  const { roomCode, secondPlayerName } = await req.json();

  const prisma = new PrismaClient();

  const room = await prisma.room.update({
    where: { roomCode },
    data: { secondPlayerName, status: 'Playing' }
  });

  const ably = new Realtime({ key: process.env.ABLY_API_KEY });

  const channel = ably.channels.get(`room-${roomCode}`);
  await channel.publish('player-joined', {
    message: `${secondPlayerName} has joined!`
  });

  return NextResponse.json(room);
}
