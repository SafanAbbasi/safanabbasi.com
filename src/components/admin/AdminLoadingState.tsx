import type { ReactNode } from "react";

export default function AdminLoadingState({
  message = "Loading dashboard...",
}: {
  message?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-violet-600" />
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </main>
  );
}
