"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DepositRecord {
  id: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  reference: string
  method: string
}

export default function DepositRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual API call
  const deposits: DepositRecord[] = [
    {
      id: "1",
      amount: 50000,
      date: "2025-12-05",
      status: "completed",
      reference: "DEP-2025-001",
      method: "Bank Transfer",
    },
    {
      id: "2",
      amount: 25000,
      date: "2025-12-04",
      status: "completed",
      reference: "DEP-2025-002",
      method: "Card",
    },
    {
      id: "3",
      amount: 100000,
      date: "2025-12-03",
      status: "pending",
      reference: "DEP-2025-003",
      method: "Bank Transfer",
    },
    {
      id: "4",
      amount: 75000,
      date: "2025-12-02",
      status: "completed",
      reference: "DEP-2025-004",
      method: "Mobile Money",
    },
  ]

  const filteredDeposits = deposits.filter(
    (deposit) =>
      deposit.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.method.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalDeposits = deposits.length
  const completedDeposits = deposits.filter((d) => d.status === "completed").length
  const totalAmount = deposits.filter((d) => d.status === "completed").reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Deposit Records</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Total Deposits</div>
            <div className="text-2xl font-bold text-blue-600">{totalDeposits}</div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-sm text-gray-600 mb-1">Total Amount</div>
            <div className="text-xl font-bold text-green-600">₦{totalAmount.toLocaleString()}</div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by reference or method..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {filteredDeposits.length > 0 ? (
            filteredDeposits.map((deposit) => (
              <Card key={deposit.id} className="p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{deposit.reference}</h3>
                    <p className="text-sm text-gray-500 mt-1">{deposit.method}</p>
                  </div>
                  <Badge className={getStatusColor(deposit.status)}>
                    {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{deposit.date}</span>
                  <span className="text-lg font-bold text-green-600">+₦{deposit.amount.toLocaleString()}</span>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center border-gray-200">
              <p className="text-gray-500">No deposits found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
