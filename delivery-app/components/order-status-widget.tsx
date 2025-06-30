"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, Truck, Eye } from "lucide-react"
import Link from "next/link"

interface ActiveOrder {
  id: string
  status: string
  estimatedTime: string
  items: string[]
}

export default function OrderStatusWidget() {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null)

  useEffect(() => {
    // Simular verificación de pedidos activos
    const checkActiveOrders = () => {
      // En una implementación real, esto consultaría la API
      const hasActiveOrder = Math.random() > 0.7 // 30% de probabilidad

      if (hasActiveOrder) {
        setActiveOrder({
          id: "ORD-001",
          status: "in_transit",
          estimatedTime: "15-20 min",
          items: ["Tabla Premium", "Pisco Sour x2"],
        })
      }
    }

    checkActiveOrders()
    const interval = setInterval(checkActiveOrders, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!activeOrder) {
    return null
  }

  const getStatusText = (status: string) => {
    const texts = {
      confirmed: "Confirmado",
      preparing: "Preparando",
      ready: "Listo",
      in_transit: "En Camino",
    }
    return texts[status as keyof typeof texts] || status
  }

  const getStatusIcon = (status: string) => {
    if (status === "in_transit") return <Truck className="h-4 w-4" />
    if (status === "preparing") return <Package className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="border-amber-200 shadow-lg bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-amber-800 flex items-center gap-2 text-sm">
            {getStatusIcon(activeOrder.status)}
            Pedido en Progreso
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">#{activeOrder.id}</span>
              <Badge className="bg-green-500 text-white text-xs animate-pulse">
                {getStatusText(activeOrder.status)}
              </Badge>
            </div>

            <p className="text-xs text-gray-600">{activeOrder.items.join(", ")}</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activeOrder.estimatedTime}
              </span>
              <Link href={`/tracking/${activeOrder.id}`}>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-xs h-7">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
