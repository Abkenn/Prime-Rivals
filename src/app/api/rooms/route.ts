import { PrismaClient, Room } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

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
    message: secondPlayerName
  });

  return NextResponse.json(room);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');

  if (!roomCode) {
    return NextResponse.json(
      { error: 'Room code is required' },
      { status: 400 }
    );
  }

  try {
    const prisma = new PrismaClient();
    const room = await prisma.room.findUnique({
      where: { roomCode }
    });

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}
