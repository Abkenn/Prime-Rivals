import { Skeleton } from "@/app/_components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col items-center min-h-screen px-8 py-24 space-y-8">
      <h1 className="text-2xl font-bold text-center">Prime Rivals</h1>

      <div className="flex items-center space-x-4">
        <Skeleton className="w-32 h-6 rounded-md" />

        <span className="text-lg font-semibold">vs</span>

        <Skeleton className="w-32 h-6 rounded-md" />
      </div>
    </div>
  );
}
