'use server';

import { Room } from '@prisma/client';

export const createRoom = async (
  playerName: string,
  roomCode: string,
): Promise<Room> => {
  const response = await fetch('http://localhost:3000/api/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hostPlayerName: playerName, roomCode }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create room.');
  }

  return response.json();
};

export const joinRoom = async (
  playerName: string,
  roomCode: string,
): Promise<Room> => {
  const response = await fetch('http://localhost:3000/api/rooms', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ secondPlayerName: playerName, roomCode }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to join room.');
  }

  return response.json();
};
