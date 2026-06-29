import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="text-sm font-medium tracking-widest text-muted-foreground">404 ERROR</p>
      <h1 className="text-balance text-4xl font-semibold text-foreground sm:text-5xl">Page not found</h1>
      <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
      </p>
      <Button>
        <Link to="/">Back to home</Link>
      </Button>
    </main>
  )
}