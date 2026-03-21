'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts'

interface RevenueData {
  month: string
  revenue: number
}

interface IncomeData {
  class: string
  income: number
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value?: number; name?: string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value ?? 0
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md">
        <p className="text-sm">{label}</p>
        <p className="font-bold">{value.toLocaleString()} Rs</p>
      </div>
    )
  }
  return null
}

export default function Charts() {
  const [selectedClass, setSelectedClass] = useState('All')
  const [revenueData, setRevenueData] = useState<RevenueData[]>([
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4780 },
    { month: 'May', revenue: 5890 },
    { month: 'Jun', revenue: 6390 },
  ])

  const allClassIncomeData: IncomeData[] = [
    { class: '6', income: 678 },
    { class: '7', income: 5678 },
    { class: '8', income: 45678 },
    { class: '9', income: 378 },
    { class: '10', income: 978 },
  ]

  const classIncomeData = useMemo(
    () =>
      selectedClass === 'All'
        ? allClassIncomeData
        : allClassIncomeData.filter((d) => d.class === selectedClass),
    [selectedClass]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenueData((prev) =>
        prev.map((d) => ({
          ...d,
          revenue: Math.floor(d.revenue * (0.9 + Math.random() * 0.2)),
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-2 mb-6">
      {/* Line Chart */}
      <Card className="h-80">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="h-80">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Income by Class</CardTitle>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded p-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {allClassIncomeData.map((d) => (
              <option key={d.class} value={d.class}>
                Class {d.class}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={classIncomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" radius={[6, 6, 0, 0]} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}