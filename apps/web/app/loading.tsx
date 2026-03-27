export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-full border-2 border-white/10" />
          <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-electric border-r-signal animate-spin" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-mist">Loading MBMApps</p>
      </div>
    </div>
  );
}
