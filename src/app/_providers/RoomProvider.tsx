'use client';

import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from "react";

export type RoomPersistence = {
  player: string | undefined,
  setPlayer: Dispatch<SetStateAction<string | undefined>>
  enemy: string | undefined,
  setEnemy: Dispatch<SetStateAction<string | undefined>>
  roomCode: string | undefined,
  setRoomCode: Dispatch<SetStateAction<string | undefined>>
};

export const RoomContext = createContext<RoomPersistence | null>(null);

export const RoomProvider = ({ children }: PropsWithChildren) => {
  const [player, setPlayer] = useState<string>();
  const [enemy, setEnemy] = useState<string>();
  const [roomCode, setRoomCode] = useState<string>();

  return (<RoomContext value={{ player, setPlayer, enemy, setEnemy, roomCode, setRoomCode }}>
    {children}
  </RoomContext>);
};
