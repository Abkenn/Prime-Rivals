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
    {
      message: 'Room code is required',
      path: ['roomCode']
    }
  );

type RoomFormData = z.infer<typeof schema>;

export const RoomSetup = () => {
  const { subscribe, playerJoined } = useRoomLive();
  const isRoomReady = playerJoined && playerJoined.trim() !== '';

  const form = useForm<RoomFormData>({
    resolver: zodResolver(schema),
    defaultValues: { playerName: '', roomCode: '', mode: 'create' }
  });

  const onSubmit = async (data: RoomFormData) => {
    if (data.mode === 'create') {
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();
      form.setValue('roomCode', code);
      await createRoom(form.getValues('playerName'), code);
      subscribe(code);
    } else {
      await joinRoom(
        form.getValues('playerName'),
        String(form.getValues('roomCode'))
      );
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <input type="hidden" {...form.register('mode')} />

        <div className="flex gap-2">
          <Button
            type="submit"
            onClick={() => form.setValue('mode', 'create')}
            disabled={!isRoomReady}
          >
            Create Game
          </Button>

          <Button
            type="submit"
            onClick={() => form.setValue('mode', 'join')}
            disabled={!isRoomReady}
          >
            Join Game
          </Button>
        </div>

        {isRoomReady ? (
          <div>{playerJoined} joined the room!</div>
        ) : (
          <div>Waiting for another player to join...</div>
        )}
      </form>
    </FormProvider>
  );
};
