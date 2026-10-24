import { Button } from "@/components/ui/button"

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-50">
      <h1 className="text-2xl font-bold tracking-tight mb-4">Course Scheduler</h1>
      <Button onClick={() => alert("Tailwind & Shadcn are working!")}>
        Test Button
      </Button>
    </div>
  )
}