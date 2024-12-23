'use client';

import { Realtime, RealtimeChannel } from 'ably';
import { use, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { RoomContext } from '../_providers/RoomProvider';

type UseAblyPlayerJoinHook = {
  playerJoined: string | null;
  subscribe: (roomCode: string) => void;
};

export const useRoomLive = (): UseAblyPlayerJoinHook => {
  const [playerJoined, setPlayerJoined] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const roomContext = use(RoomContext);

  const router = useRouter();

  const subscribe = (roomCode: string) => {
    const ably = new Realtime({ key: process.env.ABLY_API_KEY });
    const roomChannel = ably.channels.get(`room-${roomCode}`);

    roomChannel.subscribe('player-joined', (message) => {
      const { message: secondPlayerName } = message.data;
      setPlayerJoined(secondPlayerName ?? null);
    });

    setChannel(roomChannel);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (playerJoined) {
      timeout = setTimeout(() => {
        router.push(`/game?roomCode=${roomContext?.roomCode}`);
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [playerJoined, roomContext?.roomCode, router]);

  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
        channel.detach();
      }
    };
  }, [channel]);

  return { playerJoined, subscribe };
};
