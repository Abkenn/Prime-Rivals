'use client';

import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from "react";

export type RoomPersistence = {
  host: string | undefined,
  setHost: Dispatch<SetStateAction<string | undefined>>
  guest: string | undefined,
  setGuest: Dispatch<SetStateAction<string | undefined>>
  roomCode: string | undefined,
  setRoomCode: Dispatch<SetStateAction<string | undefined>>
};

export const RoomContext = createContext<RoomPersistence | null>(null);

export const RoomProvider = ({ children }: PropsWithChildren) => {
  const [host, setHost] = useState<string>();
  const [guest, setGuest] = useState<string>();
  const [roomCode, setRoomCode] = useState<string>();

  return (<RoomContext value={{ host, setHost, guest, setGuest, roomCode, setRoomCode }}>
    {children}
  </RoomContext>);
};
