'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { FormProvider, useForm } from 'react-hook-form';
import { createRoom, joinRoom } from '../_actions/roomActions';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2 } from 'lucide-react';
import { useRoomLive } from '../_hooks/useRoomLive';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const { subscribe, playerJoined } = useRoomLive();
  const isRoomReady = Boolean(playerJoined && playerJoined.trim() !== '');

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
      subscribe(code);
    } else {
      await joinRoom(playerName, String(roomCode));
    }
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
                <Input {...field} disabled={!isRoomReady} />
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
            disabled={!isRoomReady}
          >
            Create Game
          </Button>

          <Button
            type="submit"
            onClick={() => setValue('mode', 'join')}
            disabled={!isRoomReady}
          >
            {mode === 'join' ? (
              <span>
                <Loader2 className="animate-spin" />
                Please wait
              </span>
            ) : (
              <span>Join Game</span>
            )}
          </Button>
        </div>

        {mode === 'create' && (
          <div>
            {isRoomReady
              ? `${playerJoined} joined the room!`
              : 'Waiting for another player to join...'}
          </div>
        )}
      </form>
    </FormProvider>
  );
};
