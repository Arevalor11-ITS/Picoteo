"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Truck, Home, Clock, Route } from "lucide-react"

interface Location {
  lat: number
  lng: number
  timestamp: number
}

interface DeliveryRoute {
  driverLocation: Location
  customerLocation: Location
  estimatedDistance: number
  estimatedTime: number
  route: Location[]
}

interface RealTimeMapProps {
  orderId: string
  driverInfo: {
    name: string
    phone: string
    vehicle: string
  }
  customerAddress: string
}

export default function RealTimeMap({ orderId, driverInfo, customerAddress }: RealTimeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [deliveryRoute, setDeliveryRoute] = useState<DeliveryRoute | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [mapInstance, setMapInstance] = useState<any>(null)

  // Simulación de ubicaciones en Santiago, Chile
  const customerLocation: Location = {
    lat: -33.4489,
    lng: -70.6693,
    timestamp: Date.now(),
  }

  const [driverLocation, setDriverLocation] = useState<Location>({
    lat: -33.4569, // Ubicación inicial del repartidor
    lng: -70.6483,
    timestamp: Date.now(),
  })

  // Simular movimiento del repartidor hacia el cliente
  useEffect(() => {
    const simulateDriverMovement = () => {
      setDriverLocation((prevLocation) => {
        const latDiff = customerLocation.lat - prevLocation.lat
        const lngDiff = customerLocation.lng - prevLocation.lng

        // Mover el repartidor gradualmente hacia el cliente
        const moveSpeed = 0.0001 // Velocidad de movimiento

        const newLat = prevLocation.lat + latDiff * moveSpeed
        const newLng = prevLocation.lng + lngDiff * moveSpeed

        return {
          lat: newLat,
          lng: newLng,
          timestamp: Date.now(),
        }
      })
      setLastUpdate(new Date())
    }

    const interval = setInterval(simulateDriverMovement, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, []) // Removed customerLocation from dependencies

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = ((loc2.lat - loc1.lat) * Math.PI) / 180
    const dLng = ((loc2.lng - loc1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((loc1.lat * Math.PI) / 180) *
        Math.cos((loc2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Calcular tiempo estimado basado en distancia
  const calculateEstimatedTime = (distance: number): number => {
    const averageSpeed = 25 // km/h promedio en ciudad
    return Math.round((distance / averageSpeed) * 60) // en minutos
  }

  // Generar ruta simulada
  const generateRoute = (start: Location, end: Location): Location[] => {
    const route: Location[] = []
    const steps = 10

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const lat = start.lat + (end.lat - start.lat) * progress
      const lng = start.lng + (end.lng - start.lng) * progress
      route.push({ lat, lng, timestamp: Date.now() })
    }

    return route
  }

  // Actualizar información de la ruta
  useEffect(() => {
    const distance = calculateDistance(driverLocation, customerLocation)
    const estimatedTime = calculateEstimatedTime(distance)
    const route = generateRoute(driverLocation, customerLocation)

    setDeliveryRoute({
      driverLocation,
      customerLocation,
      estimatedDistance: distance,
      estimatedTime,
      route,
    })
    setIsLoading(false)
  }, [driverLocation])

  // Inicializar mapa (simulación de Google Maps o Leaflet)
  useEffect(() => {
    if (mapRef.current && !mapInstance) {
      // En una implementación real, aquí se inicializaría Google Maps o Leaflet
      const mockMap = {
        center: driverLocation,
        zoom: 14,
        markers: [
          { position: driverLocation, type: "driver" },
          { position: customerLocation, type: "customer" },
        ],
      }
      setMapInstance(mockMap)
    }
  }, [mapRef, mapInstance, driverLocation])

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  const getDriverStatus = (): { status: string; color: string } => {
    if (!deliveryRoute) return { status: "Conectando...", color: "bg-gray-500" }

    if (deliveryRoute.estimatedDistance < 0.1) {
      return { status: "Llegando", color: "bg-green-500 animate-pulse" }
    } else if (deliveryRoute.estimatedDistance < 0.5) {
      return { status: "Muy cerca", color: "bg-orange-500" }
    } else {
      return { status: "En camino", color: "bg-blue-500" }
    }
  }

  const driverStatus = getDriverStatus()

  return (
    <div className="space-y-6">
      {/* Información del Estado */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Seguimiento GPS en Tiempo Real
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-amber-100 p-3 rounded-lg mb-2">
                <Route className="h-6 w-6 text-amber-600 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Distancia</p>
              <p className="font-semibold text-amber-800">
                {deliveryRoute ? `${deliveryRoute.estimatedDistance.toFixed(1)} km` : "Calculando..."}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 p-3 rounded-lg mb-2">
                <Clock className="h-6 w-6 text-amber-600 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Tiempo Est.</p>
              <p className="font-semibold text-amber-800">
                {deliveryRoute ? formatTime(deliveryRoute.estimatedTime) : "Calculando..."}
              </p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 p-3 rounded-lg mb-2">
                <Truck className="h-6 w-6 text-amber-600 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Estado</p>
              <Badge className={`${driverStatus.color} text-white text-xs`}>{driverStatus.status}</Badge>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 p-3 rounded-lg mb-2">
                <MapPin className="h-6 w-6 text-amber-600 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Última Act.</p>
              <p className="font-semibold text-amber-800 text-xs">
                {lastUpdate.toLocaleTimeString("es-CL", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapa Interactivo */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa en Tiempo Real
            </span>
            <Badge variant="outline" className="text-green-600 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              En vivo
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={mapRef}
            className="w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg relative overflow-hidden border-2 border-amber-200"
          >
            {/* Simulación visual del mapa */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
              {/* Grid de calles simulado */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(10)].map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
                ))}
                {[...Array(10)].map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
                ))}
              </div>

              {/* Marcador del Repartidor */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${50 + (driverLocation.lng + 70.6693) * 1000}%`,
                  top: `${50 - (driverLocation.lat + 33.4489) * 1000}%`,
                }}
              >
                <div className="relative">
                  <div className="bg-blue-500 p-3 rounded-full shadow-lg animate-pulse">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {driverInfo.name}
                  </div>
                </div>
              </div>

              {/* Marcador del Cliente */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{
                  left: `${50 + (customerLocation.lng + 70.6693) * 1000}%`,
                  top: `${50 - (customerLocation.lat + 33.4489) * 1000}%`,
                }}
              >
                <div className="relative">
                  <div className="bg-red-500 p-3 rounded-full shadow-lg">
                    <Home className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    Tu ubicación
                  </div>
                </div>
              </div>

              {/* Línea de ruta */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <line
                  x1={`${50 + (driverLocation.lng + 70.6693) * 1000}%`}
                  y1={`${50 - (driverLocation.lat + 33.4489) * 1000}%`}
                  x2={`${50 + (customerLocation.lng + 70.6693) * 1000}%`}
                  y2={`${50 - (customerLocation.lat + 33.4489) * 1000}%`}
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="10,5"
                  className="animate-pulse"
                />
              </svg>

              {/* Información superpuesta */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Repartidor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Destino</span>
                </div>
              </div>

              {/* Controles del mapa */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                  +
                </Button>
                <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                  -
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Cargando ubicación...</p>
                </div>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-3 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-1">Coordenadas del Repartidor</h4>
              <p className="text-sm text-gray-600">
                Lat: {driverLocation.lat.toFixed(6)}, Lng: {driverLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Actualizado: {new Date(driverLocation.timestamp).toLocaleTimeString("es-CL")}
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">Dirección de Entrega</h4>
              <p className="text-sm text-gray-600">{customerAddress}</p>
              <p className="text-xs text-gray-500 mt-1">
                Lat: {customerLocation.lat.toFixed(6)}, Lng: {customerLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
