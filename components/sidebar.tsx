"use client"

import { useState } from "react"
import Link from "next/link"
import { LayoutDashboard, BarChart3, Users, ShoppingCart, Settings, ChevronRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "#" },
    { icon: BarChart3, label: "Analytics", href: "#" },
    { icon: Users, label: "Users", href: "#" },
    { icon: ShoppingCart, label: "Deposits", href: "/deposits-table", active: true },
    { icon: Settings, label: "Settings", href: "#" },
  ]

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          "hidden lg:flex",
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div
            className={cn(
              "flex items-center justify-center h-10 bg-sidebar-primary rounded-lg text-sidebar-primary-foreground font-bold text-xl",
              collapsed && "h-10 w-10",
            )}
          >
            {collapsed ? "M" : "TopMart"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                item.active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!collapsed && item.active && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-sidebar-primary">N</span>
            </div>
            {!collapsed && (
              <div className="text-sm">
                <p className="font-medium text-sidebar-foreground">Admin</p>
                <p className="text-xs text-sidebar-foreground/60">admin@topmart.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
