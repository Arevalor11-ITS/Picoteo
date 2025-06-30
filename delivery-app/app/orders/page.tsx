"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Eye, Clock, CheckCircle, Truck } from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"

interface Order {
  id: string
  date: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "in_transit" | "delivered" | "cancelled"
  total: number
  items: string[]
  estimatedTime?: string
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "2024-01-15 14:30",
      status: "in_transit",
      total: 41000,
      items: ["Tabla Premium", "Pisco Sour x2"],
      estimatedTime: "15-20 min",
    },
    {
      id: "ORD-002",
      date: "2024-01-14 19:45",
      status: "delivered",
      total: 28000,
      items: ["Vino Tinto Reserva", "Tabla Clásica"],
    },
    {
      id: "ORD-003",
      date: "2024-01-13 16:20",
      status: "delivered",
      total: 35000,
      items: ["Whisky Premium", "Picoteo Ejecutivo"],
    },
    {
      id: "ORD-004",
      date: "2024-01-12 20:15",
      status: "cancelled",
      total: 22000,
      items: ["Gin Tonic x2", "Tabla Vegetariana"],
    },
  ]

  const statusOptions = [
    { value: "all", label: "Todos los estados" },
    { value: "pending", label: "Pendiente" },
    { value: "confirmed", label: "Confirmado" },
    { value: "preparing", label: "Preparando" },
    { value: "ready", label: "Listo" },
    { value: "in_transit", label: "En Camino" },
    { value: "delivered", label: "Entregado" },
    { value: "cancelled", label: "Cancelado" },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      confirmed: "bg-blue-500",
      preparing: "bg-orange-500",
      ready: "bg-purple-500",
      in_transit: "bg-green-500",
      delivered: "bg-emerald-500",
      cancelled: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusText = (status: string) => {
    const texts = {
      pending: "Pendiente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      ready: "Listo",
      in_transit: "En Camino",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }
    return texts[status as keyof typeof texts] || "Desconocido"
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      ready: Package,
      in_transit: Truck,
      delivered: CheckCircle,
      cancelled: Clock,
    }
    const Icon = icons[status as keyof typeof icons] || Clock
    return <Icon className="h-4 w-4" />
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Mis Pedidos
          </h1>

          {/* Filtros */}
          <Card className="mb-8 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por ID de pedido o productos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado del pedido" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Pedidos */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-amber-800">Pedido #{order.id}</h3>
                        <Badge className={`${getStatusColor(order.status)} text-white flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </Badge>
                        {order.estimatedTime && order.status === "in_transit" && (
                          <Badge variant="outline" className="text-green-700 border-green-300 animate-pulse">
                            <Clock className="h-3 w-3 mr-1" />
                            {order.estimatedTime}
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <p>Fecha: {new Date(order.date).toLocaleString("es-CL")}</p>
                        <p>Productos: {order.items.join(", ")}</p>
                      </div>

                      <div className="text-xl font-bold text-amber-600">${order.total.toLocaleString()}</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link href={`/tracking/${order.id}`}>
                        <Button className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Seguimiento
                        </Button>
                      </Link>

                      {order.status === "delivered" && (
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                          Volver a Pedir
                        </Button>
                      )}

                      {(order.status === "pending" || order.status === "confirmed") && (
                        <Button variant="destructive" className="w-full sm:w-auto">
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron pedidos</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Intenta con otros términos de búsqueda o cambia el filtro"
                  : "Aún no has realizado ningún pedido"}
              </p>
              <Link href="/">
                <Button className="bg-amber-600 hover:bg-amber-700">Hacer mi Primer Pedido</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
