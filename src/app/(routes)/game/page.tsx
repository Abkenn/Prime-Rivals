import { getRoom } from "@/app/_actions/roomActions";

export default async function GamePage(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const searchParams = await props.searchParams;
  const roomData = await getRoom(searchParams.roomCode ?? '');

  return (
    <div className="flex flex-col items-center min-h-screen px-8 py-24 space-y-8">
      <h1 className="text-2xl font-bold text-center">Prime Rivals</h1>

      <h2 className="text-xl font-semibold">{roomData.hostPlayerName} vs {roomData.secondPlayerName}</h2>
    </div>
  );
}
