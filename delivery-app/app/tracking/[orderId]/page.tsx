"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { GoogleMapsProvider } from "@/components/google-maps-provider"
import GoogleMapComponent from "@/components/google-map-component"
import DriverLocationTracker from "@/components/driver-location-tracker"

interface OrderStatus {
  id: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "in_transit" | "delivered" | "cancelled"
  estimatedTime: string
  currentStep: number
  customerAddress: string
  driver?: {
    name: string
    phone: string
    vehicle: string
    location: { lat: number; lng: number }
  }
  timeline: {
    step: string
    status: "completed" | "current" | "pending"
    time?: string
    description: string
  }[]
}

export default function TrackingPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [isDriverView, setIsDriverView] = useState(false)

  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [driverLocation, setDriverLocation] = useState({ lat: -33.4569, lng: -70.6483, timestamp: Date.now() })

  // Simulación de datos del pedido
  useEffect(() => {
    const fetchOrderStatus = () => {
      const mockOrder: OrderStatus = {
        id: orderId,
        status: "in_transit",
        estimatedTime: "15-20 min",
        currentStep: 4,
        customerAddress: "Av. Providencia 1234, Providencia, Santiago, Chile",
        driver: {
          name: "Carlos Rodríguez",
          phone: "+56 9 8765 4321",
          vehicle: "Moto Honda - ABC123",
          location: driverLocation,
        },
        timeline: [
          {
            step: "Pedido Recibido",
            status: "completed",
            time: "14:30",
            description: "Tu pedido ha sido recibido y está siendo procesado",
          },
          {
            step: "Pedido Confirmado",
            status: "completed",
            time: "14:32",
            description: "Hemos confirmado tu pedido y el pago",
          },
          {
            step: "Preparando Pedido",
            status: "completed",
            time: "14:35",
            description: "Estamos preparando tus productos con cuidado",
          },
          {
            step: "Listo para Envío",
            status: "completed",
            time: "14:45",
            description: "Tu pedido está listo y asignado a un repartidor",
          },
          {
            step: "En Camino",
            status: "current",
            time: "14:50",
            description: "El repartidor está en camino a tu dirección",
          },
          {
            step: "Entregado",
            status: "pending",
            description: "Tu pedido será entregado en tu puerta",
          },
        ],
      }

      setOrderStatus(mockOrder)
      setLoading(false)
    }

    fetchOrderStatus()

    // Simular movimiento del repartidor
    const moveDriver = () => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        timestamp: Date.now(),
      }))
    }

    const interval = setInterval(moveDriver, 10000) // Mover cada 10 segundos
    return () => clearInterval(interval)
  }, [orderId])

  // Actualizar ubicación del conductor en el estado del pedido
  useEffect(() => {
    if (orderStatus) {
      setOrderStatus((prev) =>
        prev
          ? {
              ...prev,
              driver: prev.driver
                ? {
                    ...prev.driver,
                    location: driverLocation,
                  }
                : undefined,
            }
          : null,
      )
    }
  }, [driverLocation])

  const simulateStatusUpdate = () => {
    if (!orderStatus) return

    const nextStatuses = {
      pending: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "in_transit",
      in_transit: "delivered",
    }

    const newStatus = nextStatuses[orderStatus.status as keyof typeof nextStatuses]
    if (newStatus) {
      setOrderStatus((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as any,
              currentStep: prev.currentStep + 1,
              timeline: prev.timeline.map((item, index) => {
                if (index === prev.currentStep) {
                  return {
                    ...item,
                    status: "completed" as const,
                    time: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
                  }
                }
                if (index === prev.currentStep + 1) {
                  return {
                    ...item,
                    status: "current" as const,
                    time: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
                  }
                }
                return item
              }),
            }
          : null,
      )
    }
  }

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

  const progressPercentage = orderStatus ? (orderStatus.currentStep / (orderStatus.timeline.length - 1)) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 font-semibold">Cargando información del pedido...</p>
        </div>
      </div>
    )
  }

  if (!orderStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Pedido no encontrado</h2>
            <p className="text-gray-600 mb-4">No pudimos encontrar información para este pedido.</p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700">Volver al Inicio</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <GoogleMapsProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/" className="text-amber-600 hover:text-amber-700 mb-4 inline-block">
                ← Volver al inicio
              </Link>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-amber-800">Seguimiento de Pedido #{orderStatus.id}</h1>
                <div className="flex gap-2">
                  <Button
                    variant={isDriverView ? "outline" : "default"}
                    onClick={() => setIsDriverView(false)}
                    size="sm"
                  >
                    Vista Cliente
                  </Button>
                  <Button
                    variant={isDriverView ? "default" : "outline"}
                    onClick={() => setIsDriverView(true)}
                    size="sm"
                  >
                    Vista Repartidor
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(orderStatus.status)} text-white`}>
                  {getStatusText(orderStatus.status)}
                </Badge>
                <span className="text-gray-600 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Tiempo estimado: {orderStatus.estimatedTime}
                </span>
              </div>
            </div>

            {isDriverView ? (
              /* Vista del Repartidor */
              <DriverLocationTracker
                driverId="driver-001"
                orderId={orderStatus.id}
                onLocationUpdate={(location) => {
                  setDriverLocation({ ...location, timestamp: Date.now() })
                }}
              />
            ) : (
              /* Vista del Cliente */
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Timeline del Pedido */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-amber-800 flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Estado del Pedido
                      </CardTitle>
                      <CardDescription>Sigue el progreso de tu pedido en tiempo real</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progreso</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="space-y-4">
                        {orderStatus.timeline.map((item, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  item.status === "completed"
                                    ? "bg-green-500 text-white"
                                    : item.status === "current"
                                      ? "bg-amber-500 text-white animate-pulse"
                                      : "bg-gray-200 text-gray-400"
                                }`}
                              >
                                {item.status === "completed" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : item.status === "current" ? (
                                  <Clock className="h-4 w-4" />
                                ) : (
                                  <div className="w-2 h-2 bg-current rounded-full" />
                                )}
                              </div>
                              {index < orderStatus.timeline.length - 1 && (
                                <div
                                  className={`w-0.5 h-12 mt-2 ${
                                    item.status === "completed" ? "bg-green-500" : "bg-gray-200"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 pb-8">
                              <div className="flex items-center gap-2 mb-1">
                                <h3
                                  className={`font-semibold ${
                                    item.status === "current" ? "text-amber-800" : "text-gray-800"
                                  }`}
                                >
                                  {item.step}
                                </h3>
                                {item.time && (
                                  <Badge variant="outline" className="text-xs">
                                    {item.time}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-amber-200">
                        <Button
                          onClick={simulateStatusUpdate}
                          variant="outline"
                          className="w-full bg-transparent"
                          disabled={orderStatus.status === "delivered"}
                        >
                          🔄 Simular Actualización (Demo)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Google Maps en Tiempo Real */}
                  {orderStatus.driver && orderStatus.status === "in_transit" && (
                    <GoogleMapComponent
                      driverLocation={driverLocation}
                      customerLocation={{ lat: -33.4489, lng: -70.6693 }} // Santiago centro
                      driverInfo={orderStatus.driver}
                      customerAddress={orderStatus.customerAddress}
                      onRouteCalculated={(distance, duration) => {
                        console.log(`Ruta calculada: ${distance}km, ${duration}min`)
                      }}
                    />
                  )}
                </div>

                {/* Información del Repartidor y Acciones */}
                <div className="space-y-6">
                  {orderStatus.driver && orderStatus.status === "in_transit" && (
                    <Card className="border-amber-200">
                      <CardHeader>
                        <CardTitle className="text-amber-800 flex items-center gap-2">
                          <Truck className="h-5 w-5" />
                          Tu Repartidor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-amber-800">{orderStatus.driver.name}</p>
                            <p className="text-sm text-gray-600">{orderStatus.driver.vehicle}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            <Phone className="h-4 w-4 mr-2" />
                            Llamar
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>

                        <div className="bg-amber-50 p-3 rounded-lg">
                          <p className="text-sm text-amber-800 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Google Maps GPS activo
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-amber-200">
                    <CardHeader>
                      <CardTitle className="text-amber-800">¿Necesitas Ayuda?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Phone className="h-4 w-4 mr-2" />
                        Llamar a Soporte
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat en Vivo
                      </Button>
                      <Link href="/contact" className="block">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <MapPin className="h-4 w-4 mr-2" />
                          Centro de Ayuda
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
