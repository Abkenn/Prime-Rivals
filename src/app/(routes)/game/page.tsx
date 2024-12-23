import { getRoom } from "@/app/_actions/roomActions";

export default async function GamePage({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const roomCode = searchParams.roomCode ?? '';
  const roomData = await getRoom(roomCode);

  return (
    <div className="flex flex-col items-center min-h-screen px-8 py-24 space-y-8">
      <h1 className="text-2xl font-bold text-center">Prime Rivals</h1>

      <h2 className="text-xl font-semibold">{roomData.hostPlayerName} vs {roomData.secondPlayerName}</h2>
    </div>
  );
}
