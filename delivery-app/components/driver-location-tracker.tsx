"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Truck, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { useGPSTracking } from "@/hooks/useGPSTracking"

interface DriverLocationTrackerProps {
  driverId: string
  orderId: string
  onLocationUpdate?: (location: { lat: number; lng: number }) => void
}

export default function DriverLocationTracker({ driverId, orderId, onLocationUpdate }: DriverLocationTrackerProps) {
  const [isDriverMode, setIsDriverMode] = useState(false)
  const [trackingHistory, setTrackingHistory] = useState<
    Array<{
      lat: number
      lng: number
      timestamp: number
      speed?: number
    }>
  >([])

  const { location, error, isTracking, isSupported, startTracking, stopTracking, requestPermission } = useGPSTracking({
    enableHighAccuracy: true,
    updateInterval: 3000, // Actualizar cada 3 segundos
    timeout: 15000,
  })

  // Actualizar historial cuando cambia la ubicación
  useEffect(() => {
    if (location) {
      setTrackingHistory((prev) => [
        ...prev.slice(-50), // Mantener solo las últimas 50 ubicaciones
        {
          lat: location.lat,
          lng: location.lng,
          timestamp: location.timestamp,
          speed: location.speed,
        },
      ])

      // Notificar cambio de ubicación
      if (onLocationUpdate) {
        onLocationUpdate({ lat: location.lat, lng: location.lng })
      }

      // En una implementación real, aquí se enviaría la ubicación al servidor
      sendLocationToServer(location)
    }
  }, [location, onLocationUpdate])

  const sendLocationToServer = async (location: any) => {
    try {
      // Simulación de envío al servidor
      console.log("Enviando ubicación al servidor:", {
        driverId,
        orderId,
        location,
        timestamp: new Date().toISOString(),
      })

      // En producción sería algo como:
      // await fetch('/api/driver/location', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ driverId, orderId, location })
      // })
    } catch (error) {
      console.error("Error enviando ubicación:", error)
    }
  }

  const handleStartTracking = async () => {
    const hasPermission = await requestPermission()
    if (hasPermission) {
      setIsDriverMode(true)
      startTracking()
    } else {
      alert("Se necesitan permisos de ubicación para el seguimiento GPS")
    }
  }

  const handleStopTracking = () => {
    stopTracking()
    setIsDriverMode(false)
  }

  const calculateSpeed = (): number => {
    if (trackingHistory.length < 2) return 0

    const recent = trackingHistory.slice(-2)
    const [prev, current] = recent

    const distance = calculateDistance({ lat: prev.lat, lng: prev.lng }, { lat: current.lat, lng: current.lng })

    const timeHours = (current.timestamp - prev.timestamp) / (1000 * 60 * 60)
    return distance / timeHours // km/h
  }

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  if (!isSupported) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>Tu dispositivo no soporta geolocalización GPS</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Panel de Control del Repartidor */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Control de Seguimiento GPS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={isTracking ? "bg-green-500" : "bg-gray-500"}>
                {isTracking ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activo
                  </>
                ) : (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    Inactivo
                  </>
                )}
              </Badge>
              <span className="text-sm text-gray-600">Pedido #{orderId}</span>
            </div>

            {!isTracking ? (
              <Button onClick={handleStartTracking} className="bg-green-600 hover:bg-green-700">
                <Navigation className="h-4 w-4 mr-2" />
                Iniciar Seguimiento
              </Button>
            ) : (
              <Button onClick={handleStopTracking} variant="destructive">
                Detener Seguimiento
              </Button>
            )}
          </div>

          {error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {location && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-amber-50 rounded-lg">
              <div className="text-center">
                <MapPin className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Latitud</p>
                <p className="font-mono text-sm">{location.lat.toFixed(6)}</p>
              </div>

              <div className="text-center">
                <MapPin className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Longitud</p>
                <p className="font-mono text-sm">{location.lng.toFixed(6)}</p>
              </div>

              <div className="text-center">
                <Navigation className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Precisión</p>
                <p className="font-mono text-sm">{Math.round(location.accuracy)}m</p>
              </div>

              <div className="text-center">
                <Truck className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-xs text-gray-600">Velocidad</p>
                <p className="font-mono text-sm">
                  {location.speed ? `${Math.round(location.speed * 3.6)} km/h` : `${Math.round(calculateSpeed())} km/h`}
                </p>
              </div>
            </div>
          )}

          {trackingHistory.length > 0 && (
            <div className="text-sm text-gray-600">
              <p>Puntos registrados: {trackingHistory.length}</p>
              <p>
                Última actualización:{" "}
                {new Date(trackingHistory[trackingHistory.length - 1]?.timestamp).toLocaleTimeString("es-CL")}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Ubicaciones */}
      {trackingHistory.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 text-sm">Historial de Ubicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {trackingHistory
                .slice(-10)
                .reverse()
                .map((point, index) => (
                  <div key={index} className="flex justify-between items-center text-xs p-2 bg-gray-50 rounded">
                    <span className="font-mono">
                      {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                    </span>
                    <span className="text-gray-500">{new Date(point.timestamp).toLocaleTimeString("es-CL")}</span>
                    {point.speed && <span className="text-blue-600">{Math.round(point.speed * 3.6)} km/h</span>}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
