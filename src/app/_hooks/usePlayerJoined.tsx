import { Realtime, RealtimeChannel } from 'ably';
import { useEffect, useState } from 'react';

type UseAblyPlayerJoinHook = {
  playerJoined: string | null;
  subscribe: (roomCode: string) => void;
};

export const useAblyPlayerJoin = (): UseAblyPlayerJoinHook => {
  const [playerJoined, setPlayerJoined] = useState<string | null>(null);
  const [channel, setChannel] = useState<null | RealtimeChannel>(null);

  useEffect(() => {
    return () => {
      if (channel) {
        channel.unsubscribe();
        channel.detach();
      }
    };
  }, [channel]);

  const subscribe = (roomCode: string) => {
    const ably = new Realtime({ key: process.env.ABLY_API_KEY });
    const roomChannel = ably.channels.get(`room-${roomCode}`);

    roomChannel.subscribe('player-joined', (message) => {
      const { message: secondPlayerName } = message.data;
      setPlayerJoined(secondPlayerName ?? null);
    });

    setChannel(roomChannel);
  };

  return { playerJoined, subscribe };
};
