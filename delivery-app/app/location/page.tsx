"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calculator, Truck, Clock } from "lucide-react"
import Navigation from "@/components/navigation"
import { GoogleMapsProvider } from "@/components/google-maps-provider"
import AddressAutocomplete from "@/components/address-autocomplete"

export default function LocationPage() {
  const [selectedAddress, setSelectedAddress] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null)
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const coverageAreas = [
    { zone: "Centro", cost: 2000, time: "20-30 min" },
    { zone: "Las Condes", cost: 3000, time: "30-40 min" },
    { zone: "Providencia", cost: 2500, time: "25-35 min" },
    { zone: "Ñuñoa", cost: 3500, time: "35-45 min" },
    { zone: "La Reina", cost: 4000, time: "40-50 min" },
    { zone: "Vitacura", cost: 3500, time: "35-45 min" },
    { zone: "San Miguel", cost: 4500, time: "45-55 min" },
    { zone: "Maipú", cost: 5000, time: "50-60 min" },
  ]

  const handleAddressSelect = (address: string, location: { lat: number; lng: number }) => {
    setSelectedAddress(address)
    setSelectedLocation(location)
    calculateDeliveryWithGoogleMaps(location)
  }

  const calculateDeliveryWithGoogleMaps = async (destination: { lat: number; lng: number }) => {
    setIsCalculating(true)

    // Simular cálculo con Google Maps Distance Matrix
    setTimeout(() => {
      // En una implementación real, usarías Google Maps Distance Matrix API
      const randomArea = coverageAreas[Math.floor(Math.random() * coverageAreas.length)]
      setDeliveryCost(randomArea.cost)
      setDeliveryTime(randomArea.time)
      setIsCalculating(false)
    }, 2000)
  }

  return (
    <GoogleMapsProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-amber-800 mb-8 flex items-center gap-2">
              <MapPin className="h-8 w-8" />
              Ubicación y Delivery
            </h1>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Calculadora de Delivery con Google Maps */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800 flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calcular Costo de Delivery
                  </CardTitle>
                  <CardDescription>
                    Usa Google Maps para encontrar tu dirección y calcular el costo exacto
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    placeholder="Busca tu dirección con Google Maps..."
                    label="Dirección de Entrega"
                  />

                  {selectedLocation && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">Dirección seleccionada:</p>
                      <p className="text-sm text-blue-600">{selectedAddress}</p>
                      <p className="text-xs text-blue-500">
                        Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                      </p>
                    </div>
                  )}

                  {isCalculating && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                      <p className="text-amber-800">Calculando con Google Maps...</p>
                    </div>
                  )}

                  {deliveryCost !== null && deliveryTime && !isCalculating && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h3 className="font-semibold text-amber-800 mb-3">Resultado del Cálculo:</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-amber-600" />
                            Costo de delivery:
                          </span>
                          <Badge className="bg-amber-600 text-white">${deliveryCost.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-600" />
                            Tiempo estimado:
                          </span>
                          <Badge variant="outline" className="border-amber-600 text-amber-700">
                            {deliveryTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Información de Cobertura */}
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Zonas de Cobertura
                  </CardTitle>
                  <CardDescription>Áreas donde realizamos delivery y sus tarifas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {coverageAreas.map((area, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-amber-800">{area.zone}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {area.time}
                          </p>
                        </div>
                        <Badge className="bg-amber-600 text-white">${area.cost.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Información Adicional */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Política de Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Truck className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800">Delivery Gratuito</h4>
                      <p className="text-sm text-gray-600">En compras superiores a $30.000 dentro del radio céntrico</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800">Horarios de Entrega</h4>
                      <p className="text-sm text-gray-600">Lunes a Domingo de 10:00 a 23:00 hrs</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800">Seguimiento GPS</h4>
                      <p className="text-sm text-gray-600">Seguimiento en tiempo real con Google Maps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Condiciones Especiales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Pedido Mínimo</h4>
                    <p className="text-sm text-gray-600">$15.000 para todas las zonas de cobertura</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Cálculo Preciso</h4>
                    <p className="text-sm text-gray-600">
                      Usamos Google Maps para calcular distancias y tiempos reales
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Eventos Especiales</h4>
                    <p className="text-sm text-gray-600">Descuentos en delivery para pedidos de más de $50.000</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </GoogleMapsProvider>
  )
}
