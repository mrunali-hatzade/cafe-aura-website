export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-background">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        <div className="absolute inset-4 rounded-full bg-primary/10" />
      </div>
    </main>
  )
}
