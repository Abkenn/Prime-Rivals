'use client';

import { use, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { createRoom, joinRoom } from '../_actions/roomActions';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useRoomLive } from '../_hooks/useRoomLive';
import { RoomContext } from '../_providers/RoomProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';

const schema = z
  .object({
    playerName: z.string().nonempty('Name is required'),
    roomCode: z.string().optional(),
    mode: z.enum(['create', 'join'])
  })
  .refine(
    (data) =>
      data.mode === 'create' ||
      (data.mode === 'join' && data.roomCode && data.roomCode.trim() !== ''),
    { message: 'Room code is required', path: ['roomCode'] }
  );

type RoomFormData = z.infer<typeof schema>;

export const RoomSetup = () => {
  const [isWaiting, setIsWaiting] = useState(false);

  const { subscribe, playerJoined } = useRoomLive();

  const router = useRouter();

  const roomContext = use(RoomContext);

  const form = useForm<RoomFormData>({
    resolver: zodResolver(schema),
    defaultValues: { playerName: '', roomCode: '', mode: 'create' }
  });

  const { register, watch, setValue, handleSubmit } = form;

  const mode = watch('mode');

  const onSubmit = async (data: RoomFormData) => {
    const { playerName, roomCode, mode } = data;

    if (mode === 'create') {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      setValue('roomCode', code);
      await createRoom(playerName, code);
      roomContext?.setHost(playerName);
      roomContext?.setRoomCode(code);
      subscribe(code);
    } else {
      await joinRoom(playerName, String(roomCode));
      roomContext?.setGuest(playerName);
      roomContext?.setRoomCode(roomCode);
      setTimeout(() => {
        router.push(`/game?roomCode=${roomCode}`);
      }, 5000);
    }

    setIsWaiting(true);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="playerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Player Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="roomCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Code</FormLabel>
              <FormControl>
                <Input {...field} disabled={isWaiting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <input type="hidden" {...register('mode')} />

        <div className="flex gap-2">
          <Button
            type="submit"
            onClick={() => setValue('mode', 'create')}
            disabled={isWaiting}
          >
            Create Game
          </Button>

          <Button
            type="submit"
            onClick={() => setValue('mode', 'join')}
            disabled={isWaiting}
          >
            {mode === 'join' ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Please wait
              </span>
            ) : (
              <span>Join Game</span>
            )}
          </Button>
        </div>

        {isWaiting && mode === 'create' && (
          <div>
            {playerJoined
              ? `${playerJoined} has joined the room!`
              : 'Waiting for another player to join...'}
          </div>
        )}
      </form>
    </FormProvider>
  );
};
