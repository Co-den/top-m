"use client"

import type React from "react"

import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCard {
  title: string
  value: string
  icon: React.ReactNode
  bgColor: string
  textColor: string
  iconBgColor: string
}

export function StatsCards() {
  const stats: StatCard[] = [
    {
      title: "Pending Approvals",
      value: "0",
      icon: <Clock className="h-6 w-6" />,
      bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
      textColor: "text-yellow-600 dark:text-yellow-400",
      iconBgColor: "bg-yellow-100 dark:bg-yellow-900/50",
    },
    {
      title: "Approved Plans",
      value: "0",
      icon: <CheckCircle className="h-6 w-6" />,
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-600 dark:text-green-400",
      iconBgColor: "bg-green-100 dark:bg-green-900/50",
    },
    {
      title: "Rejected Plans",
      value: "0",
      icon: <XCircle className="h-6 w-6" />,
      bgColor: "bg-red-50 dark:bg-red-950/30",
      textColor: "text-red-600 dark:text-red-400",
      iconBgColor: "bg-red-100 dark:bg-red-900/50",
    },
    {
      title: "Total Invested",
      value: "₦0",
      icon: <TrendingUp className="h-6 w-6" />,
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
      iconBgColor: "bg-blue-100 dark:bg-blue-900/50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className={`${stat.bgColor} border-0`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={`text-sm font-medium ${stat.textColor}`}>{stat.title}</CardTitle>
            <div className={`p-3 rounded-lg ${stat.iconBgColor}`}>
              <div className={stat.textColor}>{stat.icon}</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
