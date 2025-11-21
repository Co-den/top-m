"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Top Mart</h1>
        <p className="text-slate-600 mb-8">Welcome to Top Mart</p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold"
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
