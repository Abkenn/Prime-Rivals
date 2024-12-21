import { Realtime, RealtimeChannel } from 'ably';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

type UseAblyPlayerJoinHook = {
  playerJoined: string | null;
  subscribe: (roomCode: string) => void;
};

export const useRoomLive = (): UseAblyPlayerJoinHook => {
  const [playerJoined, setPlayerJoined] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

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
        router.push('/game');
      }, 5000);
    }

    return () => clearTimeout(timeout);
  }, [playerJoined, router]);

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
