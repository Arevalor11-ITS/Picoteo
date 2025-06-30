"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Clock, Package, Navigation, Phone, CheckCircle } from "lucide-react"
import DriverLocationTracker from "@/components/driver-location-tracker"

interface DeliveryOrder {
  id: string
  customerName: string
  customerAddress: string
  customerPhone: string
  items: string[]
  total: number
  status: "assigned" | "picked_up" | "in_transit" | "delivered"
  estimatedTime: string
  distance: number
}

export default function DriverDashboard() {
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([
    {
      id: "ORD-001",
      customerName: "María González",
      customerAddress: "Av. Providencia 1234, Providencia",
      customerPhone: "+56 9 1234 5678",
      items: ["Tabla Premium", "Pisco Sour x2"],
      total: 41000,
      status: "assigned",
      estimatedTime: "25 min",
      distance: 3.2,
    },
    {
      id: "ORD-002",
      customerName: "Juan Pérez",
      customerAddress: "Las Condes 567, Las Condes",
      customerPhone: "+56 9 8765 4321",
      items: ["Vino Tinto", "Tabla Clásica"],
      total: 33000,
      status: "picked_up",
      estimatedTime: "15 min",
      distance: 1.8,
    },
  ])

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [driverStats, setDriverStats] = useState({
    deliveriesToday: 12,
    totalEarnings: 85000,
    averageRating: 4.8,
    completionRate: 98,
  })

  const updateOrderStatus = (orderId: string, newStatus: DeliveryOrder["status"]) => {
    setActiveOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getStatusColor = (status: string) => {
    const colors = {
      assigned: "bg-blue-500",
      picked_up: "bg-orange-500",
      in_transit: "bg-green-500",
      delivered: "bg-emerald-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusText = (status: string) => {
    const texts = {
      assigned: "Asignado",
      picked_up: "Recogido",
      in_transit: "En Camino",
      delivered: "Entregado",
    }
    return texts[status as keyof typeof texts] || "Desconocido"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Panel del Repartidor
          </h1>

          {/* Estadísticas del Repartidor */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{driverStats.deliveriesToday}</p>
                <p className="text-sm text-gray-600">Entregas Hoy</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-green-600 text-2xl font-bold mb-2">
                  ${driverStats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Ganancias Hoy</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-yellow-600 text-2xl font-bold mb-2">⭐ {driverStats.averageRating}</div>
                <p className="text-sm text-gray-600">Calificación</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-blue-600 text-2xl font-bold mb-2">{driverStats.completionRate}%</div>
                <p className="text-sm text-gray-600">Tasa Completada</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Lista de Pedidos Activos */}
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Pedidos Activos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOrder === order.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-blue-200 hover:border-blue-300"
                      }`}
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-blue-800">#{order.id}</h3>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          <span>{order.customerAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>
                            {order.estimatedTime} • {order.distance} km
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-blue-600" />
                          <span>{order.items.join(", ")}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="font-bold text-blue-600">${order.total.toLocaleString()}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Llamar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="h-3 w-3 mr-1" />
                            Navegar
                          </Button>
                          {order.status === "assigned" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order.id, "picked_up")
                              }}
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              Recoger
                            </Button>
                          )}
                          {order.status === "picked_up" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order.id, "in_transit")
                              }}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              En Camino
                            </Button>
                          )}
                          {order.status === "in_transit" && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateOrderStatus(order.id, "delivered")
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Entregar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Panel de Seguimiento GPS */}
            <div>
              {selectedOrder ? (
                <DriverLocationTracker
                  driverId="driver-001"
                  orderId={selectedOrder}
                  onLocationUpdate={(location) => {
                    console.log(`Ubicación actualizada para pedido ${selectedOrder}:`, location)
                  }}
                />
              ) : (
                <Card className="border-blue-200">
                  <CardContent className="p-8 text-center">
                    <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Selecciona un Pedido</h3>
                    <p className="text-gray-500">Elige un pedido de la lista para activar el seguimiento GPS</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
