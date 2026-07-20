export function SuspenseFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
      <div
        className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }}
      />
    </div>
  );
}
