"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IncomeRecord {
  id: string
  amount: number
  date: string
  status: "completed" | "pending"
  reference: string
  source: string
}

export default function IncomeRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with actual API call
  const incomeRecords: IncomeRecord[] = [
    {
      id: "1",
      amount: 150000,
      date: "2025-12-05",
      status: "completed",
      reference: "INC-2025-001",
      source: "Sales - Order #12345",
    },
    {
      id: "2",
      amount: 75000,
      date: "2025-12-04",
      status: "completed",
      reference: "INC-2025-002",
      source: "Referral Bonus",
    },
    {
      id: "3",
      amount: 200000,
      date: "2025-12-03",
      status: "completed",
      reference: "INC-2025-003",
      source: "Sales - Order #12346",
    },
    {
      id: "4",
      amount: 50000,
      date: "2025-12-02",
      status: "pending",
      reference: "INC-2025-004",
      source: "Commission Payment",
    },
    {
      id: "5",
      amount: 100000,
      date: "2025-12-01",
      status: "completed",
      reference: "INC-2025-005",
      source: "Sales - Order #12344",
    },
  ]

  const filteredIncomeRecords = incomeRecords.filter(
    (record) =>
      record.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.source.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRecords = incomeRecords.length
  const completedRecords = incomeRecords.filter((r) => r.status === "completed").length
  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0)

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
          <h1 className="text-xl font-semibold">Income Records</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 bg-indigo-50 border-indigo-200">
            <div className="text-sm text-gray-600 mb-1">Total Records</div>
            <div className="text-2xl font-bold text-indigo-600">{totalRecords}</div>
          </Card>
          <Card className="p-4 bg-teal-50 border-teal-200">
            <div className="text-sm text-gray-600 mb-1">Total Income</div>
            <div className="text-xl font-bold text-teal-600">₦{totalIncome.toLocaleString()}</div>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by reference or source..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {filteredIncomeRecords.length > 0 ? (
            filteredIncomeRecords.map((record) => (
              <Card key={record.id} className="p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{record.reference}</h3>
                    <p className="text-sm text-gray-500 mt-1">{record.source}</p>
                  </div>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{record.date}</span>
                  <span className="text-lg font-bold text-teal-600">+₦{record.amount.toLocaleString()}</span>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center border-gray-200">
              <p className="text-gray-500">No income records found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
