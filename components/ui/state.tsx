export const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">{message}</div>
);

export const ErrorState = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-red-200">{message}</div>
);
