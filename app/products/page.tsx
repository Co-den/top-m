"use client"

import { BottomNav } from "@/components/bottom-nav"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-pink-500 text-white p-6">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-slate-600">Products coming soon...</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
