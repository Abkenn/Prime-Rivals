import { RoomSetup } from '../_components/RoomSetup';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 bg-gray-50">
      <h1 className="text-2xl font-bold text-center">PvP Math Game</h1>

      <RoomSetup />
    </div>
  );
}
