import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Room } from '@prisma/client';

import { Rest } from 'ably';

export async function POST(req: NextRequest) {
  const { hostPlayerName, roomCode } = (await req.json()) as Pick<
    Room,
    'hostPlayerName' | 'roomCode'
  >;

  const prisma = new PrismaClient();

  const room = await prisma.room.create({
    data: { roomCode, hostPlayerName }
  });

  return NextResponse.json(room);
}

export async function PUT(req: NextRequest) {
  const { secondPlayerName, roomCode } = (await req.json()) as Pick<
    Room,
    'secondPlayerName' | 'roomCode'
  >;

  const prisma = new PrismaClient();

  const room = await prisma.room.update({
    where: { roomCode },
    data: { secondPlayerName, status: 'Playing' }
  });

  const rest = new Rest({ key: process.env.ABLY_API_KEY });
  const channel = rest.channels.get(`room-${roomCode}`);
  await channel.publish('player-joined', {
    message: `${secondPlayerName} has joined!`
  });

  return NextResponse.json(room);
}
