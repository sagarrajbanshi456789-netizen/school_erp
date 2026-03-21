'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  UsersIcon,
  DollarSignIcon,
  ActivityIcon,
  TrendingUpIcon,
  IdCardLanyard,
} from 'lucide-react'

export default function Stats() {
  const stats = [
    { title: 'Total Users', value: '8,234', icon: UsersIcon },
    { title: 'Revenue', value: 'Rs 145,678', icon: DollarSignIcon },
    { title: 'Active Sessions', value: '89', icon: ActivityIcon },
    { title: 'Conversion', value: '3.2%', icon: TrendingUpIcon },
    { title: 'Employees', value: '120', icon: IdCardLanyard },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex justify-between">
              <CardTitle>{stat.title}</CardTitle>
              <Icon className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
