"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Navigation, Truck, Home, Clock, Route, Maximize2, AlertTriangle } from "lucide-react"
import { useGoogleMaps } from "./google-maps-provider"

interface Location {
  lat: number
  lng: number
  timestamp?: number
}

interface GoogleMapComponentProps {
  driverLocation: Location
  customerLocation: Location
  driverInfo: {
    name: string
    phone: string
    vehicle: string
  }
  customerAddress: string
  onRouteCalculated?: (distance: number, duration: number) => void
  className?: string
}

export default function GoogleMapComponent({
  driverLocation,
  customerLocation,
  driverInfo,
  customerAddress,
  onRouteCalculated,
  className = "",
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const { isLoaded, loadError, google } = useGoogleMaps()

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [driverMarker, setDriverMarker] = useState<google.maps.Marker | null>(null)
  const [customerMarker, setCustomerMarker] = useState<google.maps.Marker | null>(null)
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Inicializar el mapa
  const initializeMap = useCallback(() => {
    if (!google || !mapRef.current) return

    const mapOptions: google.maps.MapOptions = {
      center: driverLocation,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: "greedy",
    }

    const mapInstance = new google.maps.Map(mapRef.current, mapOptions)
    setMap(mapInstance)

    // Crear capa de tráfico
    const traffic = new google.maps.TrafficLayer()
    setTrafficLayer(traffic)

    // Crear renderer de direcciones
    const renderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#4F46E5",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    })
    renderer.setMap(mapInstance)
    setDirectionsRenderer(renderer)
  }, [google, driverLocation])

  // Crear marcadores personalizados
  const createDriverMarker = useCallback(() => {
    if (!google || !map) return

    // Crear icono personalizado para el repartidor
    const driverIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: "#3B82F6",
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 3,
    }

    const marker = new google.maps.Marker({
      position: driverLocation,
      map: map,
      icon: driverIcon,
      title: `Repartidor: ${driverInfo.name}`,
      animation: google.maps.Animation.DROP,
    })

    // Info window para el repartidor
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-blue-800">${driverInfo.name}</h3>
          <p class="text-sm text-gray-600">${driverInfo.vehicle}</p>
          <p class="text-xs text-gray-500">Última actualización: ${new Date().toLocaleTimeString("es-CL")}</p>
        </div>
      `,
    })

    marker.addListener("click", () => {
      infoWindow.open(map, marker)
    })

    setDriverMarker(marker)
  }, [google, map, driverLocation, driverInfo])

  const createCustomerMarker = useCallback(() => {
    if (!google || !map) return

    // Crear icono personalizado para el cliente
    const customerIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#EF4444",
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2,
    }

    const marker = new google.maps.Marker({
      position: customerLocation,
      map: map,
      icon: customerIcon,
      title: "Dirección de entrega",
    })

    // Info window para el cliente
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="p-2">
          <h3 class="font-semibold text-red-800">Dirección de Entrega</h3>
          <p class="text-sm text-gray-600">${customerAddress}</p>
          <p class="text-xs text-gray-500">Lat: ${customerLocation.lat.toFixed(6)}, Lng: ${customerLocation.lng.toFixed(6)}</p>
        </div>
      `,
    })

    marker.addListener("click", () => {
      infoWindow.open(map, marker)
    })

    setCustomerMarker(marker)
  }, [google, map, customerLocation, customerAddress])

  // Calcular y mostrar la ruta
  const calculateRoute = useCallback(() => {
    if (!google || !directionsRenderer) return

    const directionsService = new google.maps.DirectionsService()

    const request: google.maps.DirectionsRequest = {
      origin: driverLocation,
      destination: customerLocation,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidHighways: false,
      avoidTolls: false,
      optimizeWaypoints: true,
    }

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result)

        const route = result.routes[0]
        const leg = route.legs[0]

        setRouteInfo({
          distance: leg.distance?.text || "N/A",
          duration: leg.duration?.text || "N/A",
        })

        // Callback con información de la ruta
        if (onRouteCalculated && leg.distance && leg.duration) {
          onRouteCalculated(leg.distance.value / 1000, leg.duration.value / 60) // km y minutos
        }
      } else {
        console.error("Error calculating route:", status)
      }
    })
  }, [google, directionsRenderer, driverLocation, customerLocation, onRouteCalculated])

  // Actualizar posición del repartidor
  const updateDriverPosition = useCallback(() => {
    if (driverMarker) {
      driverMarker.setPosition(driverLocation)

      // Animar el marcador
      driverMarker.setAnimation(google.maps.Animation.BOUNCE)
      setTimeout(() => {
        driverMarker.setAnimation(null)
      }, 1000)

      // Recalcular ruta si es necesario
      calculateRoute()
    }
  }, [driverMarker, driverLocation, calculateRoute])

  // Centrar mapa en ambos puntos
  const fitMapToBounds = useCallback(() => {
    if (!map || !google) return

    const bounds = new google.maps.LatLngBounds()
    bounds.extend(driverLocation)
    bounds.extend(customerLocation)

    map.fitBounds(bounds, { padding: 50 })
  }, [map, google, driverLocation, customerLocation])

  // Toggle capa de tráfico
  const toggleTrafficLayer = useCallback(() => {
    if (!trafficLayer || !map) return

    if (trafficLayer.getMap()) {
      trafficLayer.setMap(null)
    } else {
      trafficLayer.setMap(map)
    }
  }, [trafficLayer, map])

  // Toggle pantalla completa
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Efectos
  useEffect(() => {
    if (isLoaded) {
      initializeMap()
    }
  }, [isLoaded, initializeMap])

  useEffect(() => {
    if (map) {
      createDriverMarker()
      createCustomerMarker()
    }
  }, [map, createDriverMarker, createCustomerMarker])

  useEffect(() => {
    if (directionsRenderer) {
      calculateRoute()
    }
  }, [directionsRenderer, calculateRoute])

  useEffect(() => {
    updateDriverPosition()
  }, [driverLocation, updateDriverPosition])

  useEffect(() => {
    if (map) {
      fitMapToBounds()
    }
  }, [fitMapToBounds])

  if (loadError) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{loadError}</AlertDescription>
      </Alert>
    )
  }

  if (!isLoaded) {
    return (
      <Card className="border-amber-200">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Cargando Google Maps...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Información de la Ruta */}
      {routeInfo && (
        <Card className="border-amber-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Route className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Distancia</p>
                <p className="font-semibold text-amber-800">{routeInfo.distance}</p>
              </div>
              <div className="text-center">
                <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Tiempo Est.</p>
                <p className="font-semibold text-amber-800">{routeInfo.duration}</p>
              </div>
              <div className="text-center">
                <Truck className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Repartidor</p>
                <Badge className="bg-blue-500 text-white text-xs">{driverInfo.name}</Badge>
              </div>
              <div className="text-center">
                <MapPin className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Estado</p>
                <Badge className="bg-green-500 text-white text-xs animate-pulse">En Vivo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa de Google */}
      <Card className={`border-amber-200 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Seguimiento GPS en Tiempo Real
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={toggleTrafficLayer} className="bg-transparent">
                🚦 Tráfico
              </Button>
              <Button size="sm" variant="outline" onClick={fitMapToBounds} className="bg-transparent">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={toggleFullscreen} className="bg-transparent">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={mapRef}
            className={`w-full bg-gray-100 ${isFullscreen ? "h-screen" : "h-96"}`}
            style={{ minHeight: isFullscreen ? "100vh" : "400px" }}
          />

          {/* Controles superpuestos */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Repartidor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Destino</span>
            </div>
          </div>

          {isFullscreen && (
            <Button
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white"
              size="sm"
              onClick={toggleFullscreen}
            >
              ✕ Cerrar
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Información del Repartidor
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Nombre:</strong> {driverInfo.name}
              </p>
              <p>
                <strong>Vehículo:</strong> {driverInfo.vehicle}
              </p>
              <p>
                <strong>Coordenadas:</strong> {driverLocation.lat.toFixed(6)}, {driverLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500">
                Actualizado: {new Date(driverLocation.timestamp || Date.now()).toLocaleTimeString("es-CL")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <Home className="h-4 w-4" />
              Dirección de Entrega
            </h4>
            <div className="space-y-1 text-sm">
              <p>{customerAddress}</p>
              <p>
                <strong>Coordenadas:</strong> {customerLocation.lat.toFixed(6)}, {customerLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500">Destino final del pedido</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
