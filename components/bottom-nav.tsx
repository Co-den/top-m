"use client"

import { House, ShoppingBag, Share2, UserCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
  
export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { icon: House, label: "Home", path: "/home" },
    { icon: ShoppingBag, label: "Products", path: "/products" },
    { icon: Share2, label: "Share", path: "/referral" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex justify-between py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center gap-1 py-2 transition-colors"
                aria-label={item.label}
              >
                <Icon
                  className={`w-7 h-7 ${isActive ? "text-pink-600" : "text-gray-700"}`}
                />
                <span
                  className={`text-xs font-medium ${isActive ? "text-pink-600" : "text-gray-700"}`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
